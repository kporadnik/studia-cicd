import { TUserUpdateInput } from "@/types/users";

export function PrepareUpdateUserData(body: TUserUpdateInput) {
  let updatePayload = {};

  if (body.first_name) {
    updatePayload = {
      ...updatePayload,
      first_name: {
        S: body.first_name,
      },
    };
  }

  if (body.last_name) {
    updatePayload = {
      ...updatePayload,
      last_name: {
        S: body.last_name,
      },
    };
  }

  if (body.email) {
    updatePayload = {
      ...updatePayload,
      email: {
        S: body.email,
      },
    };
  }

  return updatePayload;
}
