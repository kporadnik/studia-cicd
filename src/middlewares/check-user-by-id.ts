import { UsersService } from "@/services";
import { MiddlewareObj } from "@middy/core";

export function CheckUserByIdMiddleware(): MiddlewareObj {
  return {
    before: async (request) => {
      const { USERS_TABLE_NAME } = {
        USERS_TABLE_NAME: process.env.USERS_TABLE_NAME!,
      };
      const pathParams = (request.event as any)?.pathParameters;
      const userId = pathParams?.userId;

      if (!userId) {
        throw new Error("User ID is required");
      }

      try {
        await UsersService.isUserExistsById(USERS_TABLE_NAME, userId);
      } catch (error: any) {
        throw new Error(
          `Error retrieving user with ID ${userId}: ${error.message}`
        );
      }
    },
  };
}
