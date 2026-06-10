import { MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { AudiobookApiResponse } from '../../../types/audiobook';
import type { AudiobookFilter } from '../../../store/slices/audiobooksSlice';
import '../../../styles/pages/audiobooks/components/AudiobookTable.css';

interface AudiobookTableProps {
  audiobooks: AudiobookApiResponse[];
  filter: AudiobookFilter;
  onRowClick: (audiobook: AudiobookApiResponse) => void;
  onEdit: (audiobook: AudiobookApiResponse) => void;
  onDelete: (audiobook: AudiobookApiResponse) => void;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getStatus(filter: AudiobookFilter, audiobook: AudiobookApiResponse) {
  if (filter === 'scheduled') return { label: 'Scheduled', variant: 'scheduled' };
  if (filter === 'drafts') return { label: 'Draft', variant: 'draft' };
  if (audiobook.isActive === false) return { label: 'Draft', variant: 'draft' };
  return { label: 'Live', variant: 'live' };
}

const placeholderListeners = ['12.4K', '8.1K', '5.6K', '3.2K', '9.8K'];
const placeholderChapters = [14, 22, 8, 18, 11];
const placeholderDates = [
  'May 8, 2026',
  'Apr 12, 2026',
  'Mar 3, 2026',
  'Feb 18, 2026',
  'Jan 25, 2026',
];

function AudiobookTable({
  audiobooks,
  filter,
  onRowClick,
  onEdit,
  onDelete,
}: AudiobookTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="audiobook-table-wrapper marketing-card">
      <table className="audiobook-table">
        <thead>
          <tr>
            <th>Audiobook</th>
            <th>Author</th>
            <th>Status</th>
            <th>Chapters</th>
            <th>Publish Date</th>
            <th>Duration</th>
            <th>Listeners</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {audiobooks.map((audiobook, index) => {
            const status = getStatus(filter, audiobook);
            const genre =
              audiobook.genres?.[0]?.name ||
              audiobook.genre?.name ||
              'General';

            return (
              <tr
                key={audiobook.id}
                onClick={() => onRowClick(audiobook)}
                className="audiobook-table-row"
              >
                <td>
                  <div className="audiobook-table-title-cell">
                    {audiobook.coverImage ? (
                      <img
                        src={audiobook.coverImage}
                        alt=""
                        className="audiobook-table-thumb"
                      />
                    ) : (
                      <div className="audiobook-table-thumb audiobook-table-thumb--placeholder" />
                    )}
                    <div>
                      <p className="audiobook-table-title">{audiobook.title}</p>
                      <p className="audiobook-table-genre">{genre}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="audiobook-table-author">{audiobook.author}</p>
                </td>
                <td>
                  <span
                    className={`audiobook-status-badge audiobook-status-badge--${status.variant}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td>{placeholderChapters[index % placeholderChapters.length]}</td>
                <td>{placeholderDates[index % placeholderDates.length]}</td>
                <td>{formatDuration(audiobook.duration)}</td>
                <td>{placeholderListeners[index % placeholderListeners.length]}</td>
                <td>
                  <div
                    className="audiobook-table-actions"
                    ref={openMenuId === audiobook.id ? menuRef : null}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="audiobook-table-menu-btn"
                      aria-label="Actions"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === audiobook.id ? null : audiobook.id
                        )
                      }
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === audiobook.id && (
                      <div className="audiobook-table-menu">
                        <button
                          type="button"
                          onClick={() => {
                            onRowClick(audiobook);
                            setOpenMenuId(null);
                          }}
                        >
                          View chapters
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onEdit(audiobook);
                            setOpenMenuId(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => {
                            onDelete(audiobook);
                            setOpenMenuId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AudiobookTable;
