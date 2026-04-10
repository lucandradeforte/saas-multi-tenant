import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards
} from "@nestjs/common";
import { USER_REPOSITORY } from "../../common/constants/injection-tokens";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AuthenticatedUser } from "../../common/types/authenticated-user.interface";
import { UserRepository } from "../users/domain/repositories/user.repository";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RefreshSessionUseCase } from "./application/use-cases/refresh-session.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { LoginDto } from "./presentation/dto/login.dto";
import { RefreshTokenDto } from "./presentation/dto/refresh-token.dto";
import { RegisterDto } from "./presentation/dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }

  @Post("refresh")
  refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshSessionUseCase.execute(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.userRepository.saveRefreshTokenHash(user.sub, null);
    return { success: true };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
