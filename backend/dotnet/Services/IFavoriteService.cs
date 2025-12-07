using Backend.Models.Entities;

namespace Backend.Services;

public interface IFavoriteService
{
    Task<IEnumerable<Favorite>> GetFavoritesAsync(int userId);
    Task<Favorite> AddFavoriteAsync(int userId, int subjectId);
    Task<bool> RemoveFavoriteAsync(int userId, int subjectId);
    Task<bool> IsFavoriteAsync(int userId, int subjectId);
}
