import { ObjectType, Field, Int } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class GetUsersResponse {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Int)
  nextPage: number;
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalNumberOfUsers: number;

  @Field(() => [User])
  users: Array<User>;
}
