using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class FavoriteServiceTests
{
    [Fact]
    public async Task GetFavoritesAsync_ReturnsFavorites()
    {
        var favRepoMock = new Mock<IFavoriteRepository>();
        var subjectRepoMock = new Mock<ISubjectRepository>();
        var userRepoMock = new Mock<IUserRepository>();
        var loggerMock = new Mock<ILogger<FavoriteService>>();
        favRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<Favorite> {
            new Favorite {
                Id = 1,
                UserId = 1,
                SubjectId = 2,
                User = new User { Id = 1, CognitoId = "cognito-1", Email = "john@example.com" },
                Subject = new Subject { Id = 2, Title = "Math" }
            }
        });
        var service = new FavoriteService(favRepoMock.Object, subjectRepoMock.Object, userRepoMock.Object, loggerMock.Object);
        var favorites = await service.GetFavoritesAsync(1);
        Assert.Single(favorites);
    }
}
