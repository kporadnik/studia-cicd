import { CreateLambdaResponse } from "@/utils";
import { APIGatewayEvent, Context } from "aws-lambda";

export function handler(event: APIGatewayEvent, ctx: Context) {
  return CreateLambdaResponse(200, {
    message: "Retrieve",
  });
}
