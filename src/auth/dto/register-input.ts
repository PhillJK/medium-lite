import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  @MinLength(1)
  name: string;
}
