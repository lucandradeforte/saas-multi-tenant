import { CustomerStatus } from "./customer-status.enum";

export class Customer {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly status: CustomerStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
