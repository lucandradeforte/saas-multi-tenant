import { Inject, Injectable } from "@nestjs/common";
import { RedisCacheService } from "../../../../common/services/redis-cache.service";
import { CUSTOMER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { UpdateCustomerDto } from "../../presentation/dto/update-customer.dto";
import { GetCustomerUseCase } from "./get-customer.use-case";

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly cacheService: RedisCacheService
  ) {}

  async execute(
    companyId: string,
    id: string,
    dto: UpdateCustomerDto
  ): Promise<Customer> {
    const current = await this.getCustomerUseCase.execute(companyId, id);

    const updated = new Customer(
      current.id,
      current.companyId,
      dto.name ?? current.name,
      dto.email?.toLowerCase() ?? current.email,
      dto.phone ?? current.phone,
      dto.status ?? current.status,
      current.createdAt,
      new Date()
    );

    const saved = await this.customerRepository.update(updated);
    await this.invalidateDashboard(companyId);
    return saved;
  }

  private invalidateDashboard(companyId: string): Promise<void> {
    return this.cacheService.del(`dashboard:metrics:${companyId}`);
  }
}
