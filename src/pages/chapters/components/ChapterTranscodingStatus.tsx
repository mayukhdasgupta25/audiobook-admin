import React, { useState } from 'react';
import type { ChapterTranscodingStatus } from '../../../types/streaming';
import { useAppDispatch } from '../../../hooks/redux';
import {
  markBitrateRetrying,
  queueChapterTranscodingRefresh,
} from '../../../store/slices/transcodingSlice';
import {
  getBitrateRow,
  retryChapterTranscoding,
  TARGET_BITRATES,
} from '../../../utils/streamingApi';
import { showApiError } from '../../../utils/toast';
import BitrateProgressRing from './BitrateProgressRing';
import '../../../styles/pages/chapters/components/ChapterTranscodingStatus.css';

interface ChapterTranscodingStatusProps {
  chapterId: string;
  status?: ChapterTranscodingStatus;
}

const ChapterTranscodingStatus: React.FC<ChapterTranscodingStatusProps> = ({
  chapterId,
  status,
}) => {
  const dispatch = useAppDispatch();
  const [retryingBitrate, setRetryingBitrate] = useState<number | null>(null);

  const handleRetry = async (bitrate: number): Promise<void> => {
    try {
      setRetryingBitrate(bitrate);
      await retryChapterTranscoding(chapterId, [bitrate]);
      dispatch(markBitrateRetrying({ chapterId, bitrate }));
      dispatch(queueChapterTranscodingRefresh(chapterId));
    } catch (error) {
      showApiError(error);
    } finally {
      setRetryingBitrate(null);
    }
  };

  return (
    <div
      className="chapter-transcoding-status"
      aria-label="Stream transcoding status"
    >
      {TARGET_BITRATES.map(bitrate => {
        const row = getBitrateRow(status, bitrate);
        return (
          <BitrateProgressRing
            key={bitrate}
            bitrate={bitrate}
            progress={row.progress}
            status={row.status}
            isRetrying={retryingBitrate === bitrate}
            onRetry={
              row.status === 'failed'
                ? () => void handleRetry(bitrate)
                : undefined
            }
          />
        );
      })}
    </div>
  );
};

export default ChapterTranscodingStatus;
