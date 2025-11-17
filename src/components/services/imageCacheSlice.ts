import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ImageCacheState {
  [personName: string]: string;
}

const initialState: ImageCacheState = {};

export const imageCacheSlice = createSlice({
  name: "imageCache",
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<{ [name: string]: string }>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setImages } = imageCacheSlice.actions;
export default imageCacheSlice.reducer;
