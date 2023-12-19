import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register-input";
import { LoginInput } from "./dto/login-input";
import { AuthResponse, AuthResponseWithUser } from "./dto/auth-response";
import { Public } from "../utils/decorators/public.decorator";
import { UseGuards } from "@nestjs/common";
import { JwtRefreshAuthGuard } from "src/utils/guards/jwt-refresh-auth.guard";
import { GetCurrentUser } from "src/utils/decorators/get-current-user.decorator";
import { JwtPayload, JwtPayloadWithRefreshToken } from "./types";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponseWithUser)
  async register(
    @Args("registerInput") registerInput: RegisterInput,
  ): Promise<AuthResponseWithUser> {
    return await this.authService.registerUser(registerInput);
  }

  @Public()
  @Mutation(() => AuthResponseWithUser)
  async login(
    @Args("loginInput") loginInput: LoginInput,
  ): Promise<AuthResponseWithUser> {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => Boolean)
  async logout(@GetCurrentUser("id") userId: JwtPayload["id"]) {
    await this.authService.logout(userId);

    return true;
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Mutation(() => AuthResponse)
  async refreshTokens(@GetCurrentUser() user: JwtPayloadWithRefreshToken) {
    return await this.authService.refreshTokens(user.id, user.refreshToken);
  }
}
