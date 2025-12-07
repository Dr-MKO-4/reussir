using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly ISubjectRepository _subjectRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<FavoriteService> _logger;

    public FavoriteService(IFavoriteRepository favoriteRepository, ISubjectRepository subjectRepository, IUserRepository userRepository, ILogger<FavoriteService> logger)
    {
        _favoriteRepository = favoriteRepository;
        _subjectRepository = subjectRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<Favorite>> GetFavoritesAsync(int userId)
    {
        try
        {
            return await _favoriteRepository.GetByUserIdAsync(userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des favoris utilisateur");
            return Enumerable.Empty<Favorite>();
        }
    }

    public async Task<Favorite> AddFavoriteAsync(int userId, int subjectId)
    {
        try
        {
            var subject = await _subjectRepository.GetByIdAsync(subjectId);
            if (subject == null)
                throw new InvalidOperationException($"Cours {subjectId} introuvable");

            // Get user (for navigation property)
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException($"User {userId} not found");

            var favorite = new Favorite
            {
                UserId = userId,
                SubjectId = subjectId,
                User = user,
                Subject = subject
            };
            return await _favoriteRepository.AddAsync(favorite);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'ajout du favori");
            throw;
        }
    }

    public async Task<bool> RemoveFavoriteAsync(int userId, int subjectId)
    {
        try
        {
            return await _favoriteRepository.RemoveByUserAndSubjectAsync(userId, subjectId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression du favori");
            return false;
        }
    }

    public async Task<bool> IsFavoriteAsync(int userId, int subjectId)
    {
        try
        {
            var fav = await _favoriteRepository.GetByUserAndSubjectAsync(userId, subjectId);
            return fav != null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la vérification du favori");
            return false;
        }
    }
}
