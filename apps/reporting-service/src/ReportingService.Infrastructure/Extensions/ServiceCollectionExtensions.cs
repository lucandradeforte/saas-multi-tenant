using Microsoft.Extensions.DependencyInjection;
using ReportingService.Application.UseCases;

namespace ReportingService.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddReportingServices(this IServiceCollection services)
    {
        services.AddScoped<GenerateReportSummaryUseCase>();
        return services;
    }
}
