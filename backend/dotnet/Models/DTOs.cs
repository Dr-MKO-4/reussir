namespace EducationalAI.Models;

// ==================== USER MODELS ====================
public class UserProfile
{
    public int UserId { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Niveau { get; set; } = string.Empty; // débutant, intermédiaire, avancé
    public string Objectif { get; set; } = string.Empty;
}

public class UserStats
{
    public int UserId { get; set; }
    public UserProfile Profile { get; set; } = new();
    public Statistics Statistics { get; set; } = new();
}

public class Statistics
{
    public int TotalInteractions { get; set; }
    public int TotalReussites { get; set; }
    public double TauxReussite { get; set; }
    public double AvgTempsPasseSeconds { get; set; }
    public double AvgClics { get; set; }
    public int ContenusDistincts { get; set; }
}

// ==================== CONTENT MODELS ====================
public class Content
{
    public int ContentId { get; set; }
    public string Titre { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public double Difficulte { get; set; }
    public string Description { get; set; } = string.Empty;
}

// ==================== NLP ANALYSIS ====================
public class AnalyzeContentRequest
{
    public int? ContentId { get; set; }
    public string? Text { get; set; }
    public string? Title { get; set; }
    public bool ComputeEmbedding { get; set; } = false;
}

public class NLPAnalysisResult
{
    public double DifficultyScore { get; set; }
    public string DifficultyLevel { get; set; } = string.Empty; // facile, moyen, difficile
    public int EstimatedDurationMinutes { get; set; }
    public List<string> Tags { get; set; } = new();
    public ComplexityMetrics ComplexityMetrics { get; set; } = new();
    public List<double>? Embedding { get; set; }
}

public class ComplexityMetrics
{
    public int WordCount { get; set; }
    public int SentenceCount { get; set; }
    public double AvgWordLength { get; set; }
    public double AvgSentenceLength { get; set; }
}

// ==================== RECOMMENDATIONS ====================
public class RecommendationRequest
{
    public int UserId { get; set; }
    public int Limit { get; set; } = 10;
}

public class PersonalizedRecommendationRequest
{
    public int UserId { get; set; }
    public string? Theme { get; set; }
    public double[]? DifficultyRange { get; set; } // [min, max]
    public int Limit { get; set; } = 10;
}

public class RecommendationResponse
{
    public int UserId { get; set; }
    public List<RecommendedContent> Recommendations { get; set; } = new();
    public int Count { get; set; }
    public RecommendationFilters? Filters { get; set; }
}

public class RecommendedContent
{
    public int ContentId { get; set; }
    public string Titre { get; set; } = string.Empty;
    public string Theme { get; set; } = string.Empty;
    public double Difficulte { get; set; }
    public double Score { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class RecommendationFilters
{
    public string? Theme { get; set; }
    public double[]? DifficultyRange { get; set; }
}

// ==================== API RESPONSES ====================
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class HealthCheckResponse
{
    public string Status { get; set; } = string.Empty;
    public string Service { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
}

// ==================== AUTHENTICATION MODELS ====================
public class AuthenticationResultDto
{
    public string? AccessToken { get; set; }
    public string? IdToken { get; set; }
    public string? RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string? TokenType { get; set; }
}

public class SignInRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class SignInResponse
{
    public string? AccessToken { get; set; }
    public string? IdToken { get; set; }
    public string? RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string? TokenType { get; set; } = "Bearer";
    public string? Error { get; set; }
}

public class SignUpRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class ConfirmSignUpRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string ConfirmationCode { get; set; } = string.Empty;
}

public class RefreshTokenRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}