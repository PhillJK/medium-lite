import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, Max, Min } from "class-validator";

@ArgsType()
export class GetUsersArgs {
  @IsNumber()
  @Min(0)
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  page: number;

  @IsNumber()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;
}
