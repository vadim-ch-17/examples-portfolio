import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appearanceSlice from "@/store/slices/appearanceSlice";
import initialDataReducer from "@/store/slices/initialDataSlice";
import clientDataReducer from "@/store/slices/clientDataSlice";
import sessionReducer from "@/store/slices/sessionSlice";
import registrationReducer from "@/store/slices/registrationSlice";
import routingReducer from "@/store/slices/routingSlice";
import dashboardReducer from "@/store/slices/dashboardSlice";
import { Reducer } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  appearance: appearanceSlice,
  initial: initialDataReducer,
  client: clientDataReducer,
  session: sessionReducer,
  registration: registrationReducer,
  routing: routingReducer,
  dashboard: dashboardReducer,
});

let store: ReturnType<typeof configureStore> | undefined;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  if (!store) {
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    });

    // Enable HMR for reducers
    if (process.env.NODE_ENV === "development" && module.hot) {
      module.hot.accept("./index", () => {
        store?.replaceReducer(rootReducer as Reducer);
      });
    }
  }

  return store;
};

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
