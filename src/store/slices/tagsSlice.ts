/**
 * Tags slice for Redux
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTags, type TagItem } from '../../utils/audiobookApi';

interface TagsState {
   tags: TagItem[];
   loading: boolean;
   error: string | null;
}

const initialState: TagsState = {
   tags: [],
   loading: false,
   error: null,
};

export const fetchTags = createAsyncThunk('tags/fetchTags', async (_, { rejectWithValue }) => {
   try {
      const tags = await getTags();
      return tags;
   } catch (error) {
      return rejectWithValue(error);
   }
});

const tagsSlice = createSlice({
   name: 'tags',
   initialState,
   reducers: {
      clearTags: (state) => {
         state.tags = [];
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchTags.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchTags.fulfilled, (state, action: PayloadAction<TagItem[]>) => {
            state.loading = false;
            state.tags = action.payload;
         })
         .addCase(fetchTags.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to fetch tags';
         });
   },
});

export const { clearTags } = tagsSlice.actions;
export default tagsSlice.reducer;

