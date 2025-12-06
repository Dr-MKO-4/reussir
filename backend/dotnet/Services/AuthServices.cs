using Amazon.CognitoIdentityProvider;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using EducationalAI.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models.Entities;

namespace EducationalAI.Services;

/// <summary>
/// Cognito Authentication Service - handles user authentication with AWS Cognito and PostgreSQL user management
/// </summary>
public interface ICognitoAuthService
{
    // Core authentication
    Task<AuthenticationResultDto> SignInAsync(string username, string password);
    Task<AuthenticationResultDto> SignUpAsync(string email, string password, string name);
    Task<AuthenticationResultDto> ConfirmSignUpAsync(string username, string confirmationCode);
    Task<AuthenticationResultDto> RefreshTokenAsync(string refreshToken);
    
    // Token validation
    Task<bool> ValidateTokenAsync(string accessToken);
    Task<ClaimsPrincipal> GetUserFromTokenAsync(string accessToken);
    
    // Password management
    Task<bool> ForgotPasswordAsync(string username);
    Task<bool> ConfirmForgotPasswordAsync(string username, string code, string newPassword);
    
    // Sign out
    Task<bool> SignOutAsync(string username);
}

public class CognitoAuthService : ICognitoAuthService
{
    private readonly IAmazonCognitoIdentityProvider _cognitoClient;
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<CognitoAuthService> _logger;
    private readonly string _userPoolId;
    private readonly string _clientId;
    private readonly string _region;

    public CognitoAuthService(
        IAmazonCognitoIdentityProvider cognitoClient,
        ApplicationDbContext dbContext,
        IConfiguration configuration,
        ILogger<CognitoAuthService> logger)
    {
        _cognitoClient = cognitoClient;
        _dbContext = dbContext;
        _logger = logger;
        _userPoolId = configuration["AWS:UserPoolId"] ?? throw new InvalidOperationException("AWS:UserPoolId not configured");
        _clientId = configuration["AWS:UserPoolClientId"] ?? throw new InvalidOperationException("AWS:UserPoolClientId not configured");
        _region = configuration["AWS:Region"] ?? "us-east-1";
    }

    /// <summary>
    /// Validates a JWT token
    /// </summary>
    public async Task<bool> ValidateTokenAsync(string accessToken)
    {
        try
        {
            var principal = await GetUserFromTokenAsync(accessToken);
            return principal != null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return false;
        }
    }

    /// <summary>
    /// Extracts user claims from JWT token
    /// </summary>
    public async Task<ClaimsPrincipal> GetUserFromTokenAsync(string accessToken)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(accessToken);
            
            var principal = new ClaimsPrincipal(new ClaimsIdentity(token.Claims, "jwt"));
            
            // Optionally enrich with database user info
            var cognitoSub = token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            if (!string.IsNullOrEmpty(cognitoSub))
            {
                var user = await _dbContext.Users
                    .FirstOrDefaultAsync(u => u.CognitoId == cognitoSub);
                
                if (user != null)
                {
                    var claims = principal.Claims.ToList();
                    claims.Add(new Claim("user_id", user.Id.ToString()));
                    claims.Add(new Claim("email", user.Email));
                    principal = new ClaimsPrincipal(new ClaimsIdentity(claims, "jwt"));
                }
            }
            
            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user from token");
            throw;
        }
    }

    /// <summary>
    /// Sign in user - placeholder implementation
    /// Note: Full implementation requires proper Cognito SRP auth flow
    /// </summary>
    public async Task<AuthenticationResultDto> SignInAsync(string username, string password)
    {
        _logger.LogWarning("SignInAsync called - full implementation needed");
        throw new NotImplementedException("Full Cognito SRP authentication needs to be implemented");
    }

    /// <summary>
    /// Sign up user - placeholder implementation
    /// </summary>
    public async Task<AuthenticationResultDto> SignUpAsync(string email, string password, string name)
    {
        _logger.LogWarning("SignUpAsync called - full implementation needed");
        throw new NotImplementedException("SignUp implementation needed");
    }

    /// <summary>
    /// Confirm sign up user
    /// </summary>
    public async Task<AuthenticationResultDto> ConfirmSignUpAsync(string username, string confirmationCode)
    {
        _logger.LogWarning("ConfirmSignUpAsync called - full implementation needed");
        throw new NotImplementedException("ConfirmSignUp implementation needed");
    }

    /// <summary>
    /// Refresh authentication tokens
    /// </summary>
    public async Task<AuthenticationResultDto> RefreshTokenAsync(string refreshToken)
    {
        _logger.LogWarning("RefreshTokenAsync called - full implementation needed");
        throw new NotImplementedException("RefreshToken implementation needed");
    }

    /// <summary>
    /// Forgot password request
    /// </summary>
    public async Task<bool> ForgotPasswordAsync(string username)
    {
        _logger.LogWarning("ForgotPasswordAsync called - full implementation needed");
        throw new NotImplementedException("ForgotPassword implementation needed");
    }

    /// <summary>
    /// Confirm forgot password
    /// </summary>
    public async Task<bool> ConfirmForgotPasswordAsync(string username, string code, string newPassword)
    {
        _logger.LogWarning("ConfirmForgotPasswordAsync called - full implementation needed");
        throw new NotImplementedException("ConfirmForgotPassword implementation needed");
    }

    /// <summary>
    /// Sign out user
    /// </summary>
    public async Task<bool> SignOutAsync(string username)
    {
        _logger.LogWarning("SignOutAsync called - full implementation needed");
        throw new NotImplementedException("SignOut implementation needed");
    }
}
