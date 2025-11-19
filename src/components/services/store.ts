import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "./authApi";
import { peopleApi } from "./peopleApi";
import imageCacheReducer from "./imageCacheSlice";
import { protectedApi } from "./protectedApi";

//Redux store configuration
// Combines reducers and applies middleware for RTK Query APIs
export const store = configureStore({
  reducer: {
    // RTK Query reducers for caching API responses
    [peopleApi.reducerPath]: peopleApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [protectedApi.reducerPath]: protectedApi.reducer,

    // Local slices
    auth: authReducer,
    imageCache: imageCacheReducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      // Include RTK Query middleware for each API slice
      peopleApi.middleware,
      authApi.middleware,
      protectedApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
