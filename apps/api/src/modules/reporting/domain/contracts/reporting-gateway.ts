export interface ReportingSummaryRequest {
  companyId: string;
  totalUsers: number;
  adminUsers: number;
  totalCustomers: number;
  activeCustomers: number;
  newCustomersLast30Days: number;
}

export interface ReportingSummary {
  healthScore: number;
  customerConversionRate: number;
  highlights: string[];
  generatedAt: string;
}

export interface ReportingGateway {
  generateSummary(request: ReportingSummaryRequest): Promise<ReportingSummary>;
}
