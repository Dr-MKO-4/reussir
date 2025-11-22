using Microsoft.AspNetCore.Mvc;
using EducationalAI.Models;
using EducationalAI.Services;

namespace EducationalAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIServiceClient _aiService;
    private readonly ILogger<AIController> _logger;

    public AIController(IAIServiceClient aiService, ILogger<AIController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Vérifie l'état du service Flask AI
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(typeof(ApiResponse<HealthCheckResponse>), 200)]
    public async Task<IActionResult> CheckHealth()
    {
        try
        {
            var health = await _aiService.CheckHealthAsync();
            
            if (health == null)
            {
                return StatusCode(503, new ApiResponse<object>
                {
                    Success = false,
                    Error = "AI Service is unavailable"
                });
            }

            return Ok(new ApiResponse<HealthCheckResponse>
            {
                Success = true,
                Data = health
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Analyse un contenu éducatif avec NLP
    /// </summary>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(ApiResponse<NLPAnalysisResult>), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> AnalyzeContent([FromBody] AnalyzeContentRequest request)
    {
        if (request.ContentId == null && string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "Either ContentId or Text must be provided"
            });
        }

        try
        {
            var result = await _aiService.AnalyzeContentAsync(request);

            return Ok(new ApiResponse<NLPAnalysisResult>
            {
                Success = true,
                Data = result
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Content analysis failed");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Obtient des recommandations pour un utilisateur
    /// </summary>
    [HttpGet("recommendations/{userId}")]
    [ProducesResponseType(typeof(ApiResponse<RecommendationResponse>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRecommendations(int userId, [FromQuery] int limit = 10)
    {
        if (userId <= 0)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "Invalid user ID"
            });
        }

        if (limit <= 0 || limit > 100)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "Limit must be between 1 and 100"
            });
        }

        try
        {
            var recommendations = await _aiService.GetRecommendationsAsync(userId, limit);

            return Ok(new ApiResponse<RecommendationResponse>
            {
                Success = true,
                Data = recommendations
            });
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Error = $"User {userId} not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get recommendations for user {UserId}", userId);
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Obtient des recommandations personnalisées avec filtres
    /// </summary>
    [HttpPost("recommendations/personalized")]
    [ProducesResponseType(typeof(ApiResponse<RecommendationResponse>), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> GetPersonalizedRecommendations([FromBody] PersonalizedRecommendationRequest request)
    {
        if (request.UserId <= 0)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "Invalid user ID"
            });
        }

        if (request.DifficultyRange != null && request.DifficultyRange.Length != 2)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "DifficultyRange must contain exactly 2 values [min, max]"
            });
        }

        try
        {
            var recommendations = await _aiService.GetPersonalizedRecommendationsAsync(request);

            return Ok(new ApiResponse<RecommendationResponse>
            {
                Success = true,
                Data = recommendations
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get personalized recommendations");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = ex.Message
            });
        }
    }

    /// <summary>
    /// Récupère les statistiques d'un utilisateur
    /// </summary>
    [HttpGet("users/{userId}/stats")]
    [ProducesResponseType(typeof(ApiResponse<UserStats>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetUserStats(int userId)
    {
        if (userId <= 0)
        {
            return BadRequest(new ApiResponse<object>
            {
                Success = false,
                Error = "Invalid user ID"
            });
        }

        try
        {
            var stats = await _aiService.GetUserStatsAsync(userId);

            return Ok(new ApiResponse<UserStats>
            {
                Success = true,
                Data = stats
            });
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return NotFound(new ApiResponse<object>
            {
                Success = false,
                Error = $"User {userId} not found"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get stats for user {UserId}", userId);
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = ex.Message
            });
        }
    }
}