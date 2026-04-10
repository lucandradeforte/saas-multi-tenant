import { Company } from "../entities/company.entity";

export interface CompanyRepository {
  create(company: Company): Promise<Company>;
  findById(id: string): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
}
