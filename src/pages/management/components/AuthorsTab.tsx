/**
 * Authors tab component for managing authors
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
   fetchAuthors,
   createAuthorThunk,
   updateAuthorThunk,
   deleteAuthorThunk,
} from '../../../store/slices/authorsSlice';
import type { AuthorItem } from '../../../utils/audiobookApi';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import AuthorForm from './forms/AuthorForm';
import { showApiError, showSuccess } from '../../../utils/toast';
import '../../../styles/pages/management/components/AuthorsTab.css';

const AuthorsTab: React.FC = () => {
   const dispatch = useAppDispatch();
   const { authors, loading: authorsLoading } = useAppSelector((state) => state.authors);

   const [searchQuery, setSearchQuery] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [deletingAuthor, setDeletingAuthor] = useState<AuthorItem | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Fetch authors on mount
   useEffect(() => {
      dispatch(fetchAuthors());
   }, [dispatch]);

   // Filter authors by search query
   const filteredAuthors = useMemo(() => {
      if (!searchQuery.trim()) {
         return authors;
      }
      const query = searchQuery.toLowerCase();
      return authors.filter(
         (author) =>
            author.firstName.toLowerCase().includes(query) ||
            author.lastName.toLowerCase().includes(query) ||
            `${author.firstName} ${author.lastName}`.toLowerCase().includes(query) ||
            author.email.toLowerCase().includes(query)
      );
   }, [authors, searchQuery]);

   const handleCreate = () => {
      setEditingAuthor(null);
      setIsModalOpen(true);
   };

   const handleEdit = (author: AuthorItem) => {
      setEditingAuthor(author);
      setIsModalOpen(true);
   };

   const handleSubmit = async (formData: {
      firstName: string;
      lastName: string;
      email: string;
      address: string;
      contact: string;
   }) => {
      setIsSubmitting(true);
      try {
         if (editingAuthor) {
            await dispatch(
               updateAuthorThunk({
                  id: editingAuthor.id,
                  data: {
                     firstName: formData.firstName,
                     lastName: formData.lastName,
                     email: formData.email,
                     address: formData.address || undefined,
                     contact: formData.contact || undefined,
                  },
               })
            ).unwrap();
            showSuccess('Author updated successfully');
         } else {
            await dispatch(
               createAuthorThunk({
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  email: formData.email,
                  address: formData.address || undefined,
                  contact: formData.contact || undefined,
               })
            ).unwrap();
            showSuccess('Author created successfully');
         }
         setIsModalOpen(false);
         setEditingAuthor(null);
         // Refresh authors list
         await dispatch(fetchAuthors());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDelete = (author: AuthorItem) => {
      setDeletingAuthor(author);
      setIsDeleteModalOpen(true);
   };

   const handleDeleteConfirm = async () => {
      if (!deletingAuthor) return;

      setIsDeleting(true);
      try {
         await dispatch(deleteAuthorThunk(deletingAuthor.id)).unwrap();
         showSuccess('Author deleted successfully');
         setIsDeleteModalOpen(false);
         setDeletingAuthor(null);
         // Refresh authors list
         await dispatch(fetchAuthors());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsDeleting(false);
      }
   };

   return (
      <div className="authors-tab">
         <div className="authors-header">
            <div className="authors-title-group">
               <h2 className="authors-title">Authors</h2>
               <span className="authors-count">({filteredAuthors.length})</span>
            </div>
            <div className="authors-actions">
               <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search authors..."
                  className="authors-search"
               />
               <Button variant="primary" onClick={handleCreate} size="medium">
                  + Add Author
               </Button>
            </div>
         </div>

         {authorsLoading ? (
            <div className="loading-container">
               <LoadingSpinner />
            </div>
         ) : filteredAuthors.length === 0 ? (
            <div className="empty-state">
               <div className="empty-state-icon">✍️</div>
               <h3 className="empty-state-title">
                  {searchQuery ? 'No authors found' : 'No authors yet'}
               </h3>
               <p className="empty-state-message">
                  {searchQuery
                     ? 'Try adjusting your search query'
                     : 'Get started by creating your first author'}
               </p>
               {!searchQuery && (
                  <Button variant="primary" onClick={handleCreate} size="medium">
                     Create Author
                  </Button>
               )}
            </div>
         ) : (
            <div className="authors-grid">
               <AnimatePresence mode="popLayout">
                  {filteredAuthors.map((author) => (
                     <motion.div
                        key={author.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="author-card"
                     >
                        <div className="author-card-content">
                           <h3 className="author-name">
                              {author.firstName} {author.lastName}
                           </h3>
                           <div className="author-details">
                              <div className="author-detail-item">
                                 <span className="author-detail-label">Email:</span>
                                 <span className="author-detail-value">{author.email}</span>
                              </div>
                              {author.contact && (
                                 <div className="author-detail-item">
                                    <span className="author-detail-label">Contact:</span>
                                    <span className="author-detail-value">{author.contact}</span>
                                 </div>
                              )}
                              {author.address && (
                                 <div className="author-detail-item">
                                    <span className="author-detail-label">Address:</span>
                                    <span className="author-detail-value">{author.address}</span>
                                 </div>
                              )}
                           </div>
                           <p className="author-meta">
                              Created {new Date(author.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                        <div className="author-card-actions">
                           <Button
                              variant="edit"
                              size="small"
                              onClick={() => handleEdit(author)}
                              className="action-button"
                           >
                              Edit
                           </Button>
                           <Button
                              variant="danger"
                              size="small"
                              onClick={() => handleDelete(author)}
                              className="action-button"
                           >
                              Delete
                           </Button>
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         )}

         {/* Author Modal */}
         <Modal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setEditingAuthor(null);
            }}
            title={editingAuthor ? 'Edit Author' : 'Create Author'}
            size="medium"
         >
            <AuthorForm
               initialData={
                  editingAuthor
                     ? {
                        firstName: editingAuthor.firstName,
                        lastName: editingAuthor.lastName,
                        email: editingAuthor.email,
                        address: editingAuthor.address || '',
                        contact: editingAuthor.contact || '',
                     }
                     : undefined
               }
               onSubmit={handleSubmit}
               onCancel={() => {
                  setIsModalOpen(false);
                  setEditingAuthor(null);
               }}
               isLoading={isSubmitting}
            />
         </Modal>

         {/* Delete Confirmation */}
         <ConfirmDialog
            isOpen={isDeleteModalOpen}
            onClose={() => {
               setIsDeleteModalOpen(false);
               setDeletingAuthor(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Author"
            message={`Are you sure you want to delete "${deletingAuthor?.firstName} ${deletingAuthor?.lastName}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeleting}
         />
      </div>
   );
};

export default AuthorsTab;
