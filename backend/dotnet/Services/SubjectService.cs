using Backend.Models.Entities;
using Backend.Repositories;

namespace Backend.Services;

public interface ISubjectService
{
    Task<Subject?> GetSubjectByIdAsync(int id);
    Task<IEnumerable<Subject>> GetAllSubjectsAsync();
    Task<IEnumerable<Subject>> GetPublishedSubjectsAsync();
    Task<IEnumerable<Subject>> GetSubjectsByCategoryAsync(string category);
    Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm);
    Task<IEnumerable<Subject>> GetPopularSubjectsAsync(int limit = 10);
    Task<Subject> CreateSubjectAsync(Subject subject);
    Task<Subject> UpdateSubjectAsync(Subject subject);
    Task<bool> DeleteSubjectAsync(int id);
    Task<int> GetTotalSubjectsCountAsync();
    Task<Subject> PublishSubjectAsync(int id);
    Task<Subject> UnpublishSubjectAsync(int id);
    Task<Subject> UpdateRatingAsync(int id, decimal rating, int ratingCount);
}

public class SubjectService : ISubjectService
{
    private readonly ISubjectRepository _subjectRepository;
    private readonly ILogger<SubjectService> _logger;

    public SubjectService(ISubjectRepository subjectRepository, ILogger<SubjectService> logger)
    {
        _subjectRepository = subjectRepository;
        _logger = logger;
    }

    public async Task<Subject?> GetSubjectByIdAsync(int id)
    {
        try
        {
            return await _subjectRepository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subject by id {SubjectId}", id);
            return null;
        }
    }

    public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
    {
        try
        {
            return await _subjectRepository.GetAllAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all subjects");
            return Enumerable.Empty<Subject>();
        }
    }

    public async Task<IEnumerable<Subject>> GetPublishedSubjectsAsync()
    {
        try
        {
            return await _subjectRepository.GetPublishedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting published subjects");
            return Enumerable.Empty<Subject>();
        }
    }

    public async Task<IEnumerable<Subject>> GetSubjectsByCategoryAsync(string category)
    {
        try
        {
            if (string.IsNullOrEmpty(category))
                return Enumerable.Empty<Subject>();

            return await _subjectRepository.GetByCategoryAsync(category);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting subjects by category {Category}", category);
            return Enumerable.Empty<Subject>();
        }
    }

    public async Task<IEnumerable<Subject>> SearchSubjectsAsync(string searchTerm)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<Subject>();

            return await _subjectRepository.SearchAsync(searchTerm);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching subjects");
            return Enumerable.Empty<Subject>();
        }
    }

    public async Task<IEnumerable<Subject>> GetPopularSubjectsAsync(int limit = 10)
    {
        try
        {
            return await _subjectRepository.GetPopularAsync(limit);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular subjects");
            return Enumerable.Empty<Subject>();
        }
    }

    public async Task<Subject> CreateSubjectAsync(Subject subject)
    {
        try
        {
            if (string.IsNullOrEmpty(subject.Title))
                throw new ArgumentException("Subject title is required");

            subject.IsPublished = false;
            subject.EnrollmentCount = 0;
            subject.AverageRating = 0;
            subject.TotalRatings = 0;

            return await _subjectRepository.CreateAsync(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating subject");
            throw;
        }
    }

    public async Task<Subject> UpdateSubjectAsync(Subject subject)
    {
        try
        {
            return await _subjectRepository.UpdateAsync(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating subject {SubjectId}", subject.Id);
            throw;
        }
    }

    public async Task<bool> DeleteSubjectAsync(int id)
    {
        try
        {
            return await _subjectRepository.DeleteAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting subject {SubjectId}", id);
            throw;
        }
    }

    public async Task<int> GetTotalSubjectsCountAsync()
    {
        try
        {
            return await _subjectRepository.CountAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error counting subjects");
            return 0;
        }
    }

    public async Task<Subject> PublishSubjectAsync(int id)
    {
        try
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null)
                throw new InvalidOperationException($"Subject {id} not found");

            subject.IsPublished = true;
            return await _subjectRepository.UpdateAsync(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error publishing subject {SubjectId}", id);
            throw;
        }
    }

    public async Task<Subject> UnpublishSubjectAsync(int id)
    {
        try
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null)
                throw new InvalidOperationException($"Subject {id} not found");

            subject.IsPublished = false;
            return await _subjectRepository.UpdateAsync(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error unpublishing subject {SubjectId}", id);
            throw;
        }
    }

    public async Task<Subject> UpdateRatingAsync(int id, decimal rating, int ratingCount)
    {
        try
        {
            var subject = await _subjectRepository.GetByIdAsync(id);
            if (subject == null)
                throw new InvalidOperationException($"Subject {id} not found");

            subject.AverageRating = rating;
            subject.TotalRatings = ratingCount;
            return await _subjectRepository.UpdateAsync(subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rating for subject {SubjectId}", id);
            throw;
        }
    }
}
