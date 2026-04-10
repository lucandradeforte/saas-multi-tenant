namespace ReportingService.Application.DTOs;

public sealed class GenerateReportSummaryResponse
{
    public int HealthScore { get; init; }

    public decimal CustomerConversionRate { get; init; }

    public IReadOnlyCollection<string> Highlights { get; init; } = Array.Empty<string>();

    public DateTime GeneratedAt { get; init; }
}
