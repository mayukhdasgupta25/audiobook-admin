import type { ChapterApiResponse } from '../../../types/audiobook';

export function getChapterStatus(chapter: ChapterApiResponse): {
  label: string;
  variant: 'live' | 'scheduled' | 'pending' | 'upload-failed';
} {
  if (chapter.sourceUploadStatus === 'failed') {
    return { label: 'Upload failed', variant: 'upload-failed' };
  }
  if (chapter.isActive === true) {
    return { label: 'Live', variant: 'live' };
  }
  if (chapter.sourceUploadStatus === 'pending') {
    return { label: 'Pending', variant: 'pending' };
  }
  if (chapter.isActive === false) {
    return { label: 'Scheduled', variant: 'scheduled' };
  }
  return { label: 'Draft', variant: 'pending' };
}
