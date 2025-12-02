/**
 * Genres slice for Redux
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getGenres, createGenre, updateGenre, deleteGenre, type GenreItem } from '../../utils/audiobookApi';

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

export const createGenreThunk = createAsyncThunk(
   'genres/createGenre',
   async (name: string, { rejectWithValue }) => {
      try {
         const genre = await createGenre(name);
         return genre;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const updateGenreThunk = createAsyncThunk(
   'genres/updateGenre',
   async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
      try {
         const genre = await updateGenre(id, name);
         return genre;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

export const deleteGenreThunk = createAsyncThunk(
   'genres/deleteGenre',
   async (id: string, { rejectWithValue }) => {
      try {
         await deleteGenre(id);
         return id;
      } catch (error) {
         return rejectWithValue(error);
      }
   }
);

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
         })
         .addCase(createGenreThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(createGenreThunk.fulfilled, (state, action: PayloadAction<GenreItem>) => {
            state.loading = false;
            state.genres.push(action.payload);
         })
         .addCase(createGenreThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to create genre';
         })
         .addCase(updateGenreThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(updateGenreThunk.fulfilled, (state, action: PayloadAction<GenreItem>) => {
            state.loading = false;
            const index = state.genres.findIndex((g) => g.id === action.payload.id);
            if (index !== -1) {
               state.genres[index] = action.payload;
            }
         })
         .addCase(updateGenreThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to update genre';
         })
         .addCase(deleteGenreThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
         })
         .addCase(deleteGenreThunk.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.genres = state.genres.filter((g) => g.id !== action.payload);
         })
         .addCase(deleteGenreThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload ? String(action.payload) : 'Failed to delete genre';
         });
   },
});

export const { clearGenres } = genresSlice.actions;
export default genresSlice.reducer;

