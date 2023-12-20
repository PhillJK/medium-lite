import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostInput } from "./dto/create-post-input";
import { Post } from "./entities/post.entity";
import { GetPostsResponse } from "./dto/get-posts-response";
import { UtilsService } from "src/utils/utils.service";

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async createPost(
    createPostInput: CreatePostInput,
    userId: string,
  ): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        authorId: userId,
        title: createPostInput.title,
        content: createPostInput.content,
      },
    });

    return post;
  }

  async getPosts(
    cursor: string | null,
    limit: number,
  ): Promise<GetPostsResponse> {
    const query: Parameters<typeof this.prisma.post.findMany>[0] = {
      take: limit,
      orderBy: {
        id: "asc",
      },
    };

    if (cursor) {
      query.skip = 1;
      query.cursor = {
        id: cursor,
      };
    }

    const posts = await this.prisma.post.findMany(query);

    if (!posts.length) {
      return {
        nextCursor: null,
        posts: [],
      };
    }

    const nextCursor = posts.length < limit ? null : posts[posts.length - 1].id;

    return {
      nextCursor,
      posts,
    };
  }

  async getPostById(postId: string, userId: string): Promise<Post | null> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId },
      select: {
        id: true,
        authorId: true,
        title: true,
        content: true,
        publishedAt: true,
        updatedAt: true,
        viewers: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (post && !post.viewers.some((views) => views.userId === userId)) {
      await this.prisma.userViewedPosts.create({
        data: {
          userId,
          postId: postId,
        },
      });
    }

    if (post) {
      return this.utils.exclude(post, "viewers");
    }

    return null;
  }
}
