import {
  CheckUserByIdMiddleware,
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService, UsersService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { TUserUpdateInput } from "@/types/users";
import { CreateLambdaResponse, PrepareUpdateUserData } from "@/utils";
import middy from "@middy/core";

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = {
    USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
  };
  const body = event.body as TUserUpdateInput;
  const userId = event.pathParameters?.userId!;
  const updateData = PrepareUpdateUserData(body);

  const user = await UsersService.updateUser(
    USERS_TABLE_NAME,
    userId,
    updateData
  );

  return CreateLambdaResponse(200, {
    user,
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(CheckUserByIdMiddleware())
  .use(HttpErrorHandlerMiddleware());
