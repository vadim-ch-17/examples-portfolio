import { createSlice } from "@reduxjs/toolkit";
import type { ClientConfigs, ClientAuth0Configs, ClientAccess } from "@/common/lib/types";

export type ClientDataType = {
  id: string | null;
  configs: ClientConfigs | null;
  auth0Configs: ClientAuth0Configs | null;
  access: ClientAccess | null;
  benefits?: { [key: string]: any } | null;
};

const initialState: ClientDataType = {
  id: null,
  configs: null,
  auth0Configs: null,
  access: null,
  benefits: null,
};

const clientDataSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientData: (state, action) => {
      state.id = action.payload.id;
      state.configs = action.payload.configs;
      state.access = action.payload.access;
      state.auth0Configs = action.payload.auth0Configs;
    },
    setClientBenefits: (state, action) => {
      state.benefits = action.payload;
    },
  },
});

export const { setClientData, setClientBenefits } = clientDataSlice.actions;
export default clientDataSlice.reducer;
