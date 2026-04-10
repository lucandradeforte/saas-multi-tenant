import { Inject, Injectable } from "@nestjs/common";
import {
  CUSTOMER_REPOSITORY,
  REPORTING_GATEWAY,
  USER_REPOSITORY
} from "../../../../common/constants/injection-tokens";
import { RedisCacheService } from "../../../../common/services/redis-cache.service";
import { CustomerStatus } from "../../../customers/domain/entities/customer-status.enum";
import { CustomerRepository } from "../../../customers/domain/repositories/customer.repository";
import {
  ReportingGateway,
  ReportingSummary
} from "../../../reporting/domain/contracts/reporting-gateway";
import { UserRepository } from "../../../users/domain/repositories/user.repository";

export interface DashboardMetrics {
  companyId: string;
  totals: {
    users: number;
    admins: number;
    customers: number;
    activeCustomers: number;
  };
  growth: {
    newCustomersLast30Days: number;
  };
  report: ReportingSummary;
}

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    @Inject(REPORTING_GATEWAY)
    private readonly reportingGateway: ReportingGateway,
    private readonly cacheService: RedisCacheService
  ) {}

  async execute(companyId: string): Promise<DashboardMetrics> {
    const cacheKey = `dashboard:metrics:${companyId}`;
    const cached = await this.cacheService.getJson<DashboardMetrics>(cacheKey);

    if (cached) {
      return cached;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [users, admins, customers, activeCustomers, newCustomersLast30Days] =
      await Promise.all([
        this.userRepository.countUsersByCompany(companyId),
        this.userRepository.countAdminsByCompany(companyId),
        this.customerRepository.countByCompany(companyId),
        this.customerRepository.countByStatusByCompany(
          companyId,
          CustomerStatus.ACTIVE
        ),
        this.customerRepository.countNewCustomersSince(companyId, thirtyDaysAgo)
      ]);

    const report = await this.reportingGateway.generateSummary({
      companyId,
      totalUsers: users,
      adminUsers: admins,
      totalCustomers: customers,
      activeCustomers,
      newCustomersLast30Days
    });

    const metrics: DashboardMetrics = {
      companyId,
      totals: {
        users,
        admins,
        customers,
        activeCustomers
      },
      growth: {
        newCustomersLast30Days
      },
      report
    };

    await this.cacheService.setJson(cacheKey, metrics, 60);
    return metrics;
  }
}
