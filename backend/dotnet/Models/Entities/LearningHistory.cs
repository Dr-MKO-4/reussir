namespace Backend.Models.Entities;

/// <summary>
/// LearningHistory entity - tracks user's learning activity and progress
/// </summary>
public class LearningHistory
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int SubjectId { get; set; }
    
    public int? ContentId { get; set; }
    
    public string ActivityType { get; set; } = "Viewed"; // Viewed, Completed, Quizzed, etc.
    
    public int? TimeSpentSeconds { get; set; }
    
    public decimal? QuizScore { get; set; }
    
    public DateTime ActivityAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public required User User { get; set; }
    
    public required Subject Subject { get; set; }
    
    public CourseContent? Content { get; set; }
}
