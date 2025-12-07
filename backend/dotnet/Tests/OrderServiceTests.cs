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

    [Fact]
    public async Task GetUserOrdersAsync_ReturnsOrders()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<Order> {
            new Order { Id = 1, UserId = 1, OrderNumber = "ORD-1" }
        });
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var orders = await service.GetUserOrdersAsync(1);
        Assert.Single(orders);
    }

    [Fact]
    public async Task GetOrderByNumberAsync_ReturnsOrder_WhenExists()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetByOrderNumberAsync("ORD-1")).ReturnsAsync(new Order { Id = 1, OrderNumber = "ORD-1" });
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var order = await service.GetOrderByNumberAsync("ORD-1");
        Assert.NotNull(order);
        Assert.Equal("ORD-1", order.OrderNumber);
    }

    [Fact]
    public async Task GetOrderByNumberAsync_Throws_WhenOrderNumberIsNull()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        await Assert.ThrowsAsync<ArgumentException>(() => service.GetOrderByNumberAsync(null!));
    }

    [Fact]
    public async Task UpdateOrderStatusAsync_UpdatesStatus_WhenValid()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var order = new Order { Id = 1, Status = "pending" };
        orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
        orderRepoMock.Setup(r => r.UpdateAsync(order)).ReturnsAsync(order);
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var updated = await service.UpdateOrderStatusAsync(1, "completed");
        Assert.Equal("completed", updated.Status);
    }

    [Fact]
    public async Task UpdateOrderStatusAsync_Throws_WhenStatusInvalid()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        await Assert.ThrowsAsync<ArgumentException>(() => service.UpdateOrderStatusAsync(1, "badstatus"));
    }

    [Fact]
    public async Task CancelOrderAsync_Cancels_WhenNotCompleted()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var order = new Order { Id = 1, Status = "pending" };
        orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
        orderRepoMock.Setup(r => r.UpdateAsync(order)).ReturnsAsync(order);
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var result = await service.CancelOrderAsync(1);
        Assert.True(result);
        Assert.Equal("cancelled", order.Status);
    }

    [Fact]
    public async Task CancelOrderAsync_Throws_WhenOrderCompleted()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var order = new Order { Id = 1, Status = "completed" };
        orderRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(order);
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CancelOrderAsync(1));
    }

    [Fact]
    public async Task GetTotalRevenueAsync_ReturnsValue()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetTotalRevenueAsync()).ReturnsAsync(123.45m);
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var total = await service.GetTotalRevenueAsync();
        Assert.Equal(123.45m, total);
    }

    [Fact]
    public async Task GetOrderCountAsync_ReturnsCount()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Order> { new Order(), new Order() });
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var count = await service.GetOrderCountAsync();
        Assert.Equal(2, count);
    }

    [Fact]
    public async Task GetOrdersByStatusAsync_ReturnsOrders()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        orderRepoMock.Setup(r => r.GetByStatusAsync("pending")).ReturnsAsync(new List<Order> { new Order { Status = "pending" } });
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        var orders = await service.GetOrdersByStatusAsync("pending");
        Assert.Single(orders);
    }

    [Fact]
    public async Task CreateOrderAsync_Throws_WhenPaymentMethodMissing()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        await Assert.ThrowsAsync<ArgumentException>(() => service.CreateOrderAsync(1, ""));
    }

    [Fact]
    public async Task CreateOrderAsync_Throws_WhenCartEmpty()
    {
        var orderRepoMock = new Mock<IOrderRepository>();
        var cartRepoMock = new Mock<ICartRepository>();
        var loggerMock = new Mock<ILogger<OrderService>>();
        cartRepoMock.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<CartItem>());
        var service = new OrderService(orderRepoMock.Object, cartRepoMock.Object, loggerMock.Object);
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateOrderAsync(1, "card"));
    }
}
