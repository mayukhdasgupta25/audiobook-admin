/**
 * Authentication slice for Redux
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
   isAuthenticated: boolean;
   isInitialized: boolean;
   user: {
      email?: string;
      name?: string;
   } | null;
}

const initialState: AuthState = {
   isAuthenticated: false,
   isInitialized: false,
   user: null,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      setAuthenticated: (state, action: PayloadAction<boolean>) => {
         state.isAuthenticated = action.payload;
         if (!action.payload) {
            state.user = null;
         }
      },
      setAuthInitialized: (state, action: PayloadAction<boolean>) => {
         state.isInitialized = action.payload;
      },
      setUser: (state, action: PayloadAction<AuthState['user']>) => {
         state.user = action.payload;
         if (action.payload) {
            state.isAuthenticated = true;
         }
      },
      logout: (state) => {
         state.isAuthenticated = false;
         state.user = null;
      },
   },
});

export const { setAuthenticated, setAuthInitialized, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

