import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  AuthTokenPayload,
  AuthTokens,
  TokenService
} from "../../domain/services/token-service";

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async issueTokens(payload: AuthTokenPayload): Promise<AuthTokens> {
    const accessTokenExpiresIn = this.configService.get<string>(
      "JWT_ACCESS_EXPIRES_IN",
      "15m"
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      "JWT_REFRESH_EXPIRES_IN",
      "7d"
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: accessTokenExpiresIn
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: refreshTokenExpiresIn
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn
    };
  }

  async verifyRefreshToken(token: string): Promise<AuthTokenPayload> {
    return this.jwtService.verifyAsync<AuthTokenPayload>(token, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET")
    });
  }
}
