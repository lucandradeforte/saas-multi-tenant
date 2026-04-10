import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { COMPANY_REPOSITORY } from "../../common/constants/injection-tokens";
import { CreateCompanyUseCase } from "./application/use-cases/create-company.use-case";
import { CompanyOrmEntity } from "./infrastructure/persistence/entities/company.orm-entity";
import { CompanyTypeOrmRepository } from "./infrastructure/persistence/repositories/company.typeorm.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyOrmEntity])],
  providers: [
    CreateCompanyUseCase,
    CompanyTypeOrmRepository,
    {
      provide: COMPANY_REPOSITORY,
      useExisting: CompanyTypeOrmRepository
    }
  ],
  exports: [CreateCompanyUseCase, COMPANY_REPOSITORY]
})
export class CompaniesModule {}
