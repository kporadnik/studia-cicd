import { CreateLambdaResponse } from "@/utils";
import { APIGatewayEvent, Context } from "aws-lambda";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME,
};

export async function handler(event: APIGatewayEvent, ctx: Context) {
  const { USERS_TABLE_NAME } = environment;

  if (!USERS_TABLE_NAME) {
    console.error(
      "USERS_TABLE_NAME is not defined in the environment variables."
    );
  }

  return CreateLambdaResponse(200, {
    message: "Create message",
  });
}
