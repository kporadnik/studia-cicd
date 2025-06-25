export function PrepareUpdateUserData(body: Record<string, any>) {
  let updatePayload = {};

  if (body.firstName) {
    updatePayload = {
      ...updatePayload,
      first_name: {
        S: body.firstName,
      },
    };
  }

  if (body.lastName) {
    updatePayload = {
      ...updatePayload,
      last_name: {
        S: body.lastName,
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
