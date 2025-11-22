/**
 * Auth Initializer component - syncs Redux auth state with sessionStorage on app load
 */

import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { isAuthenticated } from '../../utils/auth';
import { setAuthenticated } from '../../store/slices/authSlice';

const AuthInitializer: React.FC = () => {
   const dispatch = useAppDispatch();

   useEffect(() => {
      // Initialize Redux auth state from sessionStorage
      const authStatus = isAuthenticated();
      if (authStatus) {
         dispatch(setAuthenticated(true));
      }
   }, [dispatch]);

   return null;
};

export default AuthInitializer;

