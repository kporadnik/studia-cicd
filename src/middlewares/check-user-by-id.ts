import { DynamoService } from "@/services";
import { MiddlewareObj } from "@middy/core";

const environment = {
  USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
};

export function CheckUserByIdMiddleware(): MiddlewareObj {
  return {
    before: async (request) => {
      const { USERS_TABLE_NAME } = environment;
      const pathParams = (request.event as any)?.pathParameters;
      const userId = pathParams?.userId;

      if (!userId) {
        throw new Error("User ID is required");
      }

      try {
        const result = await DynamoService.get(
          USERS_TABLE_NAME,
          "userId",
          userId
        );

        if (!result) {
          throw new Error(`User not found`);
        }
      } catch (error: any) {
        throw new Error(
          `Error retrieving user with ID ${userId}: ${error.message}`
        );
      }
    },
  };
}
