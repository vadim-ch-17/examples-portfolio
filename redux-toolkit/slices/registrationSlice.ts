import { createSlice } from "@reduxjs/toolkit";

import type { RegistrationSteps } from "@/features/registration/lib/types";

export type RegistrationState = {
  registrationSteps: RegistrationSteps | null;
};

const initialState: RegistrationState = {
  registrationSteps: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    clearRegistrationState: (state) => {
      state.registrationSteps = null;
    },
    setRegistrationSteps: (state, action) => {
      // state.registrationSteps = JSON.parse(JSON.stringify(action.payload));
      state.registrationSteps = action.payload;
    },
  },
});

export const { clearRegistrationState, setRegistrationSteps } = registrationSlice.actions;

export default registrationSlice.reducer;
