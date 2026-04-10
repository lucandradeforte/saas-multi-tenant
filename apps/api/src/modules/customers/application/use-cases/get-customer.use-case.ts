import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CUSTOMER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { Customer } from "../../domain/entities/customer.entity";
import { CustomerRepository } from "../../domain/repositories/customer.repository";

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository
  ) {}

  async execute(companyId: string, id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(companyId, id);

    if (!customer) {
      throw new NotFoundException("Customer not found.");
    }

    return customer;
  }
}
