import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtModule } from "@nestjs/jwt";
import { UtilsService } from "src/utils/utils.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthResolver,
    AuthService,
    UtilsService,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
