using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.DTOs;
using Backend.Services;

namespace Backend.Controllers;

/// <summary>
/// Controller pour les opérations administrateur
/// </summary>
[ApiController]
[Route("api/admin")]
[Produces("application/json")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly ILogger<AdminController> _logger;

    public AdminController(IAdminService adminService, ILogger<AdminController> logger)
    {
        _adminService = adminService;
        _logger = logger;
    }

    /// <summary>
    /// Récupère la liste de tous les utilisateurs
    /// </summary>
    /// <param name="page">Numéro de page</param>
    /// <param name="limit">Nombre de résultats par page</param>
    /// <returns>Liste des utilisateurs</returns>
    /// <response code="200">Utilisateurs retournés</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpGet("users")]
    [ProducesResponseType(typeof(AdminUserListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            var response = await _adminService.GetAllUsersAsync(page, limit);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all users");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Récupère la liste de tous les cours
    /// </summary>
    /// <param name="page">Numéro de page</param>
    /// <param name="limit">Nombre de résultats par page</param>
    /// <returns>Liste des cours</returns>
    /// <response code="200">Cours retournés</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpGet("subjects")]
    [ProducesResponseType(typeof(AdminSubjectListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllSubjects([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            var response = await _adminService.GetAllSubjectsAsync(page, limit);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all subjects");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Récupère la liste de toutes les commandes
    /// </summary>
    /// <param name="page">Numéro de page</param>
    /// <param name="limit">Nombre de résultats par page</param>
    /// <returns>Liste des commandes</returns>
    /// <response code="200">Commandes retournées</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpGet("orders")]
    [ProducesResponseType(typeof(AdminOrderListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllOrders([FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        try
        {
            var response = await _adminService.GetAllOrdersAsync(page, limit);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all orders");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Récupère les statistiques système
    /// </summary>
    /// <returns>Statistiques système</returns>
    /// <response code="200">Statistiques retournées</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpGet("statistics")]
    [ProducesResponseType(typeof(AdminSystemStatsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSystemStatistics()
    {
        try
        {
            var response = await _adminService.GetSystemStatisticsAsync();
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system statistics");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Bloque un utilisateur
    /// </summary>
    /// <param name="userId">ID de l'utilisateur à bloquer</param>
    /// <returns>Résultat de l'opération</returns>
    /// <response code="200">Utilisateur bloqué avec succès</response>
    /// <response code="400">Requête invalide</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpPost("user/{userId}/block")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> BlockUser(int userId)
    {
        try
        {
            if (userId <= 0)
                return BadRequest(new { error = "Invalid user ID" });

            var result = await _adminService.BlockUserAsync(userId);
            if (!result)
                return NotFound(new { error = "User not found" });

            return Ok(new { message = "User blocked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error blocking user: {UserId}", userId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Débloque un utilisateur
    /// </summary>
    /// <param name="userId">ID de l'utilisateur à débloquer</param>
    /// <returns>Résultat de l'opération</returns>
    /// <response code="200">Utilisateur débloqué avec succès</response>
    /// <response code="400">Requête invalide</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpPost("user/{userId}/unblock")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UnblockUser(int userId)
    {
        try
        {
            if (userId <= 0)
                return BadRequest(new { error = "Invalid user ID" });

            var result = await _adminService.UnblockUserAsync(userId);
            if (!result)
                return NotFound(new { error = "User not found" });

            return Ok(new { message = "User unblocked successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unblocking user: {UserId}", userId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Récupère le dashboard admin
    /// </summary>
    /// <returns>Données du dashboard</returns>
    /// <response code="200">Dashboard retourné</response>
    /// <response code="401">Non autorisé</response>
    /// <response code="500">Erreur serveur</response>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(AdminDashboardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetDashboard()
    {
        try
        {
            var response = await _adminService.GetAdminDashboardAsync();
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting admin dashboard");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
