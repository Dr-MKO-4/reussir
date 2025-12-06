namespace Backend.Models.Entities;

/// <summary>
/// CourseContent entity - represents individual lessons/modules within a course
/// </summary>
public class CourseContent
{
    public int Id { get; set; }
    
    public int SubjectId { get; set; }
    
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public string? VideoUrl { get; set; }
    
    public string? DocumentUrl { get; set; }
    
    public int OrderIndex { get; set; }
    
    public int DurationMinutes { get; set; } = 0;
    
    public bool IsLocked { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public Subject Subject { get; set; }
    
    public ICollection<LearningHistory> LearningHistories { get; set; } = new List<LearningHistory>();
}
