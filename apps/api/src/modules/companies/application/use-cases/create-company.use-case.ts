import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { COMPANY_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { Company } from "../../domain/entities/company.entity";
import { CompanyRepository } from "../../domain/repositories/company.repository";

export interface CreateCompanyInput {
  name: string;
  slug: string;
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository
  ) {}

  async execute(input: CreateCompanyInput): Promise<Company> {
    const existingCompany = await this.companyRepository.findBySlug(input.slug);

    if (existingCompany) {
      throw new ConflictException("Company slug is already in use.");
    }

    const now = new Date();
    const company = new Company(uuid(), input.name, input.slug, now, now);

    return this.companyRepository.create(company);
  }
}
