import { CustomerStatus } from "../entities/customer-status.enum";
import { Customer } from "../entities/customer.entity";

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>;
  listByCompany(companyId: string): Promise<Customer[]>;
  findById(companyId: string, id: string): Promise<Customer | null>;
  update(customer: Customer): Promise<Customer>;
  delete(companyId: string, id: string): Promise<void>;
  countByCompany(companyId: string): Promise<number>;
  countByStatusByCompany(companyId: string, status: CustomerStatus): Promise<number>;
  countNewCustomersSince(companyId: string, since: Date): Promise<number>;
}
