import { Mutation, Resolver } from "@nestjs/graphql";
import { PostsService } from "./posts.service";

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Boolean)
  async getPosts() {
    return true;
  }
}
