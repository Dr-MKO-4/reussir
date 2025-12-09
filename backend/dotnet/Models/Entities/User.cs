namespace Backend.Models.Entities;

/// <summary>
/// User entity - represents a user profile in the application
/// </summary>
public class User
{
    public int Id { get; set; }
    
    public string? CognitoId { get; set; } // Optional - for Cognito users
    
    public required string Email { get; set; }
    
    public string? PasswordHash { get; set; } // For local authentication
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }

    public string? Phone { get; set; }

    public string Role { get; set; } = "user"; // user, admin, teacher

    public bool IsEmailVerified { get; set; } = false;

    public DateTime? VerifiedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public string? VerificationCode { get; set; } // Code temporaire pour vérifier l'email

    public DateTime? VerificationCodeExpiredAt { get; set; } // Expiration du code
    
    public string? ProfileImageUrl { get; set; }
    
    public string? Bio { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    
    public ICollection<LearningHistory> LearningHistories { get; set; } = new List<LearningHistory>();
    
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    
    public ICollection<AnalyticsEvent> AnalyticsEvents { get; set; } = new List<AnalyticsEvent>();
}
