/**
 * Transcoding slice for chapter stream progress
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChapterTranscodingStatus } from '../../types/streaming';

interface TranscodingState {
  statusByChapterId: Record<string, ChapterTranscodingStatus>;
  connected: boolean;
  refreshChapterIds: string[];
}

const initialState: TranscodingState = {
  statusByChapterId: {},
  connected: true,
  refreshChapterIds: [],
};

const transcodingSlice = createSlice({
  name: 'transcoding',
  initialState,
  reducers: {
    mergeChapterTranscodingStatuses: (
      state,
      action: PayloadAction<ChapterTranscodingStatus[]>
    ) => {
      for (const status of action.payload) {
        state.statusByChapterId[status.chapterId] = status;
      }
    },
    setTranscodingConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    markBitrateRetrying: (
      state,
      action: PayloadAction<{ chapterId: string; bitrate: number }>
    ) => {
      const { chapterId, bitrate } = action.payload;
      const current = state.statusByChapterId[chapterId];

      if (!current) {
        state.statusByChapterId[chapterId] = {
          chapterId,
          canStream: false,
          masterPlaylistReady: false,
          aggregateStatus: 'processing',
          bitrates: [{ bitrate, status: 'pending', progress: 0 }],
        };
        return;
      }

      const hasBitrate = current.bitrates.some(row => row.bitrate === bitrate);
      const bitrates = hasBitrate
        ? current.bitrates.map(row =>
            row.bitrate === bitrate
              ? {
                  ...row,
                  status: 'pending' as const,
                  progress: 0,
                  errorMessage: undefined,
                }
              : row
          )
        : [...current.bitrates, { bitrate, status: 'pending' as const, progress: 0 }];

      state.statusByChapterId[chapterId] = {
        ...current,
        aggregateStatus: 'processing',
        bitrates,
      };
    },
    clearTranscodingForChapter: (state, action: PayloadAction<string>) => {
      delete state.statusByChapterId[action.payload];
    },
    queueChapterTranscodingRefresh: (state, action: PayloadAction<string>) => {
      if (!state.refreshChapterIds.includes(action.payload)) {
        state.refreshChapterIds.push(action.payload);
      }
    },
    clearChapterTranscodingRefreshQueue: state => {
      state.refreshChapterIds = [];
    },
  },
});

export const {
  mergeChapterTranscodingStatuses,
  setTranscodingConnected,
  markBitrateRetrying,
  clearTranscodingForChapter,
  queueChapterTranscodingRefresh,
  clearChapterTranscodingRefreshQueue,
} = transcodingSlice.actions;

type TranscodingRootState = { transcoding: TranscodingState };

export const selectTranscodingStatusByChapter = (state: TranscodingRootState) =>
  state.transcoding.statusByChapterId;

export const selectTranscodingConnected = (state: TranscodingRootState) =>
  state.transcoding.connected;

export const selectRefreshChapterIds = (state: TranscodingRootState) =>
  state.transcoding.refreshChapterIds;

export default transcodingSlice.reducer;
