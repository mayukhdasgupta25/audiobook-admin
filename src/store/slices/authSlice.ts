/**
 * Authentication slice for Redux
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserRole } from '../../types/auth';

interface AuthState {
   isAuthenticated: boolean;
   isInitialized: boolean;
   role: UserRole | null;
   user: {
      email?: string;
      name?: string;
   } | null;
}

const initialState: AuthState = {
   isAuthenticated: false,
   isInitialized: false,
   role: null,
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
            state.role = null;
         }
      },
      setAuthInitialized: (state, action: PayloadAction<boolean>) => {
         state.isInitialized = action.payload;
      },
      setUserRole: (state, action: PayloadAction<UserRole | null>) => {
         state.role = action.payload;
      },
      setUser: (state, action: PayloadAction<AuthState['user']>) => {
         state.user = action.payload;
         if (action.payload) {
            state.isAuthenticated = true;
         }
      },
      logout: (state) => {
         state.isAuthenticated = false;
         state.role = null;
         state.user = null;
      },
   },
});

export const { setAuthenticated, setAuthInitialized, setUserRole, setUser, logout } =
   authSlice.actions;
export default authSlice.reducer;
