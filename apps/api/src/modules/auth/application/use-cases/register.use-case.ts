import {
  ConflictException,
  Inject,
  Injectable
} from "@nestjs/common";
import {
  PASSWORD_HASHER,
  TOKEN_SERVICE,
  USER_REPOSITORY
} from "../../../../common/constants/injection-tokens";
import { CreateCompanyUseCase } from "../../../companies/application/use-cases/create-company.use-case";
import { Company } from "../../../companies/domain/entities/company.entity";
import { CreateUserUseCase } from "../../../users/application/use-cases/create-user.use-case";
import { UserRole } from "../../../users/domain/entities/user-role.enum";
import { User } from "../../../users/domain/entities/user.entity";
import { UserRepository } from "../../../users/domain/repositories/user.repository";
import { PasswordHasher } from "../../domain/services/password-hasher";
import { AuthTokens, TokenService } from "../../domain/services/token-service";
import { RegisterDto } from "../../presentation/dto/register.dto";

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: RegisterDto): Promise<{
    company: Company;
    user: ReturnType<RegisterUseCase["serializeUser"]>;
    tokens: AuthTokens;
  }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException("A user with this email already exists.");
    }

    const company = await this.createCompanyUseCase.execute({
      name: dto.companyName,
      slug: dto.companySlug
    });
    const passwordHash = await this.passwordHasher.hash(dto.password);
    const user = await this.createUserUseCase.execute({
      companyId: company.id,
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: UserRole.ADMIN
    });

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
      company,
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
