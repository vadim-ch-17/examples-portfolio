import { createSlice } from "@reduxjs/toolkit";

export type DashboardStateType = {
  isSaraOpened: boolean;
  userMessage?: string;
};

const initialState: DashboardStateType = {
  isSaraOpened: false,
  userMessage: "assistance",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setIsSaraOpened: (state, action) => {
      state.isSaraOpened = action.payload;
    },
    setUserMessage: (state, action) => {
      state.userMessage = action.payload;
    },
  },
});

export const { setIsSaraOpened, setUserMessage } = dashboardSlice.actions;
export default dashboardSlice.reducer;
