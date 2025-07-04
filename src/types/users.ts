export type TUser = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type TUserCreateInput = Omit<TUser, "user_id">;
export type TUserUpdateInput = Partial<TUserCreateInput>;
