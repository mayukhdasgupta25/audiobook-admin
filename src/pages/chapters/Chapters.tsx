/**
 * Chapters page for a specific audiobook
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchChapters, setCurrentPage, setCurrentAudiobookId, deleteChapterThunk, updateChapterThunk } from '../../store/slices/chaptersSlice';
import type { ChapterApiResponse } from '../../types/audiobook';
import ChapterCard from './components/ChapterCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import ChapterForm from './components/forms/ChapterForm';
import { showApiError } from '../../utils/toast';
import '../../styles/pages/chapters/Chapters.css';

const Chapters: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { chapters, pagination, loading, currentPage } = useAppSelector(
      (state) => state.chapters
   );

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingChapter, setEditingChapter] = useState<ChapterApiResponse | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [deletingChapter, setDeletingChapter] = useState<ChapterApiResponse | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   // Drag and drop state
   const [localChapters, setLocalChapters] = useState<ChapterApiResponse[]>([]);
   const originalOrderRef = useRef<ChapterApiResponse[]>([]);
   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const pendingUpdateRef = useRef<{ chapterId: string; newChapterNumber: number } | null>(null);

   // Configure sensors for drag and drop
   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 5, // Require 5px of movement before activating
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   );

   // Set current audiobook ID and fetch chapters when ID changes
   useEffect(() => {
      if (id) {
         dispatch(setCurrentAudiobookId(id));
         dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
      }
   }, [dispatch, id, currentPage]);

   // Update local chapters when chapters from Redux change
   useEffect(() => {
      const sorted = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
      setLocalChapters(sorted);
      // Store original order for error reversion
      originalOrderRef.current = sorted;
   }, [chapters]);

   // Calculate next chapter number - use sorted copy to avoid mutation
   const sortedChapters = chapters.length > 0 ? [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber) : [];
   const nextChapterNumber = sortedChapters.length > 0
      ? sortedChapters[sortedChapters.length - 1].chapterNumber + 1
      : 1;

   const handlePageChange = (page: number) => {
      dispatch(setCurrentPage(page));
      if (id) {
         dispatch(fetchChapters({ audiobookId: id, page }));
      }
   };

   const handleCreateSuccess = () => {
      setIsCreateModalOpen(false);
      if (id) {
         // Refresh chapters list - fetch without page to get current page
         dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
      }
   };

   const handleEdit = (chapter: ChapterApiResponse) => {
      setEditingChapter(chapter);
      setIsEditModalOpen(true);
   };

   const handleEditSuccess = () => {
      setIsEditModalOpen(false);
      setEditingChapter(null);
      if (id) {
         dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
      }
   };

   const handleDelete = (chapter: ChapterApiResponse) => {
      setDeletingChapter(chapter);
      setIsDeleteModalOpen(true);
   };

   const handleDeleteConfirm = async () => {
      if (deletingChapter && deletingChapter.id) {
         setIsDeleting(true);
         try {
            await dispatch(deleteChapterThunk(deletingChapter.id)).unwrap();

            // Close modal immediately after successful delete
            setIsDeleteModalOpen(false);
            setDeletingChapter(null);
            setIsDeleting(false);

            if (id) {
               // Fetch updated list - adjust page if current page becomes empty
               const targetPage = pagination && currentPage > 1 && chapters.length === 1
                  ? currentPage - 1
                  : currentPage;

               await dispatch(fetchChapters({ audiobookId: id, page: targetPage })).unwrap();

               // Update current page if we adjusted it
               if (targetPage !== currentPage) {
                  dispatch(setCurrentPage(targetPage));
               }
            }
         } catch (error) {
            showApiError(error);
            setIsDeleting(false);
            // Keep modal open on error so user can try again
         }
      }
   };

   // Debounced update function
   const debouncedUpdateChapter = useCallback(async (chapterId: string, newChapterNumber: number) => {
      // Clear any pending timeout
      if (debounceTimeoutRef.current) {
         clearTimeout(debounceTimeoutRef.current);
      }

      // Store the pending update
      pendingUpdateRef.current = { chapterId, newChapterNumber };

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(async () => {
         const update = pendingUpdateRef.current;
         if (update && id) {
            try {
               await dispatch(updateChapterThunk({
                  chapterId: update.chapterId,
                  chapterNumber: update.newChapterNumber,
               })).unwrap();

               // Refresh chapters list after successful update
               await dispatch(fetchChapters({ audiobookId: id, page: currentPage })).unwrap();
               pendingUpdateRef.current = null;
            } catch (error) {
               showApiError(error);
               // Revert to original order on error
               setLocalChapters(originalOrderRef.current);
               // Refetch to ensure consistency
               if (id) {
                  dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
               }
            }
         }
      }, 300);
   }, [dispatch, id, currentPage]);

   // Handle drag end
   const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || !id) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      const oldIndex = localChapters.findIndex((chapter) => chapter.id === activeId);
      const newIndex = localChapters.findIndex((chapter) => chapter.id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      // Check if dragging to page boundary for cross-page support
      const isAtTop = newIndex === 0 && currentPage > 1;
      const isAtBottom = newIndex === localChapters.length - 1 && pagination && pagination.totalPages > currentPage;

      if (isAtTop) {
         // Move to previous page
         const targetPage = currentPage - 1;
         try {
            // Fetch previous page to get chapters
            const prevPageResult = await dispatch(fetchChapters({ audiobookId: id, page: targetPage })).unwrap();
            const sortedPrev = [...(prevPageResult?.response?.data || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
            const lastChapter = sortedPrev.length > 0 ? sortedPrev[sortedPrev.length - 1] : null;
            const newChapterNumber = lastChapter ? lastChapter.chapterNumber + 1 : 1;

            // Update chapter to new page
            await dispatch(updateChapterThunk({
               chapterId: activeId,
               chapterNumber: newChapterNumber,
            })).unwrap();

            // Navigate to target page and refresh
            dispatch(setCurrentPage(targetPage));
            await dispatch(fetchChapters({ audiobookId: id, page: targetPage })).unwrap();
            await dispatch(fetchChapters({ audiobookId: id, page: currentPage })).unwrap();
         } catch (error) {
            showApiError(error);
            // Revert to original order
            setLocalChapters(originalOrderRef.current);
            if (id) {
               dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
            }
         }
         return;
      }

      if (isAtBottom) {
         // Move to next page
         const targetPage = currentPage + 1;
         try {
            // Fetch next page to get chapters
            const nextPageResult = await dispatch(fetchChapters({ audiobookId: id, page: targetPage })).unwrap();
            const sortedNext = [...(nextPageResult?.response?.data || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
            const newChapterNumber = sortedNext.length > 0 && sortedNext[0] ? Math.max(1, sortedNext[0].chapterNumber - 1) : 1;

            // Update chapter to new page
            await dispatch(updateChapterThunk({
               chapterId: activeId,
               chapterNumber: newChapterNumber,
            })).unwrap();

            // Navigate to target page and refresh
            dispatch(setCurrentPage(targetPage));
            await dispatch(fetchChapters({ audiobookId: id, page: targetPage })).unwrap();
            await dispatch(fetchChapters({ audiobookId: id, page: currentPage })).unwrap();
         } catch (error) {
            showApiError(error);
            // Revert to original order
            setLocalChapters(originalOrderRef.current);
            if (id) {
               dispatch(fetchChapters({ audiobookId: id, page: currentPage }));
            }
         }
         return;
      }

      // Same page reordering
      const reorderedChapters = arrayMove(localChapters, oldIndex, newIndex);
      setLocalChapters(reorderedChapters);

      // Calculate new chapter number based on position
      let newChapterNumber: number;
      if (newIndex === 0) {
         // Moving to first position
         const nextChapter = reorderedChapters[1];
         newChapterNumber = nextChapter ? Math.max(1, nextChapter.chapterNumber - 1) : 1;
      } else if (newIndex === reorderedChapters.length - 1) {
         // Moving to last position
         const prevChapter = reorderedChapters[newIndex - 1];
         newChapterNumber = prevChapter ? prevChapter.chapterNumber + 1 : 1;
      } else {
         // Moving between items
         const prevChapter = reorderedChapters[newIndex - 1];
         const nextChapter = reorderedChapters[newIndex + 1];
         if (prevChapter && nextChapter) {
            newChapterNumber = Math.floor((prevChapter.chapterNumber + nextChapter.chapterNumber) / 2);
            // If same number, use next chapter's number
            if (newChapterNumber === prevChapter.chapterNumber) {
               newChapterNumber = prevChapter.chapterNumber + 1;
            }
         } else {
            newChapterNumber = prevChapter ? prevChapter.chapterNumber + 1 : 1;
         }
      }

      // Ensure chapter number is at least 1
      newChapterNumber = Math.max(1, newChapterNumber);

      // Debounce the API call
      debouncedUpdateChapter(activeId, newChapterNumber);
   };

   if (!id) {
      return (
         <div className="chapters-page">
            <div className="error-state">
               <p>Invalid audiobook ID</p>
               <Button onClick={() => navigate('/audiobooks')}>Back to Audiobooks</Button>
            </div>
         </div>
      );
   }

   return (
      <div className="chapters-page">
         <div className="chapters-header">
            <Button variant="outline" onClick={() => navigate('/audiobooks')}>
               ← Back to Audiobooks
            </Button>
            <div className="chapters-header-right">
               <h2>Chapters</h2>
               <Button onClick={() => setIsCreateModalOpen(true)}>Create Chapter</Button>
            </div>
         </div>

         {loading && (
            <div className="loading-state">
               <p>Loading chapters...</p>
            </div>
         )}

         {!loading && chapters.length === 0 && (
            <div className="empty-state">
               <p>No chapters yet. Create the first chapter to get started.</p>
            </div>
         )}

         {!loading && chapters.length > 0 && (
            <>
               <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
               >
                  <SortableContext
                     items={localChapters.map((chapter) => chapter.id)}
                     strategy={verticalListSortingStrategy}
                  >
                     <div className="chapters-list">
                        {localChapters.map((chapter) => (
                           <ChapterCard
                              key={chapter.id}
                              chapter={chapter}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                           />
                        ))}
                     </div>
                  </SortableContext>
               </DndContext>

               {pagination && pagination.totalPages > 1 && (
                  <Pagination
                     currentPage={currentPage}
                     totalPages={pagination.totalPages}
                     onPageChange={handlePageChange}
                  />
               )}
            </>
         )}

         <Modal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            title="Create New Chapter"
            size="large"
         >
            <ChapterForm
               audiobookId={id}
               nextChapterNumber={nextChapterNumber}
               onSuccess={handleCreateSuccess}
               onCancel={() => setIsCreateModalOpen(false)}
            />
         </Modal>

         <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
               setIsEditModalOpen(false);
               setEditingChapter(null);
            }}
            title="Edit Chapter"
            size="large"
         >
            {editingChapter && (
               <ChapterForm
                  audiobookId={id}
                  nextChapterNumber={editingChapter.chapterNumber}
                  chapterId={editingChapter.id}
                  initialData={editingChapter}
                  onSuccess={handleEditSuccess}
                  onCancel={() => {
                     setIsEditModalOpen(false);
                     setEditingChapter(null);
                  }}
               />
            )}
         </Modal>

         <ConfirmDialog
            isOpen={isDeleteModalOpen}
            onClose={() => {
               setIsDeleteModalOpen(false);
               setDeletingChapter(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Chapter"
            message={
               deletingChapter
                  ? `Are you sure you want to delete "${deletingChapter.title}"? This action cannot be undone.`
                  : ''
            }
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeleting}
         />
      </div>
   );
};

export default Chapters;

