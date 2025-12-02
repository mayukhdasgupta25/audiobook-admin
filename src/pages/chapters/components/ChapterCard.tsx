/**
 * Chapter Card component
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDurationDetailed, formatDateToIST } from '../../../utils/formatting';
import type { ChapterApiResponse } from '../../../types/audiobook';
import Button from '../../../components/common/Button';
import '../../../styles/pages/chapters/components/ChapterCard.css';

interface ChapterCardProps {
   chapter: ChapterApiResponse;
   onEdit?: (chapter: ChapterApiResponse) => void;
   onDelete?: (chapter: ChapterApiResponse) => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onEdit, onDelete }) => {
   const isLive = chapter.isActive === true;
   const isScheduled = chapter.isActive === false;

   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id: chapter.id });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? 'none' : transition,
      opacity: isDragging ? 0.6 : 1,
   };

   return (
      <div
         ref={setNodeRef}
         style={style}
         className={`chapter-card ${isDragging ? 'chapter-card-dragging' : ''}`}
         {...attributes}
         {...listeners}
      >
         <div className="chapter-card-cover">
            {chapter.coverImage ? (
               <img src={chapter.coverImage} alt={chapter.title} draggable="false" />
            ) : (
               <div className="chapter-card-placeholder">
                  <span>📖</span>
               </div>
            )}
         </div>
         <div className="chapter-card-content">
            <div className="chapter-card-header">
               <span className="chapter-card-number">Chapter {chapter.chapterNumber}</span>
               {isLive && <span className="chapter-card-status chapter-card-status-live">Live</span>}
               {isScheduled && <span className="chapter-card-status chapter-card-status-scheduled">Scheduled</span>}
            </div>
            <h3 className="chapter-card-title">{chapter.title}</h3>
            {chapter.description && (
               <p className="chapter-card-description">{chapter.description}</p>
            )}
            <div className="chapter-card-meta">
               {chapter.duration && (
                  <span className="chapter-card-duration">
                     ⏱️ {formatDurationDetailed(chapter.duration)}
                  </span>
               )}
               {chapter.startPosition !== undefined && chapter.endPosition !== undefined && (
                  <span className="chapter-card-position">
                     Position: {formatDurationDetailed(chapter.startPosition)} -{' '}
                     {formatDurationDetailed(chapter.endPosition)}
                  </span>
               )}
            </div>
            <div className="chapter-card-scheduled">
               {isScheduled && chapter.scheduledAt ? (
                  <span>📅 Scheduled: {formatDateToIST(chapter.scheduledAt)}</span>
               ) : (
                  <span className="chapter-card-scheduled-placeholder"></span>
               )}
            </div>
            <div className="chapter-card-actions" onClick={(e) => e.stopPropagation()}>
               {onEdit && (
                  <Button
                     type="button"
                     variant="edit"
                     size="small"
                     onClick={(e) => {
                        e.stopPropagation();
                        onEdit(chapter);
                     }}
                  >
                     Edit
                  </Button>
               )}
               {onDelete && (
                  <Button
                     type="button"
                     variant="danger"
                     size="small"
                     onClick={(e) => {
                        e.stopPropagation();
                        onDelete(chapter);
                     }}
                  >
                     Delete
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
};

export default React.memo(ChapterCard);

