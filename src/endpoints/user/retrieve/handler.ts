import {
  CheckUserByIdMiddleware,
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import middy from "@middy/core";

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = {
    USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
  };
  const userId = event.pathParameters?.userId!;

  const user = await DynamoService.get(USERS_TABLE_NAME, "user_id", userId);

  return CreateLambdaResponse(200, {
    user,
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(CheckUserByIdMiddleware())
  .use(HttpErrorHandlerMiddleware());
