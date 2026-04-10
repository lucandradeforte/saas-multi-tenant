import { Global, Module } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { RedisCacheService } from "./services/redis-cache.service";

@Global()
@Module({
  providers: [RedisCacheService, JwtAuthGuard, RolesGuard],
  exports: [RedisCacheService, JwtAuthGuard, RolesGuard]
})
export class CommonModule {}
