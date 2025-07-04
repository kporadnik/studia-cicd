import { TUser, TUserCreateInput } from "@/types/users";
import * as DynamoService from "./dynamodb";

export async function retrieveUser(tableName: string, userId: string) {
  return await DynamoService.get(tableName, "user_id", userId);
}

export async function isUserExistsById(tableName: string, userId: string) {
  const user = await DynamoService.get(tableName, "user_id", userId);

  if (!user) {
    throw new Error(`User with ID ${userId} does not exist`);
  }

  return user;
}

export async function isUserExistsByEmail(tableName: string, email: string) {
  const user = await DynamoService.query<TUser[]>(
    tableName,
    "email-index",
    "email",
    email
  );

  if ((user ?? []).length > 0) {
    throw new Error(`User with email ${email} already exists`);
  }

  return user;
}

export async function createUser(
  tableName: string,
  userId: string,
  userData: TUserCreateInput
) {
  await isUserExistsByEmail(tableName, userData.email);

  return await DynamoService.create<TUser>(tableName, {
    user_id: { S: userId },
    first_name: { S: userData.first_name },
    last_name: { S: userData.last_name },
    email: { S: userData.email },
    created_at: { S: new Date().toISOString() },
  });
}

export async function updateUser<T extends Record<string, unknown>>(
  tableName: string,
  userId: string,
  updateData: T
) {
  await DynamoService.update(tableName, "user_id", userId, updateData);
  const user = await DynamoService.get(tableName, "user_id", userId);

  return user;
}

export async function deleteUser(tableName: string, userId: string) {
  await isUserExistsById(tableName, userId);
  const result = await DynamoService.remove(tableName, "user_id", userId);
  const attributes = result?.Attributes;

  if (!attributes) {
    throw new Error(`Could not delete user with ID ${userId}`);
  }

  return true;
}
