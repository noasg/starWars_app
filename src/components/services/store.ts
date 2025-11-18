import { configureStore } from "@reduxjs/toolkit";
import { peopleApi } from "./peopleApi";
import imageCacheReducer from "./imageCacheSlice";
import authReducer from "./authSlice";
import { authApi } from "./authApi";

export const store = configureStore({
  reducer: {
    [peopleApi.reducerPath]: peopleApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    imageCache: imageCacheReducer,
  },
  middleware: (getDefault) => getDefault().concat(peopleApi.middleware),
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
