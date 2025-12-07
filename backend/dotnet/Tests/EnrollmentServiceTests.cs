using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class EnrollmentServiceTests
{
    [Fact]
    public async Task GetUserEnrollmentsAsync_ReturnsEnrollments()
    {
        var userRepoMock = new Mock<IUserRepository>();
        var subjectRepoMock = new Mock<ISubjectRepository>();
        var loggerMock = new Mock<ILogger<EnrollmentService>>();
        userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new User {
            Id = 1,
            CognitoId = "cognito-1",
            Email = "john@example.com",
            Enrollments = new List<Enrollment> {
                new Enrollment {
                    Id = 1,
                    UserId = 1,
                    SubjectId = 2,
                    User = new User { Id = 1, CognitoId = "cognito-1", Email = "john@example.com" },
                    Subject = new Subject { Id = 2, Title = "Math" }
                }
            }
        });
        var service = new EnrollmentService(userRepoMock.Object, subjectRepoMock.Object, loggerMock.Object);
        var enrollments = await service.GetUserEnrollmentsAsync(1);
        Assert.Single(enrollments);
    }
}
