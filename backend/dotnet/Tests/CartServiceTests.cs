using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class CartServiceTests
{
    [Fact]
    public async Task GetUserCartAsync_ReturnsCartItems()
    {
        var cartRepoMock = new Mock<ICartRepository>();
        var subjectRepoMock = new Mock<ISubjectRepository>();
        var userRepoMock = new Mock<IUserRepository>();
        var loggerMock = new Mock<ILogger<CartService>>();
        cartRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<CartItem> {
            new CartItem {
                Id = 1,
                UserId = 1,
                SubjectId = 2,
                User = new User { Id = 1, CognitoId = "cognito-1", Email = "john@example.com" },
                Subject = new Subject { Id = 2, Title = "Math" }
            }
        });
        var service = new CartService(cartRepoMock.Object, subjectRepoMock.Object, userRepoMock.Object, loggerMock.Object);
        var items = await service.GetUserCartAsync(1);
        Assert.Single(items);
    }
}
