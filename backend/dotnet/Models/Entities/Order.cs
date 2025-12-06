namespace Backend.Models.Entities;

/// <summary>
/// Order entity - represents a purchase transaction
/// </summary>
public class Order
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public required string OrderNumber { get; set; }
    
    public decimal TotalAmount { get; set; }
    
    public string Status { get; set; } = "Pending"; // Pending, Completed, Failed, Refunded
    
    public string? PaymentMethod { get; set; }
    
    public string? TransactionId { get; set; }
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? CompletedDate { get; set; }
    
    public string? Notes { get; set; }
    
    // Navigation properties
    public required User User { get; set; }
    
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
