using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalAI.Services;
using Amazon.CognitoIdentityProvider.Model;

namespace EducationalAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ICognitoAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(ICognitoAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Authentifie un utilisateur et retourne les tokens JWT
    /// </summary>
    [HttpPost("signin")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SignInResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> SignIn([FromBody] Services.SignInRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { error = "Username and password are required" });
        }

        try
        {
            var result = await _authService.SignInAsync(request.Username, request.Password);

            var response = new SignInResponse
            {
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                IdToken = result.IdToken,
                ExpiresIn = result.ExpiresIn,
                TokenType = result.TokenType
            };

            _logger.LogInformation("User {Username} signed in successfully", request.Username);
            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { error = "Invalid credentials" });
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
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> SignUp([FromBody] Services.SignUpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || 
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest(new { error = "Email, password, and name are required" });
        }

        try
        {
            var result = await _authService.SignUpAsync(request.Email, request.Password, request.Name);

            return Ok(new
            {
                message = "User created successfully. Please check your email for confirmation code.",
                userSub = result.UserSub,
                userConfirmed = result.UserConfirmed
            });
        }
        catch (UsernameExistsException)
        {
            return BadRequest(new { error = "User already exists" });
        }
        catch (InvalidPasswordException ex)
        {
            return BadRequest(new { error = $"Invalid password: {ex.Message}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign up");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Confirme l'inscription avec le code envoyé par email
    /// </summary>
    [HttpPost("confirm")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ConfirmSignUp([FromBody] Services.ConfirmSignUpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.ConfirmationCode))
        {
            return BadRequest(new { error = "Username and confirmation code are required" });
        }

        try
        {
            var success = await _authService.ConfirmSignUpAsync(request.Username, request.ConfirmationCode);

            if (success)
            {
                return Ok(new { message = "Account confirmed successfully. You can now sign in." });
            }

            return BadRequest(new { error = "Invalid confirmation code" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming sign up");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Rafraîchit un access token expiré
    /// </summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(SignInResponse), 200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
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

            await _authService.SignOutAsync(accessToken);

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
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(new { error = "Username is required" });
        }

        try
        {
            var success = await _authService.ForgotPasswordAsync(request.Username);

            if (success)
            {
                return Ok(new { message = "Password reset code sent to your email" });
            }

            return BadRequest(new { error = "Failed to send reset code" });
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
    public async Task<IActionResult> ConfirmForgotPassword([FromBody] ConfirmForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) ||
            string.IsNullOrWhiteSpace(request.Code) ||
            string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest(new { error = "Username, code, and new password are required" });
        }

        try
        {
            var success = await _authService.ConfirmForgotPasswordAsync(
                request.Username,
                request.Code,
                request.NewPassword
            );

            if (success)
            {
                return Ok(new { message = "Password reset successfully. You can now sign in." });
            }

            return BadRequest(new { error = "Invalid reset code" });
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