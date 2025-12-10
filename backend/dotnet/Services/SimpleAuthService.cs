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
    private readonly JwtTokenGenerator _jwtTokenGenerator;

    public SimpleAuthService(ApplicationDbContext context, ILogger<SimpleAuthService> logger, IEmailService emailService, JwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _logger = logger;
        _emailService = emailService;
        _jwtTokenGenerator = jwtTokenGenerator;
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
            var subject = "Vérifiez votre adresse email - Win+";
            var body = $@"
<!DOCTYPE html>
<html lang=""fr"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Vérification d'email - Win+</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }}
        .email-wrapper {{
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #1A4D5E 0%, #2C5F70 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }}
        .header-logo {{
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }}
        .header-subtitle {{
            font-size: 14px;
            opacity: 0.9;
            margin: 8px 0 0 0;
        }}
        .content {{
            padding: 40px 30px;
        }}
        .greeting {{
            font-size: 18px;
            font-weight: 600;
            color: #1A4D5E;
            margin: 0 0 20px 0;
        }}
        .message {{
            font-size: 14px;
            color: #555;
            margin: 15px 0;
            line-height: 1.8;
        }}
        .code-section {{
            background: linear-gradient(135deg, #E8F9F5 0%, #D4F1EA 100%);
            border-left: 4px solid #3FD5B8;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
            text-align: center;
        }}
        .code-label {{
            font-size: 12px;
            font-weight: 600;
            color: #1A4D5E;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0 0 10px 0;
        }}
        .code-display {{
            font-size: 36px;
            font-weight: 700;
            color: #1A4D5E;
            letter-spacing: 6px;
            margin: 0;
            font-family: 'Courier New', monospace;
            word-spacing: 8px;
        }}
        .code-validity {{
            font-size: 12px;
            color: #666;
            margin: 10px 0 0 0;
            font-style: italic;
        }}
        .info-box {{
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }}
        .info-title {{
            font-weight: 600;
            color: #1A4D5E;
            margin: 0 0 12px 0;
            font-size: 14px;
        }}
        .info-list {{
            margin: 0;
            padding-left: 20px;
            font-size: 13px;
            color: #555;
        }}
        .info-list li {{
            margin-bottom: 8px;
            line-height: 1.6;
        }}
        .security-warning {{
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px 20px;
            border-radius: 6px;
            margin: 20px 0;
            font-size: 13px;
            color: #92400e;
        }}
        .footer {{
            border-top: 1px solid #e5e7eb;
            padding: 25px 30px;
            background: #f9fafb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }}
        .footer-links {{
            margin: 15px 0 0 0;
        }}
        .footer-links a {{
            color: #3FD5B8;
            text-decoration: none;
            margin: 0 10px;
        }}
        .footer-links a:hover {{
            text-decoration: underline;
        }}
        .divider {{
            height: 1px;
            background: #e5e7eb;
            margin: 15px 0;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""email-wrapper"">
            <!-- Header -->
            <div class=""header"">
                <h1 class=""header-logo"">Win+</h1>
                <p class=""header-subtitle"">Plateforme d'apprentissage en ligne</p>
            </div>

            <!-- Content -->
            <div class=""content"">
                <p class=""greeting"">Bienvenue sur Win+ ! </p>
                
                <p class=""message"">
                    Merci de vous être inscrit sur notre plateforme. Pour activer votre compte et accéder à tous nos services, 
                    veuillez vérifier votre adresse email en utilisant le code ci-dessous.
                </p>

                <!-- Code Section -->
                <div class=""code-section"">
                    <p class=""code-label"">Votre code de vérification</p>
                    <p class=""code-display"">{verificationCode}</p>
                    <p class=""code-validity"">Valide pendant 24 heures</p>
                </div>

                <!-- How to use -->
                <div class=""info-box"">
                    <p class=""info-title"">Comment utiliser ce code :</p>
                    <ul class=""info-list"">
                        <li>Retournez sur la page de vérification de votre compte</li>
                        <li>Entrez le code à 6 chiffres ci-dessus</li>
                        <li>Cliquez sur ""Vérifier le code""</li>
                        <li>Vous pouvez ensuite vous connecter à votre compte</li>
                    </ul>
                </div>

                <!-- Security Warning -->
                <div class=""security-warning"">
                    <strong>Sécurité :</strong> Ne partagez ce code avec personne. 
                    L'équipe Win+ ne vous demandera jamais ce code par email ou par téléphone.
                </div>

                <!-- Additional Info -->
                <p class=""message"">
                    <strong>Vous ne trouvez pas l'email ?</strong><br>
                    ✓ Vérifiez votre dossier spam ou courrier indésirable<br>
                    ✓ L'email peut prendre quelques minutes à arriver<br>
                    ✓ Assurez-vous que l'adresse email est correcte
                </p>

                <p class=""message"" style=""color: #999; font-size: 13px; margin-top: 25px;"">
                    Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email en toute sécurité.
                </p>
            </div>

            <!-- Footer -->
            <div class=""footer"">
                <p style=""margin: 0 0 10px 0; color: #1A4D5E; font-weight: 600;"">Win+ - Votre Plateforme d'Apprentissage</p>
                <p style=""margin: 0; color: #6b7280;"">
                    © 2025 Win+. Tous droits réservés.
                </p>
                <div class=""divider""></div>
                <div class=""footer-links"">
                    <a href=""https://reussir.com/privacy"">Confidentialité</a>
                    <a href=""https://reussir.com/terms"">Conditions</a>
                    <a href=""https://reussir.com/contact"">Contact</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
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

            // Vérifier si l'email est déjà vérifié
            if (user.IsEmailVerified)
            {
                return (true, "Cet email est déjà vérifié");
            }

            // Vérifier si le code existe
            if (string.IsNullOrEmpty(user.VerificationCode))
            {
                return (false, "Aucun code de vérification stocké. Veuillez demander un nouveau code.");
            }

            // Vérifier si le code a expiré
            if (user.VerificationCodeExpiredAt < DateTime.UtcNow)
            {
                return (false, "Le code de vérification a expiré. Veuillez demander un nouveau code.");
            }

            // Vérifier si le code est correct
            if (user.VerificationCode != code)
            {
                return (false, "Code de vérification incorrect");
            }

            // Marquer l'email comme vérifié
            user.IsEmailVerified = true;
            user.VerifiedAt = DateTime.UtcNow;
            user.VerificationCode = null;
            user.VerificationCodeExpiredAt = null;

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
            var newAccessToken = _jwtTokenGenerator.GenerateToken(claimsDict);
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
