// store/user-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  image?: string | null;
  role?: string;
  phoneNumber?: string;
};

type UserState = {
  user: User | null;
};

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      // Normalize _id to id if needed
      const userData = {
        ...action.payload,
        id: action.payload.id || action.payload._id,
      };
      state.user = userData;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
