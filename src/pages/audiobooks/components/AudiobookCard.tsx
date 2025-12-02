/**
 * Audiobook Card component
 */

import React from 'react';
import { formatDuration } from '../../../utils/formatting';
import type { AudiobookApiResponse } from '../../../types/audiobook';
import Button from '../../../components/common/Button';
import '../../../styles/pages/audiobooks/components/AudiobookCard.css';

interface AudiobookCardProps {
   audiobook: AudiobookApiResponse;
   onClick: () => void;
   onEdit?: (audiobook: AudiobookApiResponse) => void;
   onDelete?: (audiobook: AudiobookApiResponse) => void;
}

const AudiobookCard: React.FC<AudiobookCardProps> = ({ audiobook, onClick, onEdit, onDelete }) => {
   const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Only trigger onClick if clicking on the card itself, not on buttons
      if ((e.target as HTMLElement).closest('.audiobook-card-actions')) {
         return;
      }
      onClick();
   };

   const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onEdit) {
         onEdit(audiobook);
      }
   };

   const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (onDelete) {
         onDelete(audiobook);
      }
   };

   return (
      <div className="audiobook-card" onClick={handleCardClick}>
         <div className="audiobook-card-cover">
            {audiobook.coverImage ? (
               <img src={audiobook.coverImage} alt={audiobook.title} />
            ) : (
               <div className="audiobook-card-placeholder">
                  <span>📚</span>
               </div>
            )}
         </div>
         <div className="audiobook-card-content">
            <h3 className="audiobook-card-title">{audiobook.title}</h3>
            <p className="audiobook-card-author">by {audiobook.author}</p>
            {/* Support both old (narrator) and new (narrators) formats */}
            {(audiobook.narrators && audiobook.narrators.length > 0) ? (
               <p className="audiobook-card-narrator">
                  Narrated by {audiobook.narrators.join(', ')}
               </p>
            ) : audiobook.narrator ? (
               <p className="audiobook-card-narrator">Narrated by {audiobook.narrator}</p>
            ) : null}
            <div className="audiobook-card-badges">
               {/* Support both old (genre) and new (genres) formats */}
               {audiobook.genres && audiobook.genres.length > 0 ? (
                  audiobook.genres.map((genre, index) => (
                     <span key={`${genre.name}-${index}`} className="audiobook-card-badge audiobook-card-badge-genre">
                        {genre.name}
                     </span>
                  ))
               ) : audiobook.genre ? (
                  <span className="audiobook-card-badge audiobook-card-badge-genre">
                     {audiobook.genre.name}
                  </span>
               ) : null}
               {audiobook.audiobookTags && audiobook.audiobookTags.length > 0 && (
                  <>
                     {audiobook.audiobookTags.map((tag, index) => (
                        <span key={`${tag.name}-${index}`} className="audiobook-card-badge audiobook-card-badge-tag">
                           {tag.name}
                        </span>
                     ))}
                  </>
               )}
            </div>
            {audiobook.duration && (
               <div className="audiobook-card-duration">
                  <span>⏱️ {formatDuration(audiobook.duration)}</span>
               </div>
            )}
         </div>
         {(onEdit || onDelete) && (
            <div className="audiobook-card-actions" onClick={(e) => e.stopPropagation()}>
               {onEdit && (
                  <Button
                     type="button"
                     variant="edit"
                     size="small"
                     onClick={handleEdit}
                  >
                     Edit
                  </Button>
               )}
               {onDelete && (
                  <Button
                     type="button"
                     variant="danger"
                     size="small"
                     onClick={handleDelete}
                  >
                     Delete
                  </Button>
               )}
            </div>
         )}
      </div>
   );
};

export default React.memo(AudiobookCard);

