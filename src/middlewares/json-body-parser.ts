import { CreateLambdaResponse } from "@/utils";
import { MiddlewareObj } from "@middy/core";
import { APIGatewayProxyEvent } from "aws-lambda";

export function JsonBodyParserMiddleware(): MiddlewareObj<APIGatewayProxyEvent> {
  const middleware: MiddlewareObj<APIGatewayProxyEvent> = {
    before: (request) => {
      const { event } = request;

      try {
        if (event.body && typeof event.body === "string") {
          event.body = JSON.parse(event.body);
        }
      } catch (err) {
        return CreateLambdaResponse(400, {
          message: "Invalid JSON body",
        });
      }
    },
  };

  return middleware;
}
