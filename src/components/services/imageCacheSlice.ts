import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ImageCacheState
// Stores a mapping of person names to their image URLs
// Example: { "Luke Skywalker": "https://picsum.photos/seed/Luke Skywalker/150/150" }

interface ImageCacheState {
  [personName: string]: string;
}

// Initial state of the image cache
// Empty object initially; will be filled with { name: url } pairs
const initialState: ImageCacheState = {};

// Redux slice for caching images
// Helps avoid fetching the same images multiple times

export const imageCacheSlice = createSlice({
  name: "imageCache",
  initialState,
  reducers: {
    //Merges new images into the cache
    setImages: (state, action: PayloadAction<{ [name: string]: string }>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setImages } = imageCacheSlice.actions;
export default imageCacheSlice.reducer;
