using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class SubjectServiceTests
{
    [Fact]
    public async Task GetSubjectByIdAsync_ReturnsSubject_WhenExists()
    {
        var repoMock = new Mock<ISubjectRepository>();
        var loggerMock = new Mock<ILogger<SubjectService>>();
        repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Subject {
            Id = 1,
            Title = "Math"
        });
        var service = new SubjectService(repoMock.Object, loggerMock.Object);
        var subject = await service.GetSubjectByIdAsync(1);
        Assert.NotNull(subject);
        Assert.Equal(1, subject.Id);
    }

    [Fact]
    public async Task GetSubjectByIdAsync_ReturnsNull_WhenNotExists()
    {
        var repoMock = new Mock<ISubjectRepository>();
        var loggerMock = new Mock<ILogger<SubjectService>>();
    repoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync((Subject?)null);
        var service = new SubjectService(repoMock.Object, loggerMock.Object);
        var subject = await service.GetSubjectByIdAsync(2);
        Assert.Null(subject);
    }
}
