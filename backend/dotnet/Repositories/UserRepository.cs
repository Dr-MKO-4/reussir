using Backend.Data;
using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserRepository> _logger;

    public UserRepository(ApplicationDbContext context, ILogger<UserRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Users
                .Include(u => u.Enrollments)
                .Include(u => u.Orders)
                .FirstOrDefaultAsync(u => u.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by id {UserId}", id);
            return null;
        }
    }

    public async Task<User?> GetByCognitoIdAsync(string cognitoId)
    {
        try
        {
            return await _context.Users
                .Include(u => u.Enrollments)
                .FirstOrDefaultAsync(u => u.CognitoId == cognitoId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by cognito id {CognitoId}", cognitoId);
            return null;
        }
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        try
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email {Email}", email);
            return null;
        }
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        try
        {
            return await _context.Users
                .Include(u => u.Enrollments)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users");
            return Enumerable.Empty<User>();
        }
    }

    public async Task<IEnumerable<User>> GetAllAsync(int page, int limit)
    {
        try
        {
            var skip = (page - 1) * limit;
            return await _context.Users
                .Include(u => u.Enrollments)
                .OrderByDescending(u => u.CreatedAt)
                .Skip(skip)
                .Take(limit)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting paginated users (page {Page}, limit {Limit})", page, limit);
            return Enumerable.Empty<User>();
        }
    }

    public async Task<User> CreateAsync(User user)
    {
        try
        {
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("User {UserId} created successfully", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            throw;
        }
    }

    public async Task<User> UpdateAsync(User user)
    {
        try
        {
            user.UpdatedAt = DateTime.UtcNow;
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("User {UserId} updated successfully", user.Id);
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", user.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            
            _logger.LogInformation("User {UserId} deleted successfully", id);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsByCognitoIdAsync(string cognitoId)
    {
        try
        {
            return await _context.Users.AnyAsync(u => u.CognitoId == cognitoId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking cognito id existence");
            return false;
        }
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        try
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking email existence");
            return false;
        }
    }

    public async Task<int> CountAsync()
    {
        try
        {
            return await _context.Users.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error counting users");
            return 0;
        }
    }

    public async Task<int> GetCountAsync()
    {
        // Alias for CountAsync for backward compatibility
        return await CountAsync();
    }
}