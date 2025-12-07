using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("api/enrollments")]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<EnrollmentsController> _logger;

    public EnrollmentsController(IEnrollmentService enrollmentService, ILogger<EnrollmentsController> logger)
    {
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] Enrollment enrollment)
    {
        try
        {
            var result = await _enrollmentService.EnrollUserAsync(enrollment.UserId, enrollment.SubjectId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de l'inscription");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserEnrollments(int userId)
    {
        try
        {
            var enrollments = await _enrollmentService.GetUserEnrollmentsAsync(userId);
            return Ok(enrollments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des inscriptions utilisateur");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet("{userId}/{subjectId}")]
    public async Task<IActionResult> GetEnrollment(int userId, int subjectId)
    {
        try
        {
            var enrollment = await _enrollmentService.GetEnrollmentAsync(userId, subjectId);
            if (enrollment == null)
                return NotFound();
            return Ok(enrollment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération de l'inscription");
            return StatusCode(500, "Erreur serveur");
        }
    }
}
