import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommonModule } from "./common/common.module";
import { buildTypeOrmOptions } from "./database/typeorm.config";
import { AuthModule } from "./modules/auth/auth.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { ReportingModule } from "./modules/reporting/reporting.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmOptions
    }),
    CommonModule,
    CompaniesModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    ReportingModule,
    DashboardModule
  ]
})
export class AppModule {}
