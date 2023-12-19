import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { UtilsService } from "src/utils/utils.service";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtService,
    UtilsService,
  ],
})
export class AuthModule {}
