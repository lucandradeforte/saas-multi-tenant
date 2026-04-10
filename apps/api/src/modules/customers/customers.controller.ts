import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.interface";
import { UserRole } from "../users/domain/entities/user-role.enum";
import { CreateCustomerUseCase } from "./application/use-cases/create-customer.use-case";
import { DeleteCustomerUseCase } from "./application/use-cases/delete-customer.use-case";
import { GetCustomerUseCase } from "./application/use-cases/get-customer.use-case";
import { ListCustomersUseCase } from "./application/use-cases/list-customers.use-case";
import { UpdateCustomerUseCase } from "./application/use-cases/update-customer.use-case";
import { CreateCustomerDto } from "./presentation/dto/create-customer.dto";
import { UpdateCustomerDto } from "./presentation/dto/update-customer.dto";

@Controller("customers")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase
  ) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.listCustomersUseCase.execute(user.companyId);
  }

  @Get(":id")
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe()) id: string
  ) {
    return this.getCustomerUseCase.execute(user.companyId, id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCustomerDto
  ) {
    return this.createCustomerUseCase.execute(user.companyId, dto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCustomerDto
  ) {
    return this.updateCustomerUseCase.execute(user.companyId, id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", new ParseUUIDPipe()) id: string
  ) {
    await this.deleteCustomerUseCase.execute(user.companyId, id);
    return { success: true };
  }
}
