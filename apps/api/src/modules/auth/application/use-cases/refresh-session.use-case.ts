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

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  async execute(refreshToken: string): Promise<{
    user: ReturnType<RefreshSessionUseCase["serializeUser"]>;
    tokens: AuthTokens;
  }> {
    let payload;

    try {
      payload = await this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException("Invalid refresh token.");
    }

    const isRefreshTokenValid = await this.passwordHasher.compare(
      refreshToken,
      user.refreshTokenHash
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException("Invalid refresh token.");
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
