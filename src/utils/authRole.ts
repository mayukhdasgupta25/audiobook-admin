import type { LoginResponse, RefreshResponse, UserRole } from '../types/auth';

type AuthRoleSource = Pick<LoginResponse | RefreshResponse, 'role' | 'user'>;

const VALID_ROLES: UserRole[] = [
  'LISTENER',
  'GLOBAL_ADMIN',
  'ORG_ADMIN',
  'ORG_COORDINATOR',
  'AUTHOR',
];

function normalizeUserRole(value: string | undefined): UserRole | null {
  if (!value) {
    return null;
  }

  const upperValue = value.toUpperCase() as UserRole;
  return VALID_ROLES.includes(upperValue) ? upperValue : null;
}

/**
 * Extracts the user role from a login or refresh response.
 */
export function getUserRoleFromAuthResponse(
  response: AuthRoleSource
): UserRole | null {
  return (
    normalizeUserRole(response.role) ?? normalizeUserRole(response.user?.role)
  );
}

export function isOrgStaffRole(role: UserRole | null): boolean {
  return role === 'ORG_ADMIN' || role === 'ORG_COORDINATOR';
}
