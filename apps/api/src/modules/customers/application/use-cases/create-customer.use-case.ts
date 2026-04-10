import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { RedisCacheService } from "../../../../common/services/redis-cache.service";
import { CUSTOMER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { CustomerStatus } from "../../domain/entities/customer-status.enum";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { CreateCustomerDto } from "../../presentation/dto/create-customer.dto";

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    private readonly cacheService: RedisCacheService
  ) {}

  async execute(companyId: string, dto: CreateCustomerDto): Promise<Customer> {
    const now = new Date();
    const customer = new Customer(
      uuid(),
      companyId,
      dto.name,
      dto.email.toLowerCase(),
      dto.phone ?? null,
      dto.status ?? CustomerStatus.LEAD,
      now,
      now
    );

    const created = await this.customerRepository.create(customer);
    await this.invalidateDashboard(companyId);
    return created;
  }

  private invalidateDashboard(companyId: string): Promise<void> {
    return this.cacheService.del(`dashboard:metrics:${companyId}`);
  }
}
