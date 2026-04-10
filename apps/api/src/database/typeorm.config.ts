import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function buildTypeOrmOptions(
  configService: ConfigService
): TypeOrmModuleOptions {
  return {
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: Number(configService.get<string>("DB_PORT", "5432")),
    username: configService.get<string>("DB_USERNAME", "postgres"),
    password: configService.get<string>("DB_PASSWORD", "postgres"),
    database: configService.get<string>("DB_DATABASE", "saas_db"),
    autoLoadEntities: true,
    synchronize: configService.get<string>("DB_SYNCHRONIZE", "false") === "true"
  };
}
