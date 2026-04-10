import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { USER_REPOSITORY } from "../../common/constants/injection-tokens";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { UserOrmEntity } from "./infrastructure/persistence/entities/user.orm-entity";
import { UserTypeOrmRepository } from "./infrastructure/persistence/repositories/user.typeorm.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    CreateUserUseCase,
    UserTypeOrmRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: UserTypeOrmRepository
    }
  ],
  exports: [CreateUserUseCase, USER_REPOSITORY]
})
export class UsersModule {}
