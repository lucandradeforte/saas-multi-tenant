namespace ReportingService.Application.DTOs;

public sealed class GenerateReportSummaryRequest
{
    public string CompanyId { get; init; } = string.Empty;

    public int TotalUsers { get; init; }

    public int AdminUsers { get; init; }

    public int TotalCustomers { get; init; }

    public int ActiveCustomers { get; init; }

    public int NewCustomersLast30Days { get; init; }
}
