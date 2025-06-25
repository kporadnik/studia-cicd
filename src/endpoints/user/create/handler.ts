import {
  HttpErrorHandlerMiddleware,
  JsonBodyParserMiddleware,
} from "@/middlewares";
import { DynamoService } from "@/services";
import { TLambdaContext, TLambdaEvent } from "@/types";
import { CreateLambdaResponse } from "@/utils";
import middy from "@middy/core";
import { v4 as uuid } from "uuid";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
};

async function lambda(event: TLambdaEvent, ctx: TLambdaContext) {
  const { USERS_TABLE_NAME } = environment;
  const { body } = event;

  if (!body.firstName || !body.lastName || !body.email) {
    throw new Error("Missing required fields");
  }

  const user = await DynamoService.create(USERS_TABLE_NAME, {
    userId: {
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
    user,
  });
}

export const handler = middy(lambda)
  .use(JsonBodyParserMiddleware())
  .use(HttpErrorHandlerMiddleware());
