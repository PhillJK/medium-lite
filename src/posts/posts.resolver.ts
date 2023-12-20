import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { PostsService } from "./posts.service";
import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post-input";
import { GetCurrentUser } from "src/utils/decorators/get-current-user.decorator";
import { GetPostsArgs } from "./dto/get-posts-args";
import { GetPostsResponse } from "./dto/get-posts-response";

@Resolver()
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  async createPost(
    @Args("createPostInput") createPostInput: CreatePostInput,
    @GetCurrentUser("id") userId: string,
  ): Promise<Post> {
    return await this.postsService.createPost(createPostInput, userId);
  }

  @Query(() => Post, { name: "post", nullable: true })
  async getPostById(
    @Args("id", { type: () => String }) id: string,
    @GetCurrentUser("id") userId: string,
  ): Promise<Post | null> {
    return await this.postsService.getPostById(id, userId);
  }

  @Query(() => GetPostsResponse, { name: "posts" })
  async getPosts(
    @Args() { cursor, limit }: GetPostsArgs,
  ): Promise<GetPostsResponse> {
    return await this.postsService.getPosts(cursor, limit);
  }
}
