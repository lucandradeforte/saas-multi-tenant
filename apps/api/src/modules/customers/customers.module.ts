import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CUSTOMER_REPOSITORY } from "../../common/constants/injection-tokens";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "./application/use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "./application/use-cases/get-customer.use-case";
import { ListCustomersUseCase } from "./application/use-cases/list-customers.use-case";
import { UpdateCustomerUseCase } from "./application/use-cases/update-customer.use-case";
import { CustomersController } from "./customers.controller";
import { CustomerOrmEntity } from "./infrastructure/persistence/entities/customer.orm-entity";
import { CustomerTypeOrmRepository } from "./infrastructure/persistence/repositories/customer.typeorm.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    ListCustomersUseCase,
    GetCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    CustomerTypeOrmRepository,
    {
      provide: CUSTOMER_REPOSITORY,
      useExisting: CustomerTypeOrmRepository
    }
  ],
  exports: [CUSTOMER_REPOSITORY]
})
export class CustomersModule {}
