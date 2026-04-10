import { Module } from "@nestjs/common";
import { REPORTING_GATEWAY } from "../../common/constants/injection-tokens";
import { ReportingHttpGateway } from "./infrastructure/reporting-http.gateway";

@Module({
  providers: [
    ReportingHttpGateway,
    {
      provide: REPORTING_GATEWAY,
      useExisting: ReportingHttpGateway
    }
  ],
  exports: [REPORTING_GATEWAY]
})
export class ReportingModule {}
