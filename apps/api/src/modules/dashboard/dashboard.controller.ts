import { Controller, Get, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.interface";
import { GetDashboardMetricsUseCase } from "./application/use-cases/get-dashboard-metrics.use-case";

@Controller("dashboard")
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase
  ) {}

  @Get("metrics")
  metrics(@CurrentUser() user: AuthenticatedUser) {
    return this.getDashboardMetricsUseCase.execute(user.companyId);
  }
}
