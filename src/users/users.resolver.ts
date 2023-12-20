import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user-input";
import { Roles } from "src/utils/decorators/role.decorator";
import { Role } from "src/auth/types";
import { GetUsersArgs } from "./dto/get-users-args";
import { GetUsersResponse } from "./dto/get-users-response";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Mutation(() => User)
  async createUser(
    @Args("createUserInput") createUserInput: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(createUserInput);
  }

  @Roles(Role.Admin)
  @Query(() => GetUsersResponse, { name: "users", nullable: true })
  async findAllUsers(
    @Args() { page, limit }: GetUsersArgs,
  ): Promise<GetUsersResponse> {
    return await this.usersService.findUsers(page, limit);
  }

  @Roles(Role.Admin)
  @Query(() => User, { name: "user", nullable: true })
  async findOneUser(
    @Args("id", { type: () => String }) id: string,
  ): Promise<User> {
    return await this.usersService.findOneUser(id);
  }
}
