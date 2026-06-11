import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { store } from '../src/store/store';
import AudiobookWizard from '../src/pages/audiobooks/AudiobookWizard';
import { mockAudiobook, testCoverFile } from './wizardTestHelpers';

const { createAudiobookMock, updateAudiobookMock } = vi.hoisted(() => ({
  createAudiobookMock: vi.fn(),
  updateAudiobookMock: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../src/utils/config', async importOriginal => {
  const actual = await importOriginal<typeof import('../src/utils/config')>();
  return {
    ...actual,
    isPartnerApp: vi.fn(() => true),
  };
});

vi.mock('../src/utils/audiobookApi', async importOriginal => {
  const actual =
    await importOriginal<typeof import('../src/utils/audiobookApi')>();
  return {
    ...actual,
    createAudiobook: createAudiobookMock,
    updateAudiobook: updateAudiobookMock,
    getGenres: vi.fn().mockResolvedValue([
      {
        id: 'genre-1',
        name: 'Fiction',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]),
    getTags: vi.fn().mockResolvedValue([
      {
        id: 'tag-1',
        name: 'Bestseller',
        type: 'general',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    ]),
    getAudiobooks: vi.fn().mockResolvedValue({
      success: true,
      data: {
        audiobooks: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10,
        },
      },
    }),
  };
});

async function waitForCatalogOptions() {
  await waitFor(() => {
    expect(screen.getByRole('checkbox', { name: /fiction/i })).toBeInTheDocument();
  });
}

async function fillBasicsStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByLabelText(/audiobook title/i),
    'My New Audiobook'
  );
  await user.type(
    screen.getByLabelText(/short description/i),
    'A compelling story.'
  );
  await user.click(screen.getByRole('checkbox', { name: /fiction/i }));
  await user.click(screen.getByRole('checkbox', { name: /bestseller/i }));
  await user.selectOptions(screen.getByLabelText(/^language$/i), 'Hindi');
}

async function advanceToContributors(user: ReturnType<typeof userEvent.setup>) {
  await fillBasicsStep(user);
  await user.click(screen.getByRole('button', { name: /continue/i }));
  await screen.findByLabelText(/^author/i);
}

async function advanceToCoverStep(user: ReturnType<typeof userEvent.setup>) {
  await advanceToContributors(user);
  await user.type(screen.getByLabelText(/^author/i), 'Jane Author');
  await user.click(screen.getByRole('button', { name: /continue/i }));
}

async function advanceToReviewStep(user: ReturnType<typeof userEvent.setup>) {
  await advanceToCoverStep(user);
  const coverInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  await user.upload(coverInput, testCoverFile);
  await user.click(screen.getByRole('button', { name: /continue/i }));
  await screen.findByText(/schedule this audiobook for later/i);
}

function renderCreateWizard() {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/audiobooks/create']}>
        <Routes>
          <Route path="/audiobooks/create" element={<AudiobookWizard />} />
          <Route path="/audiobooks" element={<div>Audiobooks List</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

function renderEditWizard() {
  return render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/audiobooks/ab-edit-1/edit',
            state: { audiobook: mockAudiobook },
          },
        ]}
      >
        <Routes>
          <Route path="/audiobooks/:id/edit" element={<AudiobookWizard />} />
          <Route path="/audiobooks" element={<div>Audiobooks List</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('AudiobookWizard', () => {
  beforeEach(() => {
    createAudiobookMock.mockReset();
    updateAudiobookMock.mockReset();
    createAudiobookMock.mockResolvedValue({
      id: 'new-ab',
      title: 'My New Audiobook',
    });
    updateAudiobookMock.mockResolvedValue({
      id: 'ab-edit-1',
      title: 'Existing Audiobook',
    });
    localStorage.clear();
  });

  it('renders create wizard with step 1 basics', async () => {
    renderCreateWizard();
    expect(
      await screen.findByRole('heading', { name: /create new audiobook/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: /step 1 of 4/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/audiobook title/i)).toBeInTheDocument();
    expect(screen.getByText(/live preview/i)).toBeInTheDocument();
  });

  it('shows validation errors when continuing with empty basics', async () => {
    const user = userEvent.setup();
    renderCreateWizard();
    await waitForCatalogOptions();
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one genre is required/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one tag is required/i)).toBeInTheDocument();
  });

  it('updates live preview as the user types', async () => {
    const user = userEvent.setup();
    renderCreateWizard();
    await waitForCatalogOptions();
    await user.type(
      screen.getByLabelText(/audiobook title/i),
      'Preview Title'
    );

    expect(screen.getByText('Preview Title')).toBeInTheDocument();
    expect(screen.getByText(/language: english/i)).toBeInTheDocument();
  });

  it('publishes a new audiobook with language in the create payload', async () => {
    const user = userEvent.setup();
    renderCreateWizard();
    await waitForCatalogOptions();
    await advanceToReviewStep(user);

    expect(screen.getAllByText('My New Audiobook').length).toBeGreaterThan(0);
    expect(screen.getByText('Language')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^publish$/i }));

    await waitFor(() => {
      expect(createAudiobookMock).toHaveBeenCalledTimes(1);
    });

    expect(createAudiobookMock.mock.calls[0][0]).toMatchObject({
      title: 'My New Audiobook',
      author: 'Jane Author',
      language: 'Hindi',
      genreIds: ['genre-1'],
      tagIds: ['tag-1'],
    });
    expect(
      await screen.findByText('Audiobooks List')
    ).toBeInTheDocument();
  });

  it('requires schedule date when scheduling from review step', async () => {
    const user = userEvent.setup();
    renderCreateWizard();
    await waitForCatalogOptions();
    await advanceToReviewStep(user);

    await user.click(
      screen.getByRole('checkbox', { name: /schedule this audiobook for later/i })
    );
    await user.click(screen.getByRole('button', { name: /^schedule$/i }));

    expect(
      await screen.findByText(/schedule date and time is required/i)
    ).toBeInTheDocument();
    expect(createAudiobookMock).not.toHaveBeenCalled();
  });

  it('hydrates edit mode and sends language on update', async () => {
    const user = userEvent.setup();
    renderEditWizard();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Existing Audiobook')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('Hindi')).toBeInTheDocument();
    expect(screen.getByText(/language: hindi/i)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/^language$/i), 'Spanish');
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.click(screen.getByRole('button', { name: /^update$/i }));

    await waitFor(() => {
      expect(updateAudiobookMock).toHaveBeenCalledTimes(1);
    });

    expect(updateAudiobookMock.mock.calls[0][0]).toMatchObject({
      audiobookId: 'ab-edit-1',
      language: 'Spanish',
      title: 'Existing Audiobook',
    });
  });
});
