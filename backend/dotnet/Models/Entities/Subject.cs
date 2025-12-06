namespace Backend.Models.Entities;

/// <summary>
/// Subject entity - represents a course or educational subject
/// </summary>
public class Subject
{
    public int Id { get; set; }
    
    public required string Title { get; set; }
    
    public string? Description { get; set; }
    
    public string? Category { get; set; }
    
    public string? ThumbnailUrl { get; set; }
    
    public decimal Price { get; set; }
    
    public bool IsPublished { get; set; } = false;
    
    public int EnrollmentCount { get; set; } = 0;
    
    public decimal AverageRating { get; set; } = 0;
    
    public int TotalRatings { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public ICollection<CourseContent> Contents { get; set; } = new List<CourseContent>();
    
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    
    public ICollection<LearningHistory> LearningHistories { get; set; } = new List<LearningHistory>();
}
