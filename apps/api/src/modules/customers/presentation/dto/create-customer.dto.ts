import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength
} from "class-validator";
import { CustomerStatus } from "../../domain/entities/customer-status.enum";

export class CreateCustomerDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}
