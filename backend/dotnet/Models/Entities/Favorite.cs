namespace Backend.Models.Entities;

/// <summary>
/// Favorite entity - represents a user's favorited course
/// </summary>
public class Favorite
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int SubjectId { get; set; }
    
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public required User User { get; set; }
    
    public required Subject Subject { get; set; }
}
