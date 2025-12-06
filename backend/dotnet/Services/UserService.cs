using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services;

public interface IUserService
{
    Task<User?> GetUserByIdAsync(int id);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByCognitoIdAsync(string cognitoId);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User> CreateUserAsync(User user);
    Task<User> UpdateUserAsync(User user);
    Task<bool> DeleteUserAsync(int id);
    Task<bool> IsEmailAvailableAsync(string email);
    Task<bool> IsCognitoIdAvailableAsync(string cognitoId);
    Task<int> GetTotalUsersCountAsync();
    Task<User> UpdateUserProfileAsync(int userId, string firstName, string lastName, string bio, string? profileImageUrl);
}

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository userRepository, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        try
        {
            return await _userRepository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by id {UserId}", id);
            return null;
        }
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        try
        {
            return await _userRepository.GetByEmailAsync(email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email {Email}", email);
            return null;
        }
    }

    public async Task<User?> GetUserByCognitoIdAsync(string cognitoId)
    {
        try
        {
            return await _userRepository.GetByCognitoIdAsync(cognitoId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by cognito id");
            return null;
        }
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        try
        {
            return await _userRepository.GetAllAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users");
            return Enumerable.Empty<User>();
        }
    }

    public async Task<User> CreateUserAsync(User user)
    {
        try
        {
            if (string.IsNullOrEmpty(user.Email))
                throw new ArgumentException("Email is required");

            var emailExists = await _userRepository.ExistsByEmailAsync(user.Email);
            if (emailExists)
                throw new InvalidOperationException($"User with email {user.Email} already exists");

            user.IsActive = true;
            return await _userRepository.CreateAsync(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            throw;
        }
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        try
        {
            return await _userRepository.UpdateAsync(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {UserId}", user.Id);
            throw;
        }
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        try
        {
            return await _userRepository.DeleteAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}", id);
            throw;
        }
    }

    public async Task<bool> IsEmailAvailableAsync(string email)
    {
        try
        {
            var exists = await _userRepository.ExistsByEmailAsync(email);
            return !exists;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking email availability");
            return false;
        }
    }

    public async Task<bool> IsCognitoIdAvailableAsync(string cognitoId)
    {
        try
        {
            var exists = await _userRepository.ExistsByCognitoIdAsync(cognitoId);
            return !exists;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking cognito id availability");
            return false;
        }
    }

    public async Task<int> GetTotalUsersCountAsync()
    {
        try
        {
            return await _userRepository.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error counting users");
            return 0;
        }
    }

    public async Task<User> UpdateUserProfileAsync(int userId, string firstName, string lastName, string bio, string? profileImageUrl)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException($"User {userId} not found");

            user.FirstName = firstName;
            user.LastName = lastName;
            user.Bio = bio;
            if (!string.IsNullOrEmpty(profileImageUrl))
                user.ProfileImageUrl = profileImageUrl;

            return await _userRepository.UpdateAsync(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile {UserId}", userId);
            throw;
        }
    }
}
