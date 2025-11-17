import { configureStore } from "@reduxjs/toolkit";
import { peopleApi } from "./peopleApi";

export const store = configureStore({
  reducer: {
    [peopleApi.reducerPath]: peopleApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(peopleApi.middleware),
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
