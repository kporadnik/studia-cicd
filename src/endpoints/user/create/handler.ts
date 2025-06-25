import { CreateLambdaResponse } from "@/utils";
import { APIGatewayEvent, Context } from "aws-lambda";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME,
};

export async function handler(event: APIGatewayEvent, ctx: Context) {
  const { USERS_TABLE_NAME } = environment;

  console.log({
    environment,
    method: event.httpMethod,
    body: event.body,
  });

  return CreateLambdaResponse(200, {
    message: "Create",
  });
}
