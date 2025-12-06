using System.Net.Http.Json;
using System.Text.Json;
using EducationalAI.Models;

namespace EducationalAI.Services;

public interface IAIServiceClient
{
    Task<HealthCheckResponse?> CheckHealthAsync();
    Task<NLPAnalysisResult?> AnalyzeContentAsync(AnalyzeContentRequest request);
    Task<RecommendationResponse?> GetRecommendationsAsync(int userId, int limit = 10);
    Task<RecommendationResponse?> GetPersonalizedRecommendationsAsync(PersonalizedRecommendationRequest request);
    Task<UserStats?> GetUserStatsAsync(int userId);
}

public class AIServiceClient : IAIServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AIServiceClient> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public AIServiceClient(HttpClient httpClient, ILogger<AIServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        
        // Configure JSON options (case insensitive for snake_case API responses)
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonSerializerOptions.Default.PropertyNamingPolicy
        };
    }

    public async Task<HealthCheckResponse?> CheckHealthAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/health");
            response.EnsureSuccessStatusCode();
            
            return await response.Content.ReadFromJsonAsync<HealthCheckResponse>(_jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to check AI service health");
            return null;
        }
    }

    public async Task<NLPAnalysisResult?> AnalyzeContentAsync(AnalyzeContentRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("/api/v1/analyze_content", request, _jsonOptions);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<NLPAnalysisResult>(_jsonOptions);
            
            _logger.LogInformation("Content analyzed successfully. Difficulty: {Level}", result?.DifficultyLevel);
            return result;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error while analyzing content");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to analyze content");
            throw;
        }
    }

    public async Task<RecommendationResponse?> GetRecommendationsAsync(int userId, int limit = 10)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/v1/recommendations?user_id={userId}&limit={limit}");
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<RecommendationResponse>(_jsonOptions);
            
            _logger.LogInformation("Retrieved {Count} recommendations for user {UserId}", result?.Count ?? 0, userId);
            return result;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error while getting recommendations for user {UserId}", userId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get recommendations for user {UserId}", userId);
            throw;
        }
    }

    public async Task<RecommendationResponse?> GetPersonalizedRecommendationsAsync(PersonalizedRecommendationRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("/api/v1/recommendations/personalized", request, _jsonOptions);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<RecommendationResponse>(_jsonOptions);
            
            _logger.LogInformation("Retrieved {Count} personalized recommendations for user {UserId}", 
                result?.Count ?? 0, request.UserId);
            return result;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error while getting personalized recommendations");
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get personalized recommendations");
            throw;
        }
    }

    public async Task<UserStats?> GetUserStatsAsync(int userId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/v1/users/{userId}/stats");
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadFromJsonAsync<UserStats>(_jsonOptions);
            
            _logger.LogInformation("Retrieved stats for user {UserId}", userId);
            return result;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error while getting user stats for {UserId}", userId);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get user stats for {UserId}", userId);
            throw;
        }
    }
}