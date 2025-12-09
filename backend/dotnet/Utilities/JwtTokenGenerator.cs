using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Utilities;

/// <summary>
/// Utilitaire pour générer des tokens JWT de développement
/// </summary>
public static class JwtTokenGenerator
{
    private static readonly string SecretKey = "your-super-secret-key-for-jwt-token-generation-12345-super-long-key";
    private static readonly string Issuer = "https://reussir.local";
    private static readonly string Audience = "https://localhost:7023";

    public static string GenerateToken(Dictionary<string, object> claims, int expirationMinutes = 60)
    {
        try
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claimsList = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()),
            };

            // Ajouter les claims fournis
            foreach (var kvp in claims)
            {
                claimsList.Add(new Claim(kvp.Key, kvp.Value?.ToString() ?? ""));
            }

            var token = new JwtSecurityToken(
                issuer: Issuer,
                audience: Audience,
                claims: claimsList,
                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error generating JWT token: {ex.Message}", ex);
        }
    }
}
