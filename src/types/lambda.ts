import { APIGatewayEvent, Context } from "aws-lambda";

export type TLambdaEvent = Omit<APIGatewayEvent, "body"> & {
  body: Record<string, any>;
};
export type TLambdaContext = Context;
