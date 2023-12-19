import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtPayload, JwtPayloadWithRefreshToken } from "src/auth/types";

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | keyof JwtPayloadWithRefreshToken,
    context: ExecutionContext,
  ) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!data) return request.user;

    return request.user[data];
  },
);
