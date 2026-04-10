import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import {
  ReportingGateway,
  ReportingSummary,
  ReportingSummaryRequest
} from "../domain/contracts/reporting-gateway";

@Injectable()
export class ReportingHttpGateway implements ReportingGateway {
  private readonly logger = new Logger(ReportingHttpGateway.name);

  constructor(private readonly configService: ConfigService) {}

  async generateSummary(
    request: ReportingSummaryRequest
  ): Promise<ReportingSummary> {
    const baseUrl = this.configService.get<string>(
      "REPORTING_BASE_URL",
      "http://localhost:5050"
    );
    const apiKey = this.configService.get<string>("REPORTING_API_KEY", "");

    try {
      const response = await axios.post<ReportingSummary>(
        `${baseUrl}/api/reports/summary`,
        request,
        {
          headers: {
            "x-internal-api-key": apiKey
          },
          timeout: 4000
        }
      );

      return response.data;
    } catch (error) {
      this.logger.warn("Reporting service unavailable. Falling back to local summary.");
      const customerConversionRate =
        request.totalCustomers > 0
          ? Number(
              ((request.activeCustomers / request.totalCustomers) * 100).toFixed(2)
            )
          : 0;

      return {
        generatedAt: new Date().toISOString(),
        healthScore: Math.min(
          100,
          request.totalCustomers * 2 + request.newCustomersLast30Days * 4
        ),
        customerConversionRate,
        highlights: [
          `${request.totalCustomers} customers across the tenant portfolio.`,
          `${request.activeCustomers} active customers currently tracked.`,
          `${request.newCustomersLast30Days} customers added in the last 30 days.`
        ]
      };
    }
  }
}
