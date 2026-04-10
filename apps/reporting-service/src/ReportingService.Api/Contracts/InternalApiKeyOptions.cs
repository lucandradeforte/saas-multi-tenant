namespace ReportingService.Api.Contracts;

public sealed class InternalApiKeyOptions
{
    public const string SectionName = "Reporting";

    public string ApiKey { get; set; } = string.Empty;
}
