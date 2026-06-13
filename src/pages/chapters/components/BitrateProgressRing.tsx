import type { BitrateTranscodingState } from '../../../types/streaming';
import '../../../styles/pages/chapters/components/BitrateProgressRing.css';

interface BitrateProgressRingProps {
  bitrate: number;
  progress: number;
  status: BitrateTranscodingState;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const RING_SIZE = 48;
const STROKE_WIDTH = 4;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getRingVariant(status: BitrateTranscodingState): string {
  if (status === 'completed') {
    return 'completed';
  }
  if (status === 'failed') {
    return 'failed';
  }
  return 'in-progress';
}

function BitrateProgressRing({
  bitrate,
  progress,
  status,
  onRetry,
  isRetrying = false,
}: BitrateProgressRingProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const dashOffset = CIRCUMFERENCE * (1 - clampedProgress / 100);
  const variant = getRingVariant(status);
  const isFailed = status === 'failed';

  return (
    <div
      className={`bitrate-progress-ring bitrate-progress-ring--${variant}`}
      aria-label={`${bitrate}k transcoding ${isFailed ? 'failed' : `${clampedProgress}%`}`}
    >
      <div className="bitrate-progress-ring-chart">
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          role="img"
          aria-hidden="true"
        >
          <circle
            className="bitrate-progress-ring-track"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            className="bitrate-progress-ring-fill"
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isFailed ? 0 : dashOffset}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
          />
        </svg>
        {isFailed && onRetry ? (
          <button
            type="button"
            className="bitrate-progress-ring-center-retry"
            disabled={isRetrying}
            onClick={onRetry}
            aria-label={`Retry ${bitrate}k transcoding`}
          >
            {isRetrying ? '…' : 'Retry'}
          </button>
        ) : (
          <span className="bitrate-progress-ring-value">{clampedProgress}%</span>
        )}
      </div>
      <span className="bitrate-progress-ring-label">{bitrate}k</span>
    </div>
  );
}

export default BitrateProgressRing;
