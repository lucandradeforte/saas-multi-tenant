import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../../domain/entities/user.entity";
import { UserRole } from "../../../domain/entities/user-role.enum";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { UserOrmEntity } from "../entities/user.orm-entity";

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>
  ) {}

  async create(user: User): Promise<User> {
    const entity = this.repository.create({
      id: user.id,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      refreshTokenHash: user.refreshTokenHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.toLowerCase() }
    });

    return entity ? this.toDomain(entity) : null;
  }

  async saveRefreshTokenHash(
    userId: string,
    refreshTokenHash: string | null
  ): Promise<void> {
    await this.repository.update({ id: userId }, { refreshTokenHash });
  }

  async countUsersByCompany(companyId: string): Promise<number> {
    return this.repository.count({ where: { companyId } });
  }

  async countAdminsByCompany(companyId: string): Promise<number> {
    return this.repository.count({
      where: { companyId, role: UserRole.ADMIN }
    });
  }

  private toDomain(entity: UserOrmEntity): User {
    return new User(
      entity.id,
      entity.companyId,
      entity.name,
      entity.email,
      entity.passwordHash,
      entity.role,
      entity.refreshTokenHash,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
