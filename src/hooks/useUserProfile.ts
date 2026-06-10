import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { setUser } from '../store/slices/authSlice';
import { getUserProfile } from '../utils/partnerApi';
import { mapProfileToAuthUser } from '../utils/userProfileAuth';

export function useUserProfile() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);
  const userRef = useRef(user);

  userRef.current = user;

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (!cancelled) {
          dispatch(
            setUser(mapProfileToAuthUser(profile, userRef.current))
          );
        }
      } catch {
        // Keep existing auth user data if profile fetch fails
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated]);
}
