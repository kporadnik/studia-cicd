import { APIGatewayEvent, Context } from "aws-lambda";
import { CreateLambdaResponse } from "../../../utils";

export function handler(event: APIGatewayEvent, ctx: Context) {
  return CreateLambdaResponse(200, {
    message: "Create",
  });
}
