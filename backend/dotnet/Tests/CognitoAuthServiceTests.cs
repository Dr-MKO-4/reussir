using Xunit;
using Moq;
using Backend.Services;
using Microsoft.Extensions.Logging;
using Amazon.CognitoIdentityProvider;
using Backend.Data;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests;

public class CognitoAuthServiceTests
{
    [Fact]
    public void Constructor_ThrowsIfConfigMissing()
    {
        var cognitoMock = new Mock<IAmazonCognitoIdentityProvider>();
        var dbContextMock = new Mock<ApplicationDbContext>();
        var loggerMock = new Mock<ILogger<CognitoAuthService>>();
        var configMock = new Mock<IConfiguration>();
        configMock.Setup(c => c["AWS:UserPoolId"]).Returns((string?)null);
        configMock.Setup(c => c["AWS:UserPoolClientId"]).Returns((string?)null);
        Assert.Throws<InvalidOperationException>(() =>
            new CognitoAuthService(cognitoMock.Object, dbContextMock.Object, configMock.Object, loggerMock.Object));
    }
}
