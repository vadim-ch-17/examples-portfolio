import { createSlice } from "@reduxjs/toolkit";
import type { SupportedLanguage } from "@/common/lib/types";
import { getAppClientInfo } from "@/common/lib/helpers/client";

export type AppClientInfo = {
  isMobile: boolean;
  client: "web" | "ios" | "android";
  platform: "mac" | "windows" | "linux" | "android" | "ios" | "unknown";
  browser: "chrome" | "edge" | "firefox" | "safari" | "opera" | "unknown";
};

export type InitialDataType = {
  supportedLanguages: SupportedLanguage[];
  client: AppClientInfo;
};

const initialState: InitialDataType = {
  supportedLanguages: [],
  client: getAppClientInfo(),
};

const initialDataSlice = createSlice({
  name: "initial",
  initialState,
  reducers: {
    setSupportedLanguages: (state, action) => {
      state.supportedLanguages = action.payload;
    },
  },
});

export const { setSupportedLanguages } = initialDataSlice.actions;
export default initialDataSlice.reducer;
