import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsResolver } from "./posts.resolver";
import { UtilsService } from "src/utils/utils.service";

@Module({
  providers: [PostsResolver, PostsService, UtilsService],
})
export class PostsModule {}
