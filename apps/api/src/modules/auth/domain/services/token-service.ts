import { UserRole } from "../../../users/domain/entities/user-role.enum";

export interface AuthTokenPayload {
  sub: string;
  companyId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export interface TokenService {
  issueTokens(payload: AuthTokenPayload): Promise<AuthTokens>;
  verifyRefreshToken(token: string): Promise<AuthTokenPayload>;
}
