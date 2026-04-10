import { User } from "../entities/user.entity";

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  saveRefreshTokenHash(userId: string, refreshTokenHash: string | null): Promise<void>;
  countUsersByCompany(companyId: string): Promise<number>;
  countAdminsByCompany(companyId: string): Promise<number>;
}
