using Microsoft.Extensions.Options;
using ReportingService.Api.Contracts;
using ReportingService.Api.Endpoints;
using ReportingService.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<InternalApiKeyOptions>(options =>
{
    options.ApiKey = builder.Configuration["REPORTING_API_KEY"]
        ?? builder.Configuration[$"{InternalApiKeyOptions.SectionName}:ApiKey"]
        ?? string.Empty;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddRouting();
builder.Services.AddReportingServices();

var app = builder.Build();

app.Use(async (context, next) =>
{
    if (!context.Request.Path.StartsWithSegments("/api/reports"))
    {
        await next();
        return;
    }

    var options = context.RequestServices
        .GetRequiredService<IOptions<InternalApiKeyOptions>>()
        .Value;

    if (string.IsNullOrWhiteSpace(options.ApiKey))
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new
        {
            error = "REPORTING_API_KEY is not configured."
        });
        return;
    }

    var providedApiKey = context.Request.Headers["x-internal-api-key"].ToString();
    if (!string.Equals(providedApiKey, options.ApiKey, StringComparison.Ordinal))
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsJsonAsync(new
        {
            error = "Invalid internal API key."
        });
        return;
    }

    await next();
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapReportEndpoints();

app.Run();
