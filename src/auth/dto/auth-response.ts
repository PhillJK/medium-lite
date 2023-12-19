import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class AuthResponseWithUser extends AuthResponse {
  @Field(() => User)
  user: User;
}
