using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;
using Backend.Data;
using Backend.Utilities;
using Amazon.CognitoIdentityProvider.Model;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ISimpleAuthService _authService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly JwtTokenGenerator _jwtTokenGenerator;

    public AuthController(ISimpleAuthService authService, ApplicationDbContext context, ILogger<AuthController> logger, JwtTokenGenerator jwtTokenGenerator)
    {
        _authService = authService;
        _context = context;
        _logger = logger;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    /// <summary>
    /// Authentifie un utilisateur et retourne les tokens JWT
    /// </summary>
    [HttpPost("signin")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SignInResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> SignIn([FromBody] SignInRequestDto request)
    {
        // Accepter soit email soit username
        var identifier = request.Email ?? request.Username;
        
        if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Email or username and password are required" });
        }

        try
        {
            var (success, message, user) = await _authService.LoginAsync(identifier, request.Password);

            if (!success || user == null)
            {
                return Unauthorized(new { error = message });
            }

            // Si l'email n'est pas vérifié, envoyer un code de vérification
            if (!user.IsEmailVerified)
            {
                try
                {
                    // Générer un nouveau code de vérification
                    var verificationCode = new Random().Next(100000, 999999).ToString();
                    user.VerificationCode = verificationCode;
                    user.VerificationCodeExpiredAt = DateTime.UtcNow.AddHours(24);
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    
                    await _authService.SendVerificationEmailAsync(user.Email, verificationCode);
                    _logger.LogInformation("Verification email sent to {Email} on login", user.Email);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to send verification email on login for {Email}", user.Email);
                    // Continuer même si l'email ne s'envoie pas
                }
            }

            // Générer JWT
            var claimsDict = new Dictionary<string, object>
            {
                { "sub", user.Email },
                { "email", user.Email },
                { "name", $"{user.FirstName} {user.LastName}" },
                { "role", user.Role }
            };
            
            var jwtToken = _jwtTokenGenerator.GenerateToken(claimsDict);

            var response = new SignInResponse
            {
                AccessToken = jwtToken,
                RefreshToken = "temp-refresh-token-" + Guid.NewGuid().ToString().Substring(0, 8),
                IdToken = jwtToken,
                ExpiresIn = 3600,
                TokenType = "Bearer",
                User = new { id = user.Id, email = user.Email, firstName = user.FirstName, lastName = user.LastName, isEmailVerified = user.IsEmailVerified }
            };

            _logger.LogInformation("User {Username} signed in successfully", request.Username);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign in");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Crée un nouveau compte utilisateur
    /// </summary>
    [HttpPost("signup")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthSignUpResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequestDto request)
    {
        // Valider les champs requis
        var name = request.Name ?? $"{request.FirstName} {request.LastName}".Trim();
        
        if (string.IsNullOrWhiteSpace(request.Email) || 
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new { error = "Email, password, and name are required" });
        }

        try
        {
            // Enregistrer l'utilisateur
            var (success, message, user) = await _authService.RegisterAsync(
                request.Email, 
                request.Password, 
                request.FirstName ?? "", 
                request.LastName ?? "", 
                request.Phone
            );

            if (!success || user == null)
            {
                return BadRequest(new { error = message });
            }

            // Générer un code de vérification (6 chiffres)
            var verificationCode = new Random().Next(100000, 999999).ToString();

            // Sauvegarder le code dans l'utilisateur
            await _authService.SaveVerificationCodeAsync(user.Email, verificationCode);

            // Envoyer l'email de vérification
            await _authService.SendVerificationEmailAsync(user.Email, verificationCode);

            // Générer un JWT pour l'app
            var claimsDict = new Dictionary<string, object>
            {
                { "sub", user.Email },
                { "email", user.Email },
                { "name", name },
                { "email_verified", false },
                { "role", "user" }
            };
            
            var jwtToken = _jwtTokenGenerator.GenerateToken(claimsDict);

            return Ok(new AuthSignUpResponse
            {
                Message = "User created successfully. Please check your email for confirmation code.",
                Token = jwtToken,
                RefreshToken = "temp-refresh-token-" + Guid.NewGuid().ToString().Substring(0, 8),
                User = new
                {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName ?? "",
                    lastName = user.LastName ?? "",
                    role = user.Role,
                    isEmailVerified = user.IsEmailVerified
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign up");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Confirme l'email avec le code envoyé par email
    /// </summary>
    [HttpPost("verify-email")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Code))
        {
            return BadRequest(new { error = "Email and code are required" });
        }

        try
        {
            var (success, message) = await _authService.VerifyEmailAsync(request.Email, request.Code);

            if (!success)
            {
                return BadRequest(new { error = message });
            }

            return Ok(new { message = "Email verified successfully. You can now sign in." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Confirme l'inscription avec le code envoyé par email (legacy)
    /// </summary>
    [HttpPost("confirm")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ConfirmSignUp([FromBody] ConfirmSignUpRequestDto request)
    {
        // Rediriger vers verify-email
        var verifyRequest = new VerifyEmailRequestDto
        {
            Email = request.Username,
            Code = request.ConfirmationCode
        };

        return await VerifyEmail(verifyRequest);
    }

    /// <summary>
    /// Renvoie un code de vérification par email
    /// </summary>
    [HttpPost("resend-verification")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] ResendVerificationRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { error = "Email is required" });
        }

        try
        {
            // Récupérer l'utilisateur
            var user = await _authService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Si l'email est déjà vérifié
            if (user.IsEmailVerified)
            {
                return Ok(new { message = "Email is already verified" });
            }

            // Générer un nouveau code
            var verificationCode = new Random().Next(100000, 999999).ToString();

            // Sauvegarder le code
            await _authService.SaveVerificationCodeAsync(user.Email, verificationCode);

            // Envoyer l'email
            await _authService.SendVerificationEmailAsync(user.Email, verificationCode);

            _logger.LogInformation("Verification code resent to {Email}", request.Email);

            return Ok(new { message = "Verification code sent successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resending verification email");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Confirme l'inscription avec le code envoyé par email (legacy)
    /// </summary>
    [HttpPost("confirm-legacy")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ConfirmSignUpLegacy([FromBody] ConfirmSignUpRequestDto request)
    {
        // Rediriger vers verify-email
        var verifyRequest = new VerifyEmailRequestDto
        {
            Email = request.Username,
            Code = request.ConfirmationCode
        };

        return await VerifyEmail(verifyRequest);
    }

    /// <summary>
    /// Rafraîchit un access token expiré
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SignInResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return BadRequest(new { error = "Refresh token is required" });
        }

        try
        {
            var result = await _authService.RefreshTokenAsync(request.RefreshToken);

            var response = new SignInResponse
            {
                AccessToken = result.AccessToken,
                IdToken = result.IdToken,
                ExpiresIn = result.ExpiresIn,
                TokenType = result.TokenType
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return Unauthorized(new { error = "Invalid refresh token" });
        }
    }

    /// <summary>
    /// Déconnecte l'utilisateur et révoque les tokens
    /// </summary>
    [HttpPost("signout")]
    [Authorize]
    [ProducesResponseType(200)]
    public async Task<IActionResult> SignOut()
    {
        try
        {
            var accessToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest(new { error = "Access token not found" });
            }

            // Extract username from token claims
            var principal = await _authService.GetUserFromTokenAsync(accessToken);
            var username = principal?.FindFirst("cognito:username")?.Value ?? "unknown";

            await _authService.SignOutAsync(username);

            return Ok(new { message = "Signed out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign out");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Initie la réinitialisation de mot de passe
    /// </summary>
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    public async Task<IActionResult> ForgotPassword([FromBody] dynamic request)
    {
        try
        {
            // Placeholder implementation
            return Ok(new { message = "Password reset code sent to your email" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Confirme la réinitialisation avec le code reçu
    /// </summary>
    [HttpPost("confirm-forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    public async Task<IActionResult> ConfirmForgotPassword([FromBody] dynamic request)
    {
        try
        {
            // Placeholder implementation
            return Ok(new { message = "Password reset successfully. You can now sign in." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming forgot password");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Retourne les informations de l'utilisateur connecté
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(object), 200)]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var accessToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var principal = await _authService.GetUserFromTokenAsync(accessToken);

            var user = new
            {
                username = principal.FindFirst("cognito:username")?.Value,
                email = principal.FindFirst("email")?.Value,
                name = principal.FindFirst("name")?.Value,
                sub = principal.FindFirst("sub")?.Value,
                role = principal.FindFirst("custom:role")?.Value
            };

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}

public class ForgotPasswordRequest
{
    public string Username { get; set; } = string.Empty;
}

public class ConfirmForgotPasswordRequest
{
    public string Username { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}