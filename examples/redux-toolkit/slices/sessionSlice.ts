import { createSlice } from "@reduxjs/toolkit";
import type { AppUser, Credentials, AppUserProfilePicture } from "@/common/lib/types";

export type AppSessionType = {
  isAuthorized: boolean;
  credentials: Credentials | null;
  user: AppUser | null;
  avatar: AppUserProfilePicture | null;
};

const initialState: AppSessionType = {
  isAuthorized: false,
  credentials: null,
  user: null,
  avatar: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.isAuthorized = action.payload.isAuthorized;
      state.credentials = action.payload.credentials;
      state.user = action.payload.user;
      state.avatar = action.payload.avatar;
    },
    clearSession: (state) => {
      state.isAuthorized = false;
      state.credentials = null;
      state.user = null;
      state.avatar = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setSessionCredentials: (state, action) => {
      state.credentials = action.payload;
    },
  },
});

export const { setSession, clearSession, updateUser, setSessionCredentials } = sessionSlice.actions;
export default sessionSlice.reducer;
