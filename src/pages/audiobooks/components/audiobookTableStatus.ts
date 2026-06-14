import type { AudiobookApiResponse } from '../../../types/audiobook';
import type { AudiobookFilter } from '../../../store/slices/audiobooksSlice';

export function getStatus(
  filter: AudiobookFilter,
  audiobook: AudiobookApiResponse
) {
  if (filter === 'scheduled') {
    return { label: 'Scheduled', variant: 'scheduled' as const };
  }
  if (filter === 'drafts') {
    return { label: 'Draft', variant: 'draft' as const };
  }
  if (filter === 'live' || audiobook.isActive === true) {
    return { label: 'Live', variant: 'live' as const };
  }
  if (audiobook.isActive === false) {
    return { label: 'Pending', variant: 'pending' as const };
  }
  return { label: 'Live', variant: 'live' as const };
}
