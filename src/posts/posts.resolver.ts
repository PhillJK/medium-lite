import { Int, Resolver, Query } from "@nestjs/graphql";
import { PostsService } from "./posts.service";

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => Int)
  async getPosts() {
    return 1;
  }
}
