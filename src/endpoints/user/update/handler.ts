import {
  CheckUserByIdMiddleware,
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse, PrepareUpdateUserData } from "@/utils";
import middy from "@middy/core";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
};

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = environment;
  const { body } = event;
  const userId = event.pathParameters?.userId!;
  const updateData = PrepareUpdateUserData(body);

  await DynamoService.update(USERS_TABLE_NAME, userId, updateData);
  const user = await DynamoService.get(USERS_TABLE_NAME, "userId", userId);

  return CreateLambdaResponse(200, {
    user,
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(CheckUserByIdMiddleware())
  .use(HttpErrorHandlerMiddleware());
