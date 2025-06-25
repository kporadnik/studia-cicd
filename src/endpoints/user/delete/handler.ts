import {
  CheckUserByIdMiddleware,
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import middy from "@middy/core";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
};

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = environment;
  const userId = event.pathParameters?.userId!;

  await DynamoService.remove(USERS_TABLE_NAME, userId);

  return CreateLambdaResponse(200, {
    message: "User has been deleted successfully",
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(CheckUserByIdMiddleware())
  .use(HttpErrorHandlerMiddleware());
