using ReportingService.Application.DTOs;
using ReportingService.Domain.Entities;

namespace ReportingService.Application.UseCases;

public sealed class GenerateReportSummaryUseCase
{
    public GenerateReportSummaryResponse Execute(GenerateReportSummaryRequest request)
    {
        var conversionRate = request.TotalCustomers == 0
            ? 0m
            : Math.Round((decimal)request.ActiveCustomers / request.TotalCustomers * 100, 2);

        var healthScore = Math.Min(
            100,
            (request.ActiveCustomers * 4) + (request.NewCustomersLast30Days * 3) + (request.TotalUsers * 2));

        var highlights = new List<string>
        {
            $"Tenant {request.CompanyId} currently has {request.TotalCustomers} tracked customers.",
            $"{request.ActiveCustomers} customers are active, yielding a {conversionRate}% conversion rate.",
            $"{request.NewCustomersLast30Days} customers were created in the last 30 days."
        };

        if (request.AdminUsers == 0)
        {
            highlights.Add("No admins are currently assigned to this tenant.");
        }
        else if (request.AdminUsers == 1)
        {
            highlights.Add("A single admin is managing this tenant today.");
        }
        else
        {
            highlights.Add($"{request.AdminUsers} admins are collaborating on this tenant.");
        }

        var snapshot = new ReportingSnapshot(
            healthScore,
            conversionRate,
            highlights,
            DateTime.UtcNow);

        return new GenerateReportSummaryResponse
        {
            HealthScore = snapshot.HealthScore,
            CustomerConversionRate = snapshot.CustomerConversionRate,
            Highlights = snapshot.Highlights,
            GeneratedAt = snapshot.GeneratedAt
        };
    }
}
