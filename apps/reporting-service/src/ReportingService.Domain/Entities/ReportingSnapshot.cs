namespace ReportingService.Domain.Entities;

public sealed class ReportingSnapshot
{
    public ReportingSnapshot(
        int healthScore,
        decimal customerConversionRate,
        IReadOnlyCollection<string> highlights,
        DateTime generatedAt)
    {
        HealthScore = healthScore;
        CustomerConversionRate = customerConversionRate;
        Highlights = highlights;
        GeneratedAt = generatedAt;
    }

    public int HealthScore { get; }

    public decimal CustomerConversionRate { get; }

    public IReadOnlyCollection<string> Highlights { get; }

    public DateTime GeneratedAt { get; }
}
