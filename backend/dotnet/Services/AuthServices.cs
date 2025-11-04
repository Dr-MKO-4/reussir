using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Amazon.Extensions.CognitoAuthentication;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EducationalAI.Services;

public interface ICognitoAuthService
{
    Task<AuthenticationResult> SignInAsync(string username, string password);
    Task<SignUpResponse> SignUpAsync(string email, string password, string name);
    Task<bool> ConfirmSignUpAsync(string username, string confirmationCode);
    Task<AuthenticationResult> RefreshTokenAsync(string refreshToken);
    Task<bool> ValidateTokenAsync(string accessToken);
    Task<ClaimsPrincipal> GetUserFromTokenAsync(string accessToken);
    Task SignOutAsync(string accessToken);
    Task<bool> ForgotPasswordAsync(string username);
    Task<bool> ConfirmForgotPasswordAsync(string username, string code, string newPassword);
}

public class CognitoAuthService : ICognitoAuthService
{
    private readonly IAmazonCognitoIdentityProvider _cognitoClient;
    private readonly CognitoUserPool _userPool;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CognitoAuthService> _logger;
    
    private readonly string _userPoolId;
    private readonly string _clientId;
    private readonly string _clientSecret;
    private readonly string _region;

    public CognitoAuthService(
        IAmazonCognitoIdentityProvider cognitoClient,
        IConfiguration configuration,
        ILogger<CognitoAuthService> logger)
    {
        _cognitoClient = cognitoClient;
        _configuration = configuration;
        _logger = logger;
        
        // Configuration AWS Cognito
        _userPoolId = configuration["AWS:UserPoolId"] 
            ?? throw new ArgumentNullException("AWS:UserPoolId not configured");
        _clientId = configuration["AWS:UserPoolClientId"] 
            ?? throw new ArgumentNullException("AWS:UserPoolClientId not configured");
        _clientSecret = configuration["AWS:UserPoolClientSecret"] ?? "";
        _region = configuration["AWS:Region"] ?? "us-east-1";
        
        // Initialiser le user pool
        _userPool = new CognitoUserPool(_userPoolId, _clientId, _cognitoClient, _clientSecret);
        
        _logger.LogInformation("CognitoAuthService initialized for region {Region}", _region);
    }

    /// <summary>
    /// Authentifie un utilisateur avec username/password
    /// </summary>
    public async Task<AuthenticationResult> SignInAsync(string username, string password)
    {
        try
        {
            var user = new CognitoUser(username, _clientId, _userPool, _cognitoClient, _clientSecret);
            var authRequest = new InitiateSrpAuthRequest
            {
                Password = password
            };

            var authResponse = await user.StartWithSrpAuthAsync(authRequest);
            
            if (authResponse.AuthenticationResult != null)
            {
                _logger.LogInformation("User {Username} authenticated successfully", username);
                return authResponse.AuthenticationResult;
            }
            
            throw new UnauthorizedAccessException("Authentication failed");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign in for user {Username}", username);
            throw;
        }
    }

    /// <summary>
    /// Crée un nouveau compte utilisateur
    /// </summary>
    public async Task<SignUpResponse> SignUpAsync(string email, string password, string name)
    {
        try
        {
            var signUpRequest = new SignUpRequest
            {
                ClientId = _clientId,
                Username = email,
                Password = password,
                SecretHash = ComputeSecretHash(email),
                UserAttributes = new List<AttributeType>
                {
                    new AttributeType { Name = "email", Value = email },
                    new AttributeType { Name = "name", Value = name }
                }
            };

            var response = await _cognitoClient.SignUpAsync(signUpRequest);
            
            _logger.LogInformation("User {Email} signed up successfully", email);
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign up for email {Email}", email);
            throw;
        }
    }

    /// <summary>
    /// Confirme l'inscription avec le code envoyé par email
    /// </summary>
    public async Task<bool> ConfirmSignUpAsync(string username, string confirmationCode)
    {
        try
        {
            var confirmRequest = new ConfirmSignUpRequest
            {
                ClientId = _clientId,
                Username = username,
                ConfirmationCode = confirmationCode,
                SecretHash = ComputeSecretHash(username)
            };

            await _cognitoClient.ConfirmSignUpAsync(confirmRequest);
            
            _logger.LogInformation("User {Username} confirmed successfully", username);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming sign up for user {Username}", username);
            return false;
        }
    }

