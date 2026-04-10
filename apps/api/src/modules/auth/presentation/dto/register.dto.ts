import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: "companySlug must contain only lowercase letters, numbers, and hyphens"
  })
  companySlug!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
