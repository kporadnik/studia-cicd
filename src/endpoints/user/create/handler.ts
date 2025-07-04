import middy from "@middy/core";
import {
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { UsersService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import { v4 as uuid } from "uuid";
import { TUserCreateInput } from "@/types/users";

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = {
    USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
  };
  const body = event.body as TUserCreateInput;

  if (!body.first_name || !body.last_name || !body.email) {
    throw new Error("Missing required fields");
  }

  const userId = uuid();

  const user = await UsersService.createUser(USERS_TABLE_NAME, userId, {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
  });

  return CreateLambdaResponse(200, {
    user,
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(HttpErrorHandlerMiddleware());
