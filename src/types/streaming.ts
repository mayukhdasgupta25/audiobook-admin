export type BitrateTranscodingState = 'pending' | 'processing' | 'completed' | 'failed';

export type AggregateTranscodingStatus =
  | 'not_started'
  | 'processing'
  | 'completed'
  | 'partial'
  | 'failed';

export interface BitrateTranscodingStatus {
  bitrate: number;
  status: BitrateTranscodingState;
  progress: number;
  errorMessage?: string;
}

export interface ChapterTranscodingStatus {
  chapterId: string;
  canStream: boolean;
  masterPlaylistReady: boolean;
  aggregateStatus: AggregateTranscodingStatus;
  bitrates: BitrateTranscodingStatus[];
}

export interface TranscodingEvent {
  chapterId: string;
  bitrate: number;
  status: BitrateTranscodingState;
  progress: number;
  errorMessage?: string;
  timestamp: string;
}

export interface TranscodingSnapshotEvent {
  chapterId: string;
  bitrates: BitrateTranscodingStatus[];
  timestamp: string;
}

export type StreamBadgeStatus = 'Processing' | 'Ready' | 'Partial' | 'Failed' | 'Unknown';
