import { createSlice } from "@reduxjs/toolkit";

export type AppearanceDataType = {
  isLoading: boolean;
};

const initialState: AppearanceDataType = {
  isLoading: false,
};

const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {
    setGlobalLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = appearanceSlice.actions;
export default appearanceSlice.reducer;
