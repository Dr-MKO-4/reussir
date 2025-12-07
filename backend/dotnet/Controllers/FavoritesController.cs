using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("api/favorites")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;
    private readonly ILogger<FavoritesController> _logger;

    public FavoritesController(IFavoriteService favoriteService, ILogger<FavoritesController> logger)
    {
        _favoriteService = favoriteService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var favorites = await _favoriteService.GetFavoritesAsync(userId);
            return Ok(favorites);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des favoris");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPost("{id}")]
    public async Task<IActionResult> AddFavorite(int id)
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var result = await _favoriteService.AddFavoriteAsync(userId, id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'ajout du favori");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFavorite(int id)
    {
        try
        {
            var userId = 1; // À remplacer par l'ID utilisateur connecté
            var result = await _favoriteService.RemoveFavoriteAsync(userId, id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression du favori");
            return StatusCode(500, "Erreur serveur");
        }
    }
}
