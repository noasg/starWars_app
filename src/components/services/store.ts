// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "./authApi";
import { peopleApi } from "./peopleApi";
import imageCacheReducer from "./imageCacheSlice";

export const store = configureStore({
  reducer: {
    [peopleApi.reducerPath]: peopleApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    imageCache: imageCacheReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(peopleApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
