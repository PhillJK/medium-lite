import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsString, Max, Min, ValidateIf } from "class-validator";

@ArgsType()
export class GetPostsArgs {
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @Field(() => String, { nullable: true })
  cursor: string | null;

  @IsNumber()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;
}
