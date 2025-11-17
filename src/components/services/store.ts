import { configureStore } from "@reduxjs/toolkit";
import { peopleApi } from "./peopleApi";
import imageCacheReducer from "./imageCacheSlice"; // import your slice

export const store = configureStore({
  reducer: {
    [peopleApi.reducerPath]: peopleApi.reducer,
    imageCache: imageCacheReducer, // add the image cache slice
  },
  middleware: (getDefault) => getDefault().concat(peopleApi.middleware),
});

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
