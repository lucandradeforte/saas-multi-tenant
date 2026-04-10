import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "../../../domain/entities/company.entity";
import { CompanyRepository } from "../../../domain/repositories/company.repository";
import { CompanyOrmEntity } from "../entities/company.orm-entity";

@Injectable()
export class CompanyTypeOrmRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>
  ) {}

  async create(company: Company): Promise<Company> {
    const entity = this.repository.create({
      id: company.id,
      name: company.name,
      slug: company.slug,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Company | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findBySlug(slug: string): Promise<Company | null> {
    const entity = await this.repository.findOne({ where: { slug } });
    return entity ? this.toDomain(entity) : null;
  }

  private toDomain(entity: CompanyOrmEntity): Company {
    return new Company(
      entity.id,
      entity.name,
      entity.slug,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
