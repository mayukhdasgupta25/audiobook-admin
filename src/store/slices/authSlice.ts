/**
 * Authentication slice for Redux
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
   isAuthenticated: boolean;
   user: {
      email?: string;
      name?: string;
   } | null;
}

const initialState: AuthState = {
   isAuthenticated: false,
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

export const { setAuthenticated, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

