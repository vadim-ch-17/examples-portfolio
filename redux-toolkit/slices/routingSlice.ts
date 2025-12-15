import { createSlice } from "@reduxjs/toolkit";

export type RoutingStateType = {
  redirectAfterLoginPath: string | null;
  auth0redirectPath: string | null;
};

const initialState: RoutingStateType = {
  redirectAfterLoginPath: null,
  auth0redirectPath: null,
};

const routingSlice = createSlice({
  name: "routing",
  initialState,
  reducers: {
    setRouting: (state, action) => {
      state.redirectAfterLoginPath = action.payload.redirectAfterLoginPath;
      state.auth0redirectPath = action.payload.auth0redirectPath;
    },
    setAuth0RedirectPath: (state, action) => {
      state.auth0redirectPath = action.payload.auth0redirectPath;
    },
    setRedirectAfterLoginPath: (state, action) => {
      state.redirectAfterLoginPath = action.payload.redirectAfterLoginPath;
    },
    clearRouting: (state) => {
      state.redirectAfterLoginPath = null;
      state.auth0redirectPath = null;
    },
  },
});

export const { setRouting, setAuth0RedirectPath, setRedirectAfterLoginPath, clearRouting } =
  routingSlice.actions;
export default routingSlice.reducer;
