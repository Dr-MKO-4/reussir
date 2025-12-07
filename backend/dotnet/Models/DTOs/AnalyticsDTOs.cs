using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.DTOs;

/// <summary>
/// DTO pour tracker un événement analytics
/// </summary>
public class TrackEventRequest
{
    [Required]
    [MaxLength(100)]
    public string EventType { get; set; } = ""; // page_view, button_click, purchase, etc.

    [Required]
    [MaxLength(255)]
    public string EventName { get; set; } = "";

    [MaxLength(100)]
    public string? EventCategory { get; set; }

    [MaxLength(45)]
    public string? IpAddress { get; set; }

    [MaxLength(2000)]
    public string? EventData { get; set; } // JSON data
}

/// <summary>
/// DTO de réponse pour un événement analytics
/// </summary>
public class AnalyticsEventResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EventType { get; set; } = "";
    public string EventName { get; set; } = "";
    public string? EventCategory { get; set; }
    public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO pour les statistiques de session
/// </summary>
public class SessionStatsResponse
{
    public int UserId { get; set; }
    public int TotalEvents { get; set; }
    public Dictionary<string, int> EventTypes { get; set; } = new();
    public DateTime SessionStartTime { get; set; }
    public DateTime SessionEndTime { get; set; }
    public int TotalDurationMinutes { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// DTO pour les analytics utilisateur
/// </summary>
public class UserAnalyticsResponse
{
    public int UserId { get; set; }
    public int TotalEvents { get; set; }
    public int TotalEventLast7Days { get; set; }
    public int AverageEventsPerDay { get; set; }
    public Dictionary<string, int> EventTypeBreakdown { get; set; } = new();
    public DateTime? FirstEventDate { get; set; }
    public DateTime? LastEventDate { get; set; }
    public string? MostCommonEventType { get; set; }
}

/// <summary>
/// DTO pour les analytics du dashboard admin
/// </summary>
public class DashboardAnalyticsResponse
{
    public int TotalEvents { get; set; }
    public int Events24h { get; set; }
    public Dictionary<string, int> EventTypeBreakdown { get; set; } = new();
    public List<AnalyticsEventResponse> RecentEvents { get; set; } = new();
    public Dictionary<string, int> TopEventTypes { get; set; } = new();
}
