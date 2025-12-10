using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Backend.Services;

/// <summary>
/// Interface pour envoyer des emails
/// </summary>
public interface IEmailService
{
    Task SendEmailAsync(string toEmail, string subject, string htmlBody);
}

/// <summary>
/// Service SMTP pour envoyer les emails
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("Smtp");
            var smtpServer = smtpSettings["Server"] ?? "localhost";
            var smtpPort = int.Parse(smtpSettings["Port"] ?? "587");
            var smtpUsername = smtpSettings["Username"] ?? "";
            var smtpPassword = smtpSettings["Password"] ?? "";
            var fromEmail = smtpSettings["FromEmail"] ?? "noreply@winplus.local";
            var fromName = smtpSettings["FromName"] ?? "Win+";

            using (var client = new SmtpClient(smtpServer, smtpPort))
            {
                client.EnableSsl = smtpSettings.GetValue("EnableSsl", true);
                
                // Authentification si fournie
                if (!string.IsNullOrEmpty(smtpUsername) && !string.IsNullOrEmpty(smtpPassword))
                {
                    client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                }

                using (var mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(fromEmail, fromName);
                    mailMessage.To.Add(new MailAddress(toEmail));
                    mailMessage.Subject = subject;
                    mailMessage.Body = htmlBody;
                    mailMessage.IsBodyHtml = true;

                    await client.SendMailAsync(mailMessage);
                }
            }

            _logger.LogInformation($"Email sent successfully to {toEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending email to {toEmail}");
            throw;
        }
    }
}
