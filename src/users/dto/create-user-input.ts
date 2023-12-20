import { InputType, Field } from "@nestjs/graphql";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { Role } from "src/auth/types";

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @Field()
  role: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Field()
  password: string;
}
