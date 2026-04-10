import { UserRole } from "./user-role.enum";

export class User {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly refreshTokenHash: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
