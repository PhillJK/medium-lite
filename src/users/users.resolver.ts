import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { Roles } from "src/utils/decorators/role.decorator";
import { Role } from "src/auth/types";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin)
  @Mutation(() => User)
  createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Roles(Role.Admin)
  @Query(() => [User], { name: "users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.Admin)
  @Query(() => User, { name: "user" })
  findOne(@Args("id", { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }
}
