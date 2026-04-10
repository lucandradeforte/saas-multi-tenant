import {
  Inject,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY
} from "../../../../common/constants/injection-tokens";
import { User } from "../../../users/domain/entities/user.entity";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { PasswordHasher } from "../../domain/services/password-hasher";
import { AuthTokens, TokenService } from "../../domain/services/token-service";
import { LoginDto } from "../../presentation/dto/login.dto";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: LoginDto): Promise<{
    user: ReturnType<LoginUseCase["serializeUser"]>;
    tokens: AuthTokens;
  }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const tokens = await this.tokenService.issueTokens({
      sub: user.id,
      companyId: user.companyId,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const refreshHash = await this.passwordHasher.hash(tokens.refreshToken);
    await this.userRepository.saveRefreshTokenHash(user.id, refreshHash);

    return {
      user: this.serializeUser(user),
      tokens
    };
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      companyId: user.companyId,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
