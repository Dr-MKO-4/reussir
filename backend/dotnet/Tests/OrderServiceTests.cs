using Xunit;
using Moq;
using Backend.Services;
using Backend.Repositories;
using Backend.Models.Entities;
using Microsoft.Extensions.Logging;

namespace Backend.Tests;

public class OrderServiceTests
{
    [Fact]
    public async Task GetOrderByIdAsync_ReturnsOrder_WhenExists()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Order {
            Id = 1,
            OrderNumber = "ORD-1",
            User = new User { Id = 1, CognitoId = "cognito-1", Email = "john@example.com" }
        });
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var order = await service.GetOrderByIdAsync(1);
        Assert.NotNull(order);
        Assert.Equal(1, order.Id);
    }
}
