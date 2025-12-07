using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.Entities;

namespace Backend.Controllers;

[ApiController]
[Route("api/subjects")]
public class SubjectsController : ControllerBase
{
    private readonly ISubjectService _subjectService;
    private readonly ILogger<SubjectsController> _logger;

    public SubjectsController(ISubjectService subjectService, ILogger<SubjectsController> logger)
    {
        _subjectService = subjectService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var subjects = await _subjectService.GetAllSubjectsAsync();
            return Ok(subjects);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des cours");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var subject = await _subjectService.GetSubjectByIdAsync(id);
            if (subject == null)
                return NotFound();
            return Ok(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération du cours {SubjectId}", id);
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Subject subject)
    {
        try
        {
            var created = await _subjectService.CreateSubjectAsync(subject);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la création du cours");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Subject subject)
    {
        try
        {
            subject.Id = id;
            var updated = await _subjectService.UpdateSubjectAsync(subject);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour du cours {SubjectId}", id);
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _subjectService.DeleteSubjectAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la suppression du cours {SubjectId}", id);
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        try
        {
            var results = await _subjectService.SearchSubjectsAsync(q);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la recherche de cours");
            return StatusCode(500, "Erreur serveur");
        }
    }

    [HttpGet("category/{name}")]
    public async Task<IActionResult> GetByCategory(string name)
    {
        try
        {
            var results = await _subjectService.GetSubjectsByCategoryAsync(name);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la récupération des cours par catégorie");
            return StatusCode(500, "Erreur serveur");
        }
    }
}
