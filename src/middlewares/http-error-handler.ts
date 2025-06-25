import { MiddlewareObj } from "@middy/core";

export function HttpErrorHandlerMiddleware(): MiddlewareObj {
  return {
    onError: async (request) => {
      console.error("Lambda failed with error:", request.error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          message: request.error?.message || "Internal server error",
        }),
      };
    },
  };
}
