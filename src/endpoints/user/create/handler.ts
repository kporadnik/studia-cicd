import middy from "@middy/core";
import {
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import { v4 as uuid } from "uuid";

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = {
    USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
  };
  const { body } = event;

  if (!body.firstName || !body.lastName || !body.email) {
    throw new Error("Missing required fields");
  }

  await DynamoService.create(USERS_TABLE_NAME, {
    user_id: {
      S: uuid(),
    },
    first_name: {
      S: body.firstName,
    },
    last_name: {
      S: body.lastName,
    },
    email: {
      S: body.email,
    },
    created_at: {
      S: new Date().toISOString(),
    },
  });

  return CreateLambdaResponse(200, {
    message: "User has been created successfully",
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(HttpErrorHandlerMiddleware());
