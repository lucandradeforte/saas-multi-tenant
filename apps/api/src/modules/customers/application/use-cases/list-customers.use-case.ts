import { Inject, Injectable } from "@nestjs/common";
import { CUSTOMER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository
  ) {}

  execute(companyId: string): Promise<Customer[]> {
    return this.customerRepository.listByCompany(companyId);
  }
}
