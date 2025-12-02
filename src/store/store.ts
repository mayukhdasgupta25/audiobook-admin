/**
 * Redux store configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import audiobooksReducer from './slices/audiobooksSlice';
import chaptersReducer from './slices/chaptersSlice';
import genresReducer from './slices/genresSlice';
import tagsReducer from './slices/tagsSlice';
import authorsReducer from './slices/authorsSlice';

export const store = configureStore({
   reducer: {
      auth: authReducer,
      audiobooks: audiobooksReducer,
      chapters: chaptersReducer,
      genres: genresReducer,
      tags: tagsReducer,
      authors: authorsReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

