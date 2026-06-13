import type { LoginAppType, UserRole } from '../types/auth';
import type { AudioBookOwnerInput } from '../types/audiobook';
import { getOrganizations } from './audiobookApi';
import { isOrgStaffRole } from './authRole';
import { getMyAuthorProfile } from './partnerApi';

/**
 * Resolves audiobook owner from the authenticated user's role and workspace context.
 */
export async function resolveAudiobookOwner(
  role: UserRole | null,
  appType: LoginAppType | null
): Promise<AudioBookOwnerInput | null> {
  if (appType === 'author' || role === 'AUTHOR') {
    const author = await getMyAuthorProfile();
    return { type: 'AUTHOR', id: author.id };
  }

  if (isOrgStaffRole(role)) {
    const memberships = await getOrganizations();
    const organization = memberships[0]?.organization;
    if (organization) {
      return { type: 'ORGANIZATION', id: organization.id };
    }
  }

  return null;
}
