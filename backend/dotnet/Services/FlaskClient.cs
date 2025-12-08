using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Backend.Models.DTOs;

namespace Backend.Services;

/// <summary>
/// Interface for Flask API communication
/// </summary>
    public interface IFlaskClient
    {
        Task<RecommendationResponse> GetRecommendationsAsync(int userId, string preferenceLevel, string category);
        Task<ProgressAnalysisResponse> AnalyzeProgressAsync(int userId, int subjectId, string depth);
        Task<QuizGenerationResponse> GenerateQuizAsync(int userId, int subjectId, int questionCount, string difficulty);
        Task<PerformanceMetricsResponse> GetPerformanceAsync(int userId, string timePeriod);
        Task<LearningPathResponse> GenerateLearningPathAsync(int userId, string goalSubject, int weeks, int hoursPerWeek);
    }

    /// <summary>
    /// Flask API client for AI features
    /// Handles HTTP communication with Python Flask backend
    /// </summary>
    public class FlaskClient : IFlaskClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<FlaskClient> _logger;
        private readonly IConfiguration _configuration;
        private readonly JsonSerializerOptions _jsonOptions;

        public FlaskClient(
            HttpClient httpClient,
            ILogger<FlaskClient> logger,
            IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _configuration = configuration;
            _jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        }

        /// <summary>
        /// Get course recommendations from Flask
        /// </summary>
        public async Task<RecommendationResponse> GetRecommendationsAsync(
            int userId,
            string preferenceLevel,
            string category)
        {
            try
            {
                _logger.LogInformation($"Requesting recommendations for user {userId}");

                var request = new
                {
                    user_id = userId,
                    preference_level = preferenceLevel,
                    category = category
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync("/api/recommend", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Flask recommendation API returned {response.StatusCode}");
                    return GetDefaultRecommendationResponse(userId);
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var recommendations = JsonSerializer.Deserialize<RecommendationResponse>(
                    jsonResponse, _jsonOptions);

                _logger.LogInformation($"Successfully retrieved {recommendations?.Recommendations.Count} recommendations");
                return recommendations ?? GetDefaultRecommendationResponse(userId);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Flask recommendation API error: {ex.Message}");
                return GetDefaultRecommendationResponse(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting recommendations: {ex.Message}");
                return GetDefaultRecommendationResponse(userId);
            }
        }

        /// <summary>
        /// Analyze student progress from Flask
        /// </summary>
        public async Task<ProgressAnalysisResponse> AnalyzeProgressAsync(
            int userId,
            int subjectId,
            string depth)
        {
            try
            {
                _logger.LogInformation($"Analyzing progress for user {userId}, subject {subjectId}");

                var request = new
                {
                    user_id = userId,
                    subject_id = subjectId,
                    analysis_depth = depth
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync("/api/analyze-progress", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Flask progress analysis API returned {response.StatusCode}");
                    return GetDefaultProgressAnalysis(userId, subjectId);
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var analysis = JsonSerializer.Deserialize<ProgressAnalysisResponse>(
                    jsonResponse, _jsonOptions);

                _logger.LogInformation($"Successfully analyzed progress for user {userId}");
                return analysis ?? GetDefaultProgressAnalysis(userId, subjectId);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Flask progress analysis API error: {ex.Message}");
                return GetDefaultProgressAnalysis(userId, subjectId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error analyzing progress: {ex.Message}");
                return GetDefaultProgressAnalysis(userId, subjectId);
            }
        }

        /// <summary>
        /// Generate quiz questions from Flask
        /// </summary>
        public async Task<QuizGenerationResponse> GenerateQuizAsync(
            int userId,
            int subjectId,
            int questionCount,
            string difficulty)
        {
            try
            {
                _logger.LogInformation($"Generating quiz for user {userId}, subject {subjectId}");

                var request = new
                {
                    user_id = userId,
                    subject_id = subjectId,
                    number_of_questions = questionCount,
                    difficulty = difficulty
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync("/api/generate-quiz", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Flask quiz generation API returned {response.StatusCode}");
                    return GetDefaultQuizResponse(userId, subjectId);
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var quiz = JsonSerializer.Deserialize<QuizGenerationResponse>(
                    jsonResponse, _jsonOptions);

                _logger.LogInformation($"Successfully generated {quiz?.Questions.Count} quiz questions");
                return quiz ?? GetDefaultQuizResponse(userId, subjectId);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Flask quiz generation API error: {ex.Message}");
                return GetDefaultQuizResponse(userId, subjectId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating quiz: {ex.Message}");
                return GetDefaultQuizResponse(userId, subjectId);
            }
        }

        /// <summary>
        /// Get performance metrics from Flask
        /// </summary>
        public async Task<PerformanceMetricsResponse> GetPerformanceAsync(
            int userId,
            string timePeriod)
        {
            try
            {
                _logger.LogInformation($"Requesting performance metrics for user {userId}");

                var url = $"/api/performance?user_id={userId}&time_period={timePeriod}";
                var response = await _httpClient.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Flask performance API returned {response.StatusCode}");
                    return GetDefaultPerformanceMetrics(userId);
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var metrics = JsonSerializer.Deserialize<PerformanceMetricsResponse>(
                    jsonResponse, _jsonOptions);

                _logger.LogInformation($"Successfully retrieved performance metrics for user {userId}");
                return metrics ?? GetDefaultPerformanceMetrics(userId);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Flask performance API error: {ex.Message}");
                return GetDefaultPerformanceMetrics(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting performance metrics: {ex.Message}");
                return GetDefaultPerformanceMetrics(userId);
            }
        }

        /// <summary>
        /// Generate personalized learning path from Flask
        /// </summary>
        public async Task<LearningPathResponse> GenerateLearningPathAsync(
            int userId,
            string goalSubject,
            int weeks,
            int hoursPerWeek)
        {
            try
            {
                _logger.LogInformation($"Generating learning path for user {userId}");

                var request = new
                {
                    user_id = userId,
                    goal_subject = goalSubject,
                    timeframe_weeks = weeks,
                    available_hours_per_week = hoursPerWeek
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(request),
                    Encoding.UTF8,
                    "application/json");

                var response = await _httpClient.PostAsync("/api/learning-path", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"Flask learning path API returned {response.StatusCode}");
                    return GetDefaultLearningPath(userId, goalSubject, weeks);
                }

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var path = JsonSerializer.Deserialize<LearningPathResponse>(
                    jsonResponse, _jsonOptions);

                _logger.LogInformation($"Successfully generated learning path with {path?.Weeks.Count} weeks");
                return path ?? GetDefaultLearningPath(userId, goalSubject, weeks);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Flask learning path API error: {ex.Message}");
                return GetDefaultLearningPath(userId, goalSubject, weeks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating learning path: {ex.Message}");
                return GetDefaultLearningPath(userId, goalSubject, weeks);
            }
        }

        #region Default Responses (Fallback)

        private RecommendationResponse GetDefaultRecommendationResponse(int userId)
        {
            _logger.LogWarning("Returning default recommendation response");
            return new RecommendationResponse
            {
                UserId = userId,
                Recommendations = new List<RecommendationItem>(),
                GeneratedAt = DateTime.UtcNow
            };
        }

        private ProgressAnalysisResponse GetDefaultProgressAnalysis(int userId, int subjectId)
        {
            _logger.LogWarning("Returning default progress analysis");
            return new ProgressAnalysisResponse
            {
                UserId = userId,
                SubjectId = subjectId,
                CompletionPercentage = 0,
                ProgressTrend = "unknown",
                EstimatedCompletionDate = DateTime.UtcNow.AddMonths(3),
                WeakAreas = new List<string>(),
                Strengths = new List<string>(),
                Recommendations = new List<string> { "Please try again later" }
            };
        }

        private QuizGenerationResponse GetDefaultQuizResponse(int userId, int subjectId)
        {
            _logger.LogWarning("Returning default quiz response");
            return new QuizGenerationResponse
            {
                QuizId = 0,
                UserId = userId,
                SubjectId = subjectId,
                Questions = new List<QuizQuestion>(),
                EstimatedDurationMinutes = 0,
                CreatedAt = DateTime.UtcNow
            };
        }

        private PerformanceMetricsResponse GetDefaultPerformanceMetrics(int userId)
        {
            _logger.LogWarning("Returning default performance metrics");
            return new PerformanceMetricsResponse
            {
                UserId = userId,
                PerformanceScore = 0,
                LearningRate = 0,
                CompletionRate = 0,
                EngagementScore = 0,
                CompareToAverage = new ClassComparison
                {
                    YourScore = 0,
                    ClassAverage = 0,
                    Percentile = 0
                },
                CalculatedAt = DateTime.UtcNow
            };
        }

        private LearningPathResponse GetDefaultLearningPath(int userId, string goalSubject, int weeks)
        {
            _logger.LogWarning("Returning default learning path");
            return new LearningPathResponse
            {
                UserId = userId,
                PathId = 0,
                GoalSubject = goalSubject,
                Weeks = new List<LearningPathWeek>(),
                CompletionEstimate = DateTime.UtcNow.AddDays(weeks * 7),
                CreatedAt = DateTime.UtcNow
            };
        }

        #endregion
    }
