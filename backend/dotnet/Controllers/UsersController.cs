using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        try
        {
            // À adapter selon l'authentification
            var userId = 1; // À remplacer par l'ID de l'utilisateur connecté
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération du profil utilisateur");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] User user)
    {
        try
        {
            var updated = await _userService.UpdateUserAsync(user);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour du profil utilisateur");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des utilisateurs");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _userService.DeleteUserAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression de l'utilisateur {UserId}", id);
            return StatusCode(500, "Erreur serveur");
        }
    }

    /// <summary>
    /// Récupère les statistiques du profil utilisateur courant
    /// </summary>
    [HttpGet("profile/statistics")]
    public async Task<IActionResult> GetProfileStatistics()
    {
        try
        {
            var statistics = await _userService.GetProfileStatisticsAsync();
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des statistiques du profil");
            return StatusCode(500, "Erreur serveur");
        }
    }

    /// <summary>
    /// Récupère les statistiques d'un utilisateur spécifique
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<IActionResult> GetUserStatistics(int id)
    {
        try
        {
            var statistics = await _userService.GetUserStatisticsAsync(id);
            return Ok(statistics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des statistiques de l'utilisateur {UserId}", id);
            return StatusCode(500, "Erreur serveur");
        }
    }
}
