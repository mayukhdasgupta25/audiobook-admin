import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import ChapterTranscodingStatus from '../src/pages/chapters/components/ChapterTranscodingStatus';

import transcodingReducer from '../src/store/slices/transcodingSlice';

import type { ChapterTranscodingStatus as Status } from '../src/types/streaming';



const { retryChapterTranscodingMock } = vi.hoisted(() => ({

  retryChapterTranscodingMock: vi.fn(),

}));



vi.mock('../src/utils/streamingApi', async importOriginal => {

  const actual =

    await importOriginal<typeof import('../src/utils/streamingApi')>();

  return {

    ...actual,

    retryChapterTranscoding: retryChapterTranscodingMock,

  };

});



function renderWithStore(ui: ReactElement) {

  const store = configureStore({

    reducer: { transcoding: transcodingReducer },

  });



  return {

    store,

    ...render(<Provider store={store}>{ui}</Provider>),

  };

}



describe('ChapterTranscodingStatus', () => {

  beforeEach(() => {

    retryChapterTranscodingMock.mockResolvedValue({ retriedBitrates: [128] });

  });



  it('renders 64k, 128k, and 256k rings with progress percentages', () => {

    const status: Status = {

      chapterId: 'ch-1',

      canStream: false,

      masterPlaylistReady: false,

      aggregateStatus: 'processing',

      bitrates: [

        { bitrate: 64, status: 'processing', progress: 20 },

        { bitrate: 128, status: 'processing', progress: 47 },

        { bitrate: 256, status: 'pending', progress: 0 },

      ],

    };



    renderWithStore(<ChapterTranscodingStatus chapterId="ch-1" status={status} />);



    expect(screen.getByLabelText('64k transcoding 20%')).toBeInTheDocument();

    expect(screen.getByLabelText('128k transcoding 47%')).toBeInTheDocument();

    expect(screen.getByLabelText('256k transcoding 0%')).toBeInTheDocument();

    expect(screen.getByText('20%')).toBeInTheDocument();

    expect(screen.getByText('47%')).toBeInTheDocument();

  });



  it('uses green ring styling for completed bitrates', () => {

    const status: Status = {

      chapterId: 'ch-1',

      canStream: true,

      masterPlaylistReady: true,

      aggregateStatus: 'completed',

      bitrates: [{ bitrate: 256, status: 'completed', progress: 100 }],

    };



    const { container } = renderWithStore(

      <ChapterTranscodingStatus chapterId="ch-1" status={status} />

    );



    expect(container.querySelector('.bitrate-progress-ring--completed')).toBeTruthy();

    expect(screen.getByText('100%')).toBeInTheDocument();

  });



  it('uses yellow ring styling for in-progress bitrates', () => {

    const status: Status = {

      chapterId: 'ch-1',

      canStream: false,

      masterPlaylistReady: false,

      aggregateStatus: 'processing',

      bitrates: [{ bitrate: 128, status: 'processing', progress: 47 }],

    };



    const { container } = renderWithStore(

      <ChapterTranscodingStatus chapterId="ch-1" status={status} />

    );



    expect(container.querySelector('.bitrate-progress-ring--in-progress')).toBeTruthy();

  });



  it('shows retry control for failed bitrates and updates redux after retry', async () => {

    const user = userEvent.setup();

    const status: Status = {

      chapterId: 'ch-1',

      canStream: false,

      masterPlaylistReady: false,

      aggregateStatus: 'failed',

      bitrates: [{ bitrate: 128, status: 'failed', progress: 0, errorMessage: 'Error' }],

    };



    const { store } = renderWithStore(

      <ChapterTranscodingStatus chapterId="ch-1" status={status} />

    );



    const retryButton = screen.getByRole('button', {

      name: 'Retry 128k transcoding',

    });

    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);

    expect(retryChapterTranscodingMock).toHaveBeenCalledWith('ch-1', [128]);



    const chapterStatus = store.getState().transcoding.statusByChapterId['ch-1'];

    expect(chapterStatus?.bitrates[0]).toEqual({

      bitrate: 128,

      status: 'pending',

      progress: 0,

      errorMessage: undefined,

    });

    expect(store.getState().transcoding.refreshChapterIds).toEqual(['ch-1']);

  });

});


