import React, { useState } from 'react';
import type { ChapterTranscodingStatus } from '../../../types/streaming';
import { retryChapterTranscoding } from '../../../utils/streamingApi';
import Button from '../../../components/common/Button';
import '../../../styles/pages/chapters/components/ChapterTranscodingStatus.css';

interface ChapterTranscodingStatusProps {
  chapterId: string;
  status?: ChapterTranscodingStatus;
}

const ChapterTranscodingStatus: React.FC<ChapterTranscodingStatusProps> = ({
  chapterId,
  status,
}) => {
  const [retryingBitrate, setRetryingBitrate] = useState<number | null>(null);

  if (!status?.bitrates?.length) {
    return null;
  }

  const handleRetry = async (bitrate: number): Promise<void> => {
    try {
      setRetryingBitrate(bitrate);
      await retryChapterTranscoding(chapterId, [bitrate]);
    } finally {
      setRetryingBitrate(null);
    }
  };

  return (
    <div className="chapter-transcoding-status" aria-label="Stream transcoding status">
      {status.bitrates.map(row => {
        const label =
          row.status === 'pending'
            ? 'Pending'
            : row.status === 'processing'
              ? 'Transcoding: Ongoing'
              : row.status === 'completed'
                ? 'Transcoding: Completed'
                : 'Failed';

        return (
          <div key={row.bitrate} className={`chapter-transcoding-row chapter-transcoding-${row.status}`}>
            <div className="chapter-transcoding-row-header">
              <span>{row.bitrate}k — {label}</span>
              <span className="chapter-transcoding-percent">{row.progress}%</span>
            </div>
            {(row.status === 'processing' || row.status === 'pending') && (
              <div
                className="chapter-transcoding-progress-track"
                role="progressbar"
                aria-valuenow={row.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="chapter-transcoding-progress-fill"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            )}
            {row.status === 'failed' && (
              <div className="chapter-transcoding-failed-actions">
                {row.errorMessage && (
                  <span className="chapter-transcoding-error" title={row.errorMessage}>
                    {row.errorMessage}
                  </span>
                )}
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  disabled={retryingBitrate === row.bitrate}
                  onClick={() => void handleRetry(row.bitrate)}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChapterTranscodingStatus;