    /// <summary>
    /// Rafraîchit un access token expiré
    /// </summary>
    public async Task<AuthenticationResult> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var authRequest = new InitiateAuthRequest
            {
                ClientId = _clientId,
                AuthFlow = AuthFlowType.REFRESH_TOKEN_AUTH,
                AuthParameters = new Dictionary<string, string>
                {
                    { "REFRESH_TOKEN", refreshToken },
                    { "SECRET_HASH", ComputeSecretHash("") }
                }
            };

            var response = await _cognitoClient.InitiateAuthAsync(authRequest);
            
            _logger.LogInformation("Token refreshed successfully");
            return response.AuthenticationResult;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            throw;
        }
    }

    /// <summary>
    /// Valide un JWT access token
    /// </summary>
    public async Task<bool> ValidateTokenAsync(string accessToken)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(accessToken);
            
            // Vérifier l'expiration
            if (jwtToken.ValidTo < DateTime.UtcNow)
            {
                _logger.LogWarning("Token expired");
                return false;
            }
            
            // Vérifier l'issuer (Cognito)
            var expectedIssuer = $"https://cognito-idp.{_region}.amazonaws.com/{_userPoolId}";
            if (jwtToken.Issuer != expectedIssuer)
            {
                _logger.LogWarning("Invalid token issuer");
                return false;
            }
            
            // Optionnel: vérifier avec GetUser API de Cognito
            var getUserRequest = new GetUserRequest
            {
                AccessToken = accessToken
            };
            
            await _cognitoClient.GetUserAsync(getUserRequest);
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Token validation failed");
            return false;
        }
    }

    /// <summary>
    /// Extrait les claims d'un JWT token
    /// </summary>
    public Task<ClaimsPrincipal> GetUserFromTokenAsync(string accessToken)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(accessToken);
            
            var claims = jwtToken.Claims.ToList();
            var identity = new ClaimsIdentity(claims, "jwt");
            var principal = new ClaimsPrincipal(identity);
            
            return Task.FromResult(principal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting user from token");
            throw;
        }
    }

    /// <summary>
    /// Déconnecte un utilisateur (révoque le token)
    /// </summary>
    public async Task SignOutAsync(string accessToken)
    {
        try
        {
            var signOutRequest = new GlobalSignOutRequest
            {
                AccessToken = accessToken
            };

            await _cognitoClient.GlobalSignOutAsync(signOutRequest);
            
            _logger.LogInformation("User signed out successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during sign out");
            throw;
        }
    }

    /// <summary>
    /// Initie la réinitialisation de mot de passe
    /// </summary>
    public async Task<bool> ForgotPasswordAsync(string username)
    {
        try
        {
            var forgotPasswordRequest = new ForgotPasswordRequest
            {
                ClientId = _clientId,
                Username = username,
                SecretHash = ComputeSecretHash(username)
            };

            await _cognitoClient.ForgotPasswordAsync(forgotPasswordRequest);
            
            _logger.LogInformation("Password reset initiated for user {Username}", username);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initiating password reset for {Username}", username);
            return false;
        }
    }

    /// <summary>
    /// Confirme la réinitialisation avec le code reçu
    /// </summary>
    public async Task<bool> ConfirmForgotPasswordAsync(string username, string code, string newPassword)
    {
        try
        {
            var confirmRequest = new ConfirmForgotPasswordRequest
            {
                ClientId = _clientId,
                Username = username,
                ConfirmationCode = code,
                Password = newPassword,
                SecretHash = ComputeSecretHash(username)
            };

            await _cognitoClient.ConfirmForgotPasswordAsync(confirmRequest);
            
            _logger.LogInformation("Password reset confirmed for user {Username}", username);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming password reset for {Username}", username);
            return false;
        }
    }

    /// <summary>
    /// Calcule le SecretHash requis par Cognito
    /// </summary>
    private string ComputeSecretHash(string username)
    {
        if (string.IsNullOrEmpty(_clientSecret))
            return null;

        var message = username + _clientId;
        var keyBytes = Encoding.UTF8.GetBytes(_clientSecret);
        var messageBytes = Encoding.UTF8.GetBytes(message);

        using var hmac = new System.Security.Cryptography.HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(messageBytes);
        return Convert.ToBase64String(hashBytes);
    }
}

/// <summary>
/// DTOs pour les requêtes/réponses d'authentification
/// </summary>
public class SignInRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class SignInResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string IdToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public string TokenType { get; set; } = "Bearer";
}

public class SignUpRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class ConfirmSignUpRequest
{
    public string Username { get; set; } = string.Empty;
    public string ConfirmationCode { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}