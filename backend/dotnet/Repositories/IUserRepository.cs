using Backend.Models.Entities;

namespace Backend.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByCognitoIdAsync(string cognitoId);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsByCognitoIdAsync(string cognitoId);
    Task<bool> ExistsByEmailAsync(string email);
    Task<int> CountAsync();
}
