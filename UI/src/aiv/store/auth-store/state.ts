export interface UserStoreState {
  loggedIn: boolean;
  username: string | undefined;
  userId: string | undefined;
}

export const initialState: UserStoreState = {
  loggedIn: false,
  username: undefined,
  userId: undefined,
};
