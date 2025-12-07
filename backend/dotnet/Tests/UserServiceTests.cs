using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class UserServiceTests
{
    [Fact]
    public async Task GetUserByIdAsync_ReturnsUser_WhenExists()
    {
        var repoMock = new Mock<IUserRepository>();
        var loggerMock = new Mock<ILogger<UserService>>();
        repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new User {
            Id = 1,
            FirstName = "John",
            CognitoId = "cognito-1",
            Email = "john@example.com"
        });
        var service = new UserService(repoMock.Object, loggerMock.Object);
        var user = await service.GetUserByIdAsync(1);
        Assert.NotNull(user);
        Assert.Equal(1, user.Id);
    }

    [Fact]
    public async Task GetUserByIdAsync_ReturnsNull_WhenNotExists()
    {
        var repoMock = new Mock<IUserRepository>();
        var loggerMock = new Mock<ILogger<UserService>>();
    repoMock.Setup(r => r.GetByIdAsync(2)).ReturnsAsync((User?)null);
        var service = new UserService(repoMock.Object, loggerMock.Object);
        var user = await service.GetUserByIdAsync(2);
        Assert.Null(user);
    }
}
