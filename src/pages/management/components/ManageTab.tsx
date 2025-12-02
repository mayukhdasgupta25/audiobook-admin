/**
 * Manage tab component for managing Genres and Tags
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
   fetchGenres,
   createGenreThunk,
   updateGenreThunk,
   deleteGenreThunk,
} from '../../../store/slices/genresSlice';
import {
   fetchTags,
   createTagThunk,
   updateTagThunk,
   deleteTagThunk,
} from '../../../store/slices/tagsSlice';
import type { GenreItem, TagItem } from '../../../utils/audiobookApi';
import Modal from '../../../components/common/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import GenreForm from './forms/GenreForm';
import TagForm from './forms/TagForm';
import { showApiError, showSuccess } from '../../../utils/toast';
import '../../../styles/pages/management/components/ManageTab.css';

const ManageTab: React.FC = () => {
   const dispatch = useAppDispatch();
   const { genres, loading: genresLoading } = useAppSelector((state) => state.genres);
   const { tags, loading: tagsLoading } = useAppSelector((state) => state.tags);

   // Genre state
   const [genreSearchQuery, setGenreSearchQuery] = useState('');
   const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
   const [editingGenre, setEditingGenre] = useState<GenreItem | null>(null);
   const [isGenreDeleteModalOpen, setIsGenreDeleteModalOpen] = useState(false);
   const [deletingGenre, setDeletingGenre] = useState<GenreItem | null>(null);
   const [isGenreDeleting, setIsGenreDeleting] = useState(false);
   const [isGenreSubmitting, setIsGenreSubmitting] = useState(false);

   // Tag state
   const [tagSearchQuery, setTagSearchQuery] = useState('');
   const [isTagModalOpen, setIsTagModalOpen] = useState(false);
   const [editingTag, setEditingTag] = useState<TagItem | null>(null);
   const [isTagDeleteModalOpen, setIsTagDeleteModalOpen] = useState(false);
   const [deletingTag, setDeletingTag] = useState<TagItem | null>(null);
   const [isTagDeleting, setIsTagDeleting] = useState(false);
   const [isTagSubmitting, setIsTagSubmitting] = useState(false);

   // Fetch genres and tags on mount
   useEffect(() => {
      dispatch(fetchGenres());
      dispatch(fetchTags());
   }, [dispatch]);

   // Filter genres by search query
   const filteredGenres = useMemo(() => {
      if (!genreSearchQuery.trim()) {
         return genres;
      }
      const query = genreSearchQuery.toLowerCase();
      return genres.filter((genre) => genre.name.toLowerCase().includes(query));
   }, [genres, genreSearchQuery]);

   // Filter tags by search query
   const filteredTags = useMemo(() => {
      if (!tagSearchQuery.trim()) {
         return tags;
      }
      const query = tagSearchQuery.toLowerCase();
      return tags.filter((tag) => tag.name.toLowerCase().includes(query) || tag.type.toLowerCase().includes(query));
   }, [tags, tagSearchQuery]);

   // Genre handlers
   const handleCreateGenre = () => {
      setEditingGenre(null);
      setIsGenreModalOpen(true);
   };

   const handleEditGenre = (genre: GenreItem) => {
      setEditingGenre(genre);
      setIsGenreModalOpen(true);
   };

   const handleGenreSubmit = async (name: string) => {
      setIsGenreSubmitting(true);
      try {
         if (editingGenre) {
            await dispatch(updateGenreThunk({ id: editingGenre.id, name })).unwrap();
            showSuccess('Genre updated successfully');
         } else {
            await dispatch(createGenreThunk(name)).unwrap();
            showSuccess('Genre created successfully');
         }
         setIsGenreModalOpen(false);
         setEditingGenre(null);
         // Refresh genres list
         await dispatch(fetchGenres());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsGenreSubmitting(false);
      }
   };

   const handleDeleteGenre = (genre: GenreItem) => {
      setDeletingGenre(genre);
      setIsGenreDeleteModalOpen(true);
   };

   const handleGenreDeleteConfirm = async () => {
      if (!deletingGenre) return;

      setIsGenreDeleting(true);
      try {
         await dispatch(deleteGenreThunk(deletingGenre.id)).unwrap();
         showSuccess('Genre deleted successfully');
         setIsGenreDeleteModalOpen(false);
         setDeletingGenre(null);
         // Refresh genres list
         await dispatch(fetchGenres());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsGenreDeleting(false);
      }
   };

   // Tag handlers
   const handleCreateTag = () => {
      setEditingTag(null);
      setIsTagModalOpen(true);
   };

   const handleEditTag = (tag: TagItem) => {
      setEditingTag(tag);
      setIsTagModalOpen(true);
   };

   const handleTagSubmit = async (name: string) => {
      setIsTagSubmitting(true);
      try {
         if (editingTag) {
            await dispatch(updateTagThunk({ id: editingTag.id, name })).unwrap();
            showSuccess('Tag updated successfully');
         } else {
            await dispatch(createTagThunk({ name })).unwrap();
            showSuccess('Tag created successfully');
         }
         setIsTagModalOpen(false);
         setEditingTag(null);
         // Refresh tags list
         await dispatch(fetchTags());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsTagSubmitting(false);
      }
   };

   const handleDeleteTag = (tag: TagItem) => {
      setDeletingTag(tag);
      setIsTagDeleteModalOpen(true);
   };

   const handleTagDeleteConfirm = async () => {
      if (!deletingTag) return;

      setIsTagDeleting(true);
      try {
         await dispatch(deleteTagThunk(deletingTag.id)).unwrap();
         showSuccess('Tag deleted successfully');
         setIsTagDeleteModalOpen(false);
         setDeletingTag(null);
         // Refresh tags list
         await dispatch(fetchTags());
      } catch (error) {
         showApiError(error);
      } finally {
         setIsTagDeleting(false);
      }
   };

   return (
      <div className="manage-tab">
         {/* Genres Section */}
         <section className="manage-section">
            <div className="section-header">
               <div className="section-title-group">
                  <h2 className="section-title">Genres</h2>
                  <span className="section-count">({filteredGenres.length})</span>
               </div>
               <div className="section-actions">
                  <SearchBar
                     value={genreSearchQuery}
                     onChange={setGenreSearchQuery}
                     placeholder="Search genres..."
                     className="section-search"
                  />
                  <Button variant="primary" onClick={handleCreateGenre} size="medium">
                     + Add Genre
                  </Button>
               </div>
            </div>

            {genresLoading ? (
               <div className="loading-container">
                  <LoadingSpinner />
               </div>
            ) : filteredGenres.length === 0 ? (
               <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3 className="empty-state-title">
                     {genreSearchQuery ? 'No genres found' : 'No genres yet'}
                  </h3>
                  <p className="empty-state-message">
                     {genreSearchQuery
                        ? 'Try adjusting your search query'
                        : 'Get started by creating your first genre'}
                  </p>
                  {!genreSearchQuery && (
                     <Button variant="primary" onClick={handleCreateGenre} size="medium">
                        Create Genre
                     </Button>
                  )}
               </div>
            ) : (
               <div className="items-grid">
                  <AnimatePresence mode="popLayout">
                     {filteredGenres.map((genre) => (
                        <motion.div
                           key={genre.id}
                           layout
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ duration: 0.2 }}
                           className="item-card"
                        >
                           <div className="item-card-content">
                              <h3 className="item-name">{genre.name}</h3>
                              <p className="item-meta">
                                 Created {new Date(genre.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="item-card-actions">
                              <Button
                                 variant="edit"
                                 size="small"
                                 onClick={() => handleEditGenre(genre)}
                                 className="action-button"
                              >
                                 Edit
                              </Button>
                              <Button
                                 variant="danger"
                                 size="small"
                                 onClick={() => handleDeleteGenre(genre)}
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
         </section>

         {/* Tags Section */}
         <section className="manage-section">
            <div className="section-header">
               <div className="section-title-group">
                  <h2 className="section-title">Tags</h2>
                  <span className="section-count">({filteredTags.length})</span>
               </div>
               <div className="section-actions">
                  <SearchBar
                     value={tagSearchQuery}
                     onChange={setTagSearchQuery}
                     placeholder="Search tags..."
                     className="section-search"
                  />
                  <Button variant="primary" onClick={handleCreateTag} size="medium">
                     + Add Tag
                  </Button>
               </div>
            </div>

            {tagsLoading ? (
               <div className="loading-container">
                  <LoadingSpinner />
               </div>
            ) : filteredTags.length === 0 ? (
               <div className="empty-state">
                  <div className="empty-state-icon">🏷️</div>
                  <h3 className="empty-state-title">
                     {tagSearchQuery ? 'No tags found' : 'No tags yet'}
                  </h3>
                  <p className="empty-state-message">
                     {tagSearchQuery
                        ? 'Try adjusting your search query'
                        : 'Get started by creating your first tag'}
                  </p>
                  {!tagSearchQuery && (
                     <Button variant="primary" onClick={handleCreateTag} size="medium">
                        Create Tag
                     </Button>
                  )}
               </div>
            ) : (
               <div className="items-grid">
                  <AnimatePresence mode="popLayout">
                     {filteredTags.map((tag) => (
                        <motion.div
                           key={tag.id}
                           layout
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 0.9 }}
                           transition={{ duration: 0.2 }}
                           className="item-card"
                        >
                           <div className="item-card-content">
                              <h3 className="item-name">{tag.name}</h3>
                              {tag.type && <p className="item-type">Type: {tag.type}</p>}
                              <p className="item-meta">
                                 Created {new Date(tag.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="item-card-actions">
                              <Button
                                 variant="edit"
                                 size="small"
                                 onClick={() => handleEditTag(tag)}
                                 className="action-button"
                              >
                                 Edit
                              </Button>
                              <Button
                                 variant="danger"
                                 size="small"
                                 onClick={() => handleDeleteTag(tag)}
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
         </section>

         {/* Genre Modal */}
         <Modal
            isOpen={isGenreModalOpen}
            onClose={() => {
               setIsGenreModalOpen(false);
               setEditingGenre(null);
            }}
            title={editingGenre ? 'Edit Genre' : 'Create Genre'}
            size="small"
         >
            <GenreForm
               initialName={editingGenre?.name || ''}
               onSubmit={handleGenreSubmit}
               onCancel={() => {
                  setIsGenreModalOpen(false);
                  setEditingGenre(null);
               }}
               isLoading={isGenreSubmitting}
            />
         </Modal>

         {/* Tag Modal */}
         <Modal
            isOpen={isTagModalOpen}
            onClose={() => {
               setIsTagModalOpen(false);
               setEditingTag(null);
            }}
            title={editingTag ? 'Edit Tag' : 'Create Tag'}
            size="small"
         >
            <TagForm
               initialName={editingTag?.name || ''}
               onSubmit={handleTagSubmit}
               onCancel={() => {
                  setIsTagModalOpen(false);
                  setEditingTag(null);
               }}
               isLoading={isTagSubmitting}
            />
         </Modal>

         {/* Genre Delete Confirmation */}
         <ConfirmDialog
            isOpen={isGenreDeleteModalOpen}
            onClose={() => {
               setIsGenreDeleteModalOpen(false);
               setDeletingGenre(null);
            }}
            onConfirm={handleGenreDeleteConfirm}
            title="Delete Genre"
            message={`Are you sure you want to delete "${deletingGenre?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isGenreDeleting}
         />

         {/* Tag Delete Confirmation */}
         <ConfirmDialog
            isOpen={isTagDeleteModalOpen}
            onClose={() => {
               setIsTagDeleteModalOpen(false);
               setDeletingTag(null);
            }}
            onConfirm={handleTagDeleteConfirm}
            title="Delete Tag"
            message={`Are you sure you want to delete "${deletingTag?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            variant="danger"
            isLoading={isTagDeleting}
         />
      </div>
   );
};

export default ManageTab;

