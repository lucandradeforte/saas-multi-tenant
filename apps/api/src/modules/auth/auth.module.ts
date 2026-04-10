import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE
} from "../../common/constants/injection-tokens";
import { CompaniesModule } from "../companies/companies.module";
import { UsersModule } from "../users/users.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RefreshSessionUseCase } from "./application/use-cases/refresh-session.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { AuthController } from "./auth.controller";
import { BcryptPasswordHasherService } from "./infrastructure/security/bcrypt-password-hasher.service";
import { JwtTokenService } from "./infrastructure/tokens/jwt-token.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [PassportModule, JwtModule.register({}), CompaniesModule, UsersModule],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshSessionUseCase,
    JwtStrategy,
    BcryptPasswordHasherService,
    JwtTokenService,
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasherService
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService
    }
  ],
  exports: [JwtStrategy]
})
export class AuthModule {}
