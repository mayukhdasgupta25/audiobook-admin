import type { UserProfile } from '../types/partner';
import type { AuthUser } from '../store/slices/authSlice';

export function mapProfileToAuthUser(
  profile: UserProfile,
  current: AuthUser | null
): AuthUser {
  const name =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    current?.name;

  const avatarUrl =
    profile.avatarUrl ?? profile.avatar ?? current?.avatarUrl;

  return {
    email: profile.email ?? current?.email,
    name,
    avatarUrl,
  };
}
