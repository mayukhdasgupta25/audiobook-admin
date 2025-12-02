/**
 * Tags slice for Redux
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTags, createTag, updateTag, deleteTag, type TagItem } from '../../utils/audiobookApi';

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

export const createTagThunk = createAsyncThunk(
   'tags/createTag',
   async ({ name, type }: { name: string; type?: string }, { rejectWithValue }) => {
      try {
         const tag = await createTag(name, type);
         return tag;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const updateTagThunk = createAsyncThunk(
   'tags/updateTag',
   async ({ id, name, type }: { id: string; name: string; type?: string }, { rejectWithValue }) => {
      try {
         const tag = await updateTag(id, name, type);
         return tag;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const deleteTagThunk = createAsyncThunk(
   'tags/deleteTag',
   async (id: string, { rejectWithValue }) => {
      try {
         await deleteTag(id);
         return id;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

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
         })
         .addCase(createTagThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(createTagThunk.fulfilled, (state, action: PayloadAction<TagItem>) => {
            state.loading = false;
            state.tags.push(action.payload);
         })
         .addCase(createTagThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to create tag';
         })
         .addCase(updateTagThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(updateTagThunk.fulfilled, (state, action: PayloadAction<TagItem>) => {
            state.loading = false;
            const index = state.tags.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
               state.tags[index] = action.payload;
            }
         })
         .addCase(updateTagThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to update tag';
         })
         .addCase(deleteTagThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(deleteTagThunk.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.tags = state.tags.filter((t) => t.id !== action.payload);
         })
         .addCase(deleteTagThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to delete tag';
         });
   },
});

export const { clearTags } = tagsSlice.actions;
export default tagsSlice.reducer;

