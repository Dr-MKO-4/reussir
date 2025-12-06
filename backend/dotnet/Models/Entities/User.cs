namespace Backend.Models.Entities;

/// <summary>
/// User entity - represents a user profile in the application
/// </summary>
public class User
{
    public int Id { get; set; }
    
    public required string CognitoId { get; set; }
    
    public required string Email { get; set; }
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    public string? ProfileImageUrl { get; set; }
    
    public string? Bio { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    
    public ICollection<LearningHistory> LearningHistories { get; set; } = new List<LearningHistory>();
    
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    
    public ICollection<AnalyticsEvent> AnalyticsEvents { get; set; } = new List<AnalyticsEvent>();
}
