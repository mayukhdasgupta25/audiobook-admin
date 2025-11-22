/**
 * Genres slice for Redux
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getGenres, type GenreItem } from '../../utils/audiobookApi';

interface GenresState {
   genres: GenreItem[];
   loading: boolean;
   error: string | null;
}

const initialState: GenresState = {
   genres: [],
   loading: false,
   error: null,
};

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async (_, { rejectWithValue }) => {
   try {
      const genres = await getGenres();
      return genres;
   } catch (error) {
      return rejectWithValue(error);
   }
});

const genresSlice = createSlice({
   name: 'genres',
   initialState,
   reducers: {
      clearGenres: (state) => {
         state.genres = [];
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchGenres.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<GenreItem[]>) => {
            state.loading = false;
            state.genres = action.payload;
         })
         .addCase(fetchGenres.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to fetch genres';
         });
   },
});

export const { clearGenres } = genresSlice.actions;
export default genresSlice.reducer;

