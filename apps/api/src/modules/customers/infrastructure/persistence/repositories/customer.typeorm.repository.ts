import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { CustomerStatus } from "../../../domain/entities/customer-status.enum";
import { Customer } from "../../../domain/entities/customer.entity";
import { CustomerRepository } from "../../../domain/repositories/customer.repository";
import { CustomerOrmEntity } from "../entities/customer.orm-entity";

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const entity = this.repository.create({
      id: customer.id,
      companyId: customer.companyId,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async listByCompany(companyId: string): Promise<Customer[]> {
    const entities = await this.repository.find({
      where: { companyId },
      order: { createdAt: "DESC" }
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findById(companyId: string, id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({
      where: { companyId, id }
    });

    return entity ? this.toDomain(entity) : null;
  }

  async update(customer: Customer): Promise<Customer> {
    await this.repository.update(
      { companyId: customer.companyId, id: customer.id },
      {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        updatedAt: customer.updatedAt
      }
    );

    const entity = await this.repository.findOneOrFail({
      where: { companyId: customer.companyId, id: customer.id }
    });

    return this.toDomain(entity);
  }

  async delete(companyId: string, id: string): Promise<void> {
    await this.repository.delete({ companyId, id });
  }

  async countByCompany(companyId: string): Promise<number> {
    return this.repository.count({ where: { companyId } });
  }

  async countByStatusByCompany(
    companyId: string,
    status: CustomerStatus
  ): Promise<number> {
    return this.repository.count({ where: { companyId, status } });
  }

  async countNewCustomersSince(companyId: string, since: Date): Promise<number> {
    return this.repository.count({
      where: {
        companyId,
        createdAt: MoreThanOrEqual(since)
      }
    });
  }

  private toDomain(entity: CustomerOrmEntity): Customer {
    return new Customer(
      entity.id,
      entity.companyId,
      entity.name,
      entity.email,
      entity.phone,
      entity.status,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
