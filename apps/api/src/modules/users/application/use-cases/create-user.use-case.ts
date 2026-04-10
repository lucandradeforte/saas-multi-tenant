import { Inject, Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { USER_REPOSITORY } from "../../../../common/constants/injection-tokens";
import { UserRole } from "../../domain/entities/user-role.enum";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export interface CreateUserInput {
  companyId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const now = new Date();
    const user = new User(
      uuid(),
      input.companyId,
      input.name,
      input.email.toLowerCase(),
      input.passwordHash,
      input.role,
      null,
      now,
      now
    );

    return this.userRepository.create(user);
  }
}
