using Microsoft.EntityFrameworkCore;
using Backend.Models.Entities;

namespace Backend.Data;

/// <summary>
/// ApplicationDbContext - Entity Framework Core DbContext for the application
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for all entities
    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<CourseContent> CourseContents => Set<CourseContent>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<LearningHistory> LearningHistories => Set<LearningHistory>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CognitoId).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.Bio).HasMaxLength(1000);
            entity.HasIndex(e => e.CognitoId).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Subject entity
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.AverageRating).HasPrecision(3, 2);
            entity.HasMany(e => e.Contents)
                .WithOne(c => c.Subject)
                .HasForeignKey(c => c.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CourseContent entity
        modelBuilder.Entity<CourseContent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Contents)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Enrollment entity
        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ProgressPercentage).HasPrecision(5, 2);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.SubjectId }).IsUnique();
        });

        // Configure CartItem entity
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.HasOne(e => e.User)
                .WithMany(u => u.CartItems)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.CartItems)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.SubjectId }).IsUnique();
        });

        // Configure Order entity
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasPrecision(12, 2);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.OrderNumber).IsUnique();
        });

        // Configure OrderItem entity
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PriceAtPurchase).HasPrecision(10, 2);
            entity.HasOne(e => e.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Favorite entity
        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.Favorites)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.SubjectId }).IsUnique();
        });

        // Configure LearningHistory entity
        modelBuilder.Entity<LearningHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActivityType).HasMaxLength(50);
            entity.Property(e => e.QuizScore).HasPrecision(5, 2);
            entity.HasOne(e => e.User)
                .WithMany(u => u.LearningHistories)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Subject)
                .WithMany(s => s.LearningHistories)
                .HasForeignKey(e => e.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Content)
                .WithMany(c => c.LearningHistories)
                .HasForeignKey(e => e.ContentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Notification entity
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.RelatedEntityType).HasMaxLength(50);
            entity.HasOne(e => e.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure AnalyticsEvent entity
        modelBuilder.Entity<AnalyticsEvent>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.EventType).IsRequired().HasMaxLength(100);
            entity.Property(e => e.EventName).IsRequired().HasMaxLength(255);
            entity.Property(e => e.EventCategory).HasMaxLength(100);
            entity.Property(e => e.IpAddress).HasMaxLength(45);
            entity.Property(e => e.EventData).HasColumnType("jsonb");
            entity.HasOne(e => e.User)
                .WithMany(u => u.AnalyticsEvents)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
