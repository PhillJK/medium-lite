import { ObjectType, Field } from "@nestjs/graphql";
import { Post } from "../entities/post.entity";

@ObjectType()
export class GetPostsResponse {
  @Field(() => String, { nullable: true })
  nextCursor: string | null;

  @Field(() => [Post])
  posts: Array<Post>;
}
