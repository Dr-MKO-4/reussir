using Xunit;
using Moq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using EducationalAI.Services;
using System.Net.Http.Json;

public class AIServiceClientTests
{
    [Fact]
    public async Task CheckHealthAsync_ReturnsHealthCheckResponse_OnSuccess()
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = JsonContent.Create(new { status = "ok" })
            });
        var httpClient = new HttpClient(handlerMock.Object)
        {
            BaseAddress = new System.Uri("http://localhost")
        };
        var loggerMock = new Mock<ILogger<AIServiceClient>>();
        var client = new AIServiceClient(httpClient, loggerMock.Object);
        var result = await client.CheckHealthAsync();
        Assert.NotNull(result);
    }
}
