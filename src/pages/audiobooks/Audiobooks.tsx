/**
 * Audiobooks page with Live/Scheduled tabs
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchAudiobooks, setFilter, setCurrentPage, deleteAudiobookThunk } from '../../store/slices/audiobooksSlice';
import type { AudiobookApiResponse } from '../../types/audiobook';
import AudiobookCard from './components/AudiobookCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Pagination from '../../components/common/Pagination';
import AudiobookForm from './components/forms/AudiobookForm';
import { showApiError } from '../../utils/toast';
import '../../styles/pages/audiobooks/Audiobooks.css';

const Audiobooks: React.FC = () => {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const { audiobooks, pagination, loading, filter, searchQuery, currentPage } = useAppSelector(
      (state) => state.audiobooks
   );

   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [editingAudiobook, setEditingAudiobook] = useState<AudiobookApiResponse | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [deletingAudiobook, setDeletingAudiobook] = useState<AudiobookApiResponse | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   // Fetch audiobooks when page or filter changes
   useEffect(() => {
      dispatch(fetchAudiobooks({ page: currentPage, filter }));
   }, [dispatch, currentPage, filter]);

   // Filter audiobooks by search query (client-side)
   const filteredAudiobooks = useMemo(() => {
      if (!searchQuery.trim()) {
         return audiobooks;
      }

      const query = searchQuery.toLowerCase();
      return audiobooks.filter(
         (ab) =>
            ab.title.toLowerCase().includes(query) ||
            ab.author.toLowerCase().includes(query) ||
            (ab.narrators && ab.narrators.some((n) => n.toLowerCase().includes(query))) ||
            (ab.narrator && ab.narrator.toLowerCase().includes(query))
      );
   }, [audiobooks, searchQuery]);

   const handlePageChange = (page: number) => {
      dispatch(setCurrentPage(page));
   };

   const handleCreateSuccess = () => {
      setIsCreateModalOpen(false);
      dispatch(fetchAudiobooks({ page: 1, filter }));
   };

   const handleEdit = (audiobook: AudiobookApiResponse) => {
      setEditingAudiobook(audiobook);
      setIsEditModalOpen(true);
   };

   const handleEditSuccess = () => {
      setIsEditModalOpen(false);
      setEditingAudiobook(null);
      dispatch(fetchAudiobooks({ page: currentPage, filter }));
   };

   const handleDelete = (audiobook: AudiobookApiResponse) => {
      setDeletingAudiobook(audiobook);
      setIsDeleteModalOpen(true);
   };

   const handleDeleteConfirm = async () => {
      if (deletingAudiobook && deletingAudiobook.id) {
         setIsDeleting(true);
         try {
            await dispatch(deleteAudiobookThunk(deletingAudiobook.id)).unwrap();

            // Close modal immediately after successful delete
            setIsDeleteModalOpen(false);
            setDeletingAudiobook(null);
            setIsDeleting(false);

            // Fetch updated list - adjust page if current page becomes empty
            const targetPage = pagination && currentPage > 1 && audiobooks.length === 1
               ? currentPage - 1
               : currentPage;

            await dispatch(fetchAudiobooks({ page: targetPage, filter })).unwrap();

            // Update current page if we adjusted it
            if (targetPage !== currentPage) {
               dispatch(setCurrentPage(targetPage));
            }
         } catch (error) {
            showApiError(error);
            setIsDeleting(false);
            // Keep modal open on error so user can try again
         }
      }
   };

   return (
      <div className="audiobooks-page">
         <div className="audiobooks-header">
            <h2>Audiobooks</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Audiobook</Button>
         </div>

         <div className="audiobooks-tabs">
            <button
               className={`tab-button tab-button-live ${filter === 'live' ? 'active' : ''}`}
               onClick={() => dispatch(setFilter('live'))}
            >
               Live
            </button>
            <button
               className={`tab-button tab-button-scheduled ${filter === 'scheduled' ? 'active' : ''}`}
               onClick={() => dispatch(setFilter('scheduled'))}
            >
               Scheduled
            </button>
         </div>

         {loading && (
            <div className="loading-state">
               <p>Loading audiobooks...</p>
            </div>
         )}

         {!loading && filteredAudiobooks.length === 0 && (
            <div className="empty-state">
               <p>No audiobooks found. Create one to get started.</p>
            </div>
         )}

         {!loading && filteredAudiobooks.length > 0 && (
            <>
               <div className="audiobooks-grid">
                  {filteredAudiobooks.map((audiobook) => (
                     <AudiobookCard
                        key={audiobook.id}
                        audiobook={audiobook}
                        onClick={() => navigate(`/audiobooks/${audiobook.id}/chapters`)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                     />
                  ))}
               </div>

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
            title="Create New Audiobook"
            size="large"
         >
            <AudiobookForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateModalOpen(false)} />
         </Modal>

         <Modal
            isOpen={isEditModalOpen}
            onClose={() => {
               setIsEditModalOpen(false);
               setEditingAudiobook(null);
            }}
            title="Edit Audiobook"
            size="large"
         >
            {editingAudiobook && (
               <AudiobookForm
                  audiobookId={editingAudiobook.id}
                  initialData={editingAudiobook}
                  onSuccess={handleEditSuccess}
                  onCancel={() => {
                     setIsEditModalOpen(false);
                     setEditingAudiobook(null);
                  }}
               />
            )}
         </Modal>

         <ConfirmDialog
            isOpen={isDeleteModalOpen}
            onClose={() => {
               setIsDeleteModalOpen(false);
               setDeletingAudiobook(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Audiobook"
            message={
               deletingAudiobook
                  ? `Are you sure you want to delete "${deletingAudiobook.title}"? This action cannot be undone.`
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

export default Audiobooks;

