import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { RolesGuard } from "src/utils/guards/roles.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  providers: [
    UsersResolver,
    UsersService,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class UsersModule {}
