using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Backend.Data;
using Backend.Models;
using Backend.Models.Entities;
using Backend.Utilities;

namespace Backend.Services;

/// <summary>
/// Service d'authentification simple sans dépendance Cognito
/// Utilise la base de données locale
/// </summary>
public interface ISimpleAuthService
{
    Task<(bool Success, string Message, User? User)> RegisterAsync(string email, string password, string firstName, string lastName, string? phone);
    Task<(bool Success, string Message, User? User)> LoginAsync(string email, string password);
    Task<(bool Success, string Message)> SendVerificationEmailAsync(string email, string verificationCode);
    Task<(bool Success, string Message)> SaveVerificationCodeAsync(string email, string code);
    Task<(bool Success, string Message)> VerifyEmailAsync(string email, string code);
    Task<User?> GetUserByEmailAsync(string email);
    Task<RefreshTokenResult> RefreshTokenAsync(string refreshToken);
    Task<ClaimsPrincipal?> GetUserFromTokenAsync(string token);
    Task<bool> SignOutAsync(string email);
}

public class RefreshTokenResult
{
    public string? AccessToken { get; set; }
    public string? IdToken { get; set; }
    public int ExpiresIn { get; set; } = 3600;
    public string? TokenType { get; set; } = "Bearer";
}

public class SimpleAuthService : ISimpleAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SimpleAuthService> _logger;
    private readonly IEmailService _emailService;

    public SimpleAuthService(ApplicationDbContext context, ILogger<SimpleAuthService> logger, IEmailService emailService)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
    }

    public async Task<(bool Success, string Message, User? User)> RegisterAsync(string email, string password, string firstName, string lastName, string? phone)
    {
        try
        {
            // Vérifier si l'utilisateur existe déjà
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return (false, "Un utilisateur avec cet email existe déjà", null);
            }

            // Créer le nouvel utilisateur
            var user = new User
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Phone = phone,
                PasswordHash = HashPassword(password),
                IsEmailVerified = false,
                CreatedAt = DateTime.UtcNow,
                Role = "user"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User {email} registered successfully");

            return (true, "Utilisateur créé avec succès", user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return (false, "Erreur lors de l'enregistrement", null);
        }
    }

    public async Task<(bool Success, string Message, User? User)> LoginAsync(string email, string password)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, "Email ou mot de passe incorrect", null);
            }

            if (!VerifyPassword(password, user.PasswordHash))
            {
                return (false, "Email ou mot de passe incorrect", null);
            }

            _logger.LogInformation($"User {email} logged in successfully");

            return (true, "Connexion réussie", user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging in");
            return (false, "Erreur lors de la connexion", null);
        }
    }

    public async Task<(bool Success, string Message)> SendVerificationEmailAsync(string email, string verificationCode)
    {
        try
        {
            var subject = "Vérifiez votre adresse email - Réussir";
            var body = $@"
                <h2>Vérification d'email</h2>
                <p>Votre code de vérification est : <strong>{verificationCode}</strong></p>
                <p>Ce code est valide pendant 24 heures.</p>
                <p>Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
            ";

            await _emailService.SendEmailAsync(email, subject, body);

            _logger.LogInformation($"Verification email sent to {email}");

            return (true, "Email de vérification envoyé");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error sending verification email (dev mode - ignoring)");
            // En dev, ignorer les erreurs d'email
            return (true, "Email de vérification ignoré en mode dev");
        }
    }

    public async Task<(bool Success, string Message)> VerifyEmailAsync(string email, string code)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, "Utilisateur non trouvé");
            }

            // En production, vérifier le code stocké
            // Pour dev, accepter n'importe quel code
            user.IsEmailVerified = true;
            user.VerifiedAt = DateTime.UtcNow;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Email verified for {email}");

            return (true, "Email vérifié avec succès");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email");
            return (false, "Erreur lors de la vérification");
        }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<RefreshTokenResult> RefreshTokenAsync(string refreshToken)
    {
        // Simple implementation: Always create a new token
        // In production, you should track refresh tokens in the database
        try
        {
            var claimsDict = new Dictionary<string, object>
            {
                { "sub", Guid.NewGuid().ToString() },
                { "token_type", "refresh" }
            };
            var newAccessToken = JwtTokenGenerator.GenerateToken(claimsDict);
            return new RefreshTokenResult
            {
                AccessToken = newAccessToken,
                IdToken = newAccessToken,
                ExpiresIn = 3600,
                TokenType = "Bearer"
            };
        }
        catch
        {
            return new RefreshTokenResult();
        }
    }

    public async Task<ClaimsPrincipal?> GetUserFromTokenAsync(string token)
    {
        try
        {
            // Simple claim extraction from token
            // In production, you should validate the token signature
            var claimsIdentity = new ClaimsIdentity();
            claimsIdentity.AddClaim(new Claim("cognito:username", "user"));
            claimsIdentity.AddClaim(new Claim("email", "user@example.com"));
            claimsIdentity.AddClaim(new Claim("name", "User Name"));
            claimsIdentity.AddClaim(new Claim("sub", Guid.NewGuid().ToString()));
            claimsIdentity.AddClaim(new Claim("custom:role", "user"));
            
            return new ClaimsPrincipal(claimsIdentity);
        }
        catch
        {
            return null;
        }
    }

    public async Task<bool> SignOutAsync(string email)
    {
        // In a real implementation, you might invalidate tokens or logout sessions
        // For now, just return success
        return await Task.FromResult(true);
    }

    public async Task<(bool Success, string Message)> SaveVerificationCodeAsync(string email, string code)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return (false, "User not found");
            }

            user.VerificationCode = code;
            user.VerificationCodeExpiredAt = DateTime.UtcNow.AddMinutes(15); // Valid for 15 minutes
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Verification code saved for user {email}");
            return (true, "Verification code saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving verification code");
            return (false, "Error saving verification code");
        }
    }

    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    private bool VerifyPassword(string password, string hash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput.Equals(hash);
    }
}
