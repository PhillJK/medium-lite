import { SetMetadata } from "@nestjs/common";
import { Role } from "src/auth/types";

export const Roles = (...roles: Role[]) => SetMetadata("role", roles);
