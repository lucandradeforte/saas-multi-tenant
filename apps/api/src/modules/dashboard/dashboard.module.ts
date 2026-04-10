import { Module } from "@nestjs/common";
import { CustomersModule } from "../customers/customers.module";
import { ReportingModule } from "../reporting/reporting.module";
import { UsersModule } from "../users/users.module";
import { GetDashboardMetricsUseCase } from "./application/use-cases/get-dashboard-metrics.use-case";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [UsersModule, CustomersModule, ReportingModule],
  controllers: [DashboardController],
  providers: [GetDashboardMetricsUseCase]
})
export class DashboardModule {}
