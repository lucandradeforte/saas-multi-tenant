using ReportingService.Application.DTOs;
using ReportingService.Application.UseCases;

namespace ReportingService.Api.Endpoints;

public static class ReportEndpoints
{
    public static IEndpointRouteBuilder MapReportEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost(
            "/api/reports/summary",
            (GenerateReportSummaryRequest request, GenerateReportSummaryUseCase useCase) =>
            {
                var response = useCase.Execute(request);
                return Results.Ok(response);
            });

        return app;
    }
}
