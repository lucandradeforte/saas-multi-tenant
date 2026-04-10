import { Inject, Injectable } from "@nestjs/common";
import { RedisCacheService } from "../../../../common/services/redis-cache.service";
import { CUSTOMER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { GetCustomerUseCase } from "./get-customer.use-case";

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly cacheService: RedisCacheService
  ) {}

  async execute(companyId: string, id: string): Promise<void> {
    await this.getCustomerUseCase.execute(companyId, id);
    await this.customerRepository.delete(companyId, id);
    await this.cacheService.del(`dashboard:metrics:${companyId}`);
  }
}
