import { JsonBodyParserMiddleware } from "@/middlewares/json-body-parser";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import middy from "@middy/core";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME,
};

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  console.log({
    environment,
    method: event.httpMethod,
    body: event.body,
    userId: event.pathParameters?.userId,
  });

  return CreateLambdaResponse(200, {
    message: "Update",
  });
}

export const handler = middy(lambda).use(JsonBodyParserMiddleware());
