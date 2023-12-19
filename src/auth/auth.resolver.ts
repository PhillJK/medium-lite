import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register-input";
import { LoginInput } from "./dto/login-input";
import { LoginResponse } from "./dto/login-response";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async register(
    @Args("registerInput") registerInput: RegisterInput,
  ): Promise<LoginResponse> {
    return await this.authService.registerUser(registerInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args("loginInput") loginInput: LoginInput,
  ): Promise<LoginResponse> {
    return await this.authService.login(loginInput);
  }
}
