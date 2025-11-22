/**
 * Audiobook Form component
 */

import React, { useState, FormEvent, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchGenres } from '../../../../store/slices/genresSlice';
import { fetchTags } from '../../../../store/slices/tagsSlice';
import { createAudiobookThunk, updateAudiobookThunk, fetchAudiobooks } from '../../../../store/slices/audiobooksSlice';
import type { AudiobookFormData, AudiobookApiResponse } from '../../../../types/audiobook';
import Button from '../../../../components/common/Button';
import Select from '../../../../components/common/Select';
import { showApiError } from '../../../../utils/toast';
import '../../../../styles/pages/audiobooks/components/forms/AudiobookForm.css';

interface AudiobookFormProps {
   audiobookId?: string;
   initialData?: AudiobookApiResponse;
   onSuccess?: () => void;
   onCancel?: () => void;
}

const AudiobookForm: React.FC<AudiobookFormProps> = ({ audiobookId, initialData, onSuccess, onCancel }) => {
   const dispatch = useAppDispatch();
   const { genres, loading: genresLoading } = useAppSelector((state) => state.genres);
   const { tags, loading: tagsLoading } = useAppSelector((state) => state.tags);
   const { loading: isCreating, filter } = useAppSelector((state) => state.audiobooks);
   const isEditMode = !!audiobookId && !!initialData;

   // Initialize form data from initialData if provided
   const getInitialFormData = (): AudiobookFormData => {
      if (initialData) {
         return {
            title: initialData.title || '',
            author: initialData.author || '',
            narrator: initialData.narrator || '',
            description: initialData.description || '',
            genre: initialData.genre?.name ? genres.find((g) => g.name === initialData.genre?.name)?.id || '' : '',
            tags: initialData.audiobookTags?.map((tag) => tags.find((t) => t.name === tag.name)?.id || '').filter((id) => id) || [],
            coverImage: null,
            scheduledAt: undefined, // Note: scheduledAt may not be in API response
         };
      }
      return {
         title: '',
         author: '',
         narrator: '',
         description: '',
         genre: '',
         tags: [],
         coverImage: null,
         scheduledAt: undefined,
      };
   };

   const [formData, setFormData] = useState<AudiobookFormData>(getInitialFormData());

   const [errors, setErrors] = useState<Partial<Record<keyof AudiobookFormData, string>>>({});

   // Fetch genres and tags on mount
   useEffect(() => {
      if (genres.length === 0) {
         dispatch(fetchGenres());
      }
      if (tags.length === 0) {
         dispatch(fetchTags());
      }
   }, [dispatch, genres.length, tags.length]);

   // Update form data when initialData or genres/tags change (for edit mode)
   useEffect(() => {
      if (initialData && genres.length > 0 && tags.length > 0) {
         setFormData({
            title: initialData.title || '',
            author: initialData.author || '',
            narrator: initialData.narrator || '',
            description: initialData.description || '',
            genre: genres.find((g) => g.name === initialData.genre?.name)?.id || '',
            tags: initialData.audiobookTags?.map((tag) => tags.find((t) => t.name === tag.name)?.id || '').filter((id) => id) || [],
            coverImage: null,
            scheduledAt: undefined,
         });
      }
   }, [initialData, genres, tags]);

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors({});

      // Validate form
      const newErrors: Partial<Record<keyof AudiobookFormData, string>> = {};

      if (!formData.title.trim()) {
         newErrors.title = 'Title is required';
      }

      if (!formData.author.trim()) {
         newErrors.author = 'Author is required';
      }

      if (!formData.description.trim()) {
         newErrors.description = 'Description is required';
      }

      if (!formData.genre) {
         newErrors.genre = 'Genre is required';
      }

      if (formData.tags.length === 0) {
         newErrors.tags = 'At least one tag is required';
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      try {
         if (isEditMode && audiobookId) {
            // Update mode
            const updateRequest: {
               audiobookId: string;
               title: string;
               author: string;
               narrator?: string;
               description: string;
               genreId: string;
               tagIds: string[];
               duration: number;
               fileSize: number;
               scheduledAt?: string;
               coverImage?: File;
            } = {
               audiobookId,
               title: formData.title.trim(),
               author: formData.author.trim(),
               narrator: formData.narrator.trim() || undefined,
               description: formData.description.trim(),
               genreId: formData.genre,
               tagIds: formData.tags,
               duration: 0,
               fileSize: 0,
               scheduledAt: formData.scheduledAt,
            };

            // Only include coverImage if a new one is provided
            if (formData.coverImage) {
               updateRequest.coverImage = formData.coverImage;
            }

            await dispatch(updateAudiobookThunk(updateRequest)).unwrap();
            await dispatch(fetchAudiobooks({ page: 1, filter }));
         } else {
            // Create mode
            const createRequest = {
               title: formData.title.trim(),
               author: formData.author.trim(),
               narrator: formData.narrator.trim() || undefined,
               description: formData.description.trim(),
               genreId: formData.genre,
               tagIds: formData.tags,
               duration: 0,
               fileSize: 0,
               coverImage: formData.coverImage || undefined,
            };

            await dispatch(createAudiobookThunk(createRequest)).unwrap();
            await dispatch(fetchAudiobooks({ page: 1, filter }));

            // Reset form only in create mode
            setFormData({
               title: '',
               author: '',
               narrator: '',
               description: '',
               genre: '',
               tags: [],
               coverImage: null,
               scheduledAt: undefined,
            });
         }

         if (onSuccess) {
            onSuccess();
         }
      } catch (error) {
         showApiError(error);
      }
   };

   const handleSchedule = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setErrors({});

      // Validate form
      const newErrors: Partial<Record<keyof AudiobookFormData, string>> = {};

      if (!formData.title.trim()) {
         newErrors.title = 'Title is required';
      }

      if (!formData.author.trim()) {
         newErrors.author = 'Author is required';
      }

      if (!formData.description.trim()) {
         newErrors.description = 'Description is required';
      }

      if (!formData.genre) {
         newErrors.genre = 'Genre is required';
      }

      if (formData.tags.length === 0) {
         newErrors.tags = 'At least one tag is required';
      }

      if (!formData.scheduledAt) {
         newErrors.scheduledAt = 'Schedule date and time is required';
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      try {
         if (isEditMode && audiobookId) {
            // Update mode with schedule
            const updateRequest: {
               audiobookId: string;
               title: string;
               author: string;
               narrator?: string;
               description: string;
               genreId: string;
               tagIds: string[];
               duration: number;
               fileSize: number;
               scheduledAt?: string;
               coverImage?: File;
            } = {
               audiobookId,
               title: formData.title.trim(),
               author: formData.author.trim(),
               narrator: formData.narrator.trim() || undefined,
               description: formData.description.trim(),
               genreId: formData.genre,
               tagIds: formData.tags,
               duration: 0,
               fileSize: 0,
               scheduledAt: formData.scheduledAt,
            };

            if (formData.coverImage) {
               updateRequest.coverImage = formData.coverImage;
            }

            await dispatch(updateAudiobookThunk(updateRequest)).unwrap();
            await dispatch(fetchAudiobooks({ page: 1, filter }));
         } else {
            // Create mode with schedule
            const createRequest = {
               title: formData.title.trim(),
               author: formData.author.trim(),
               narrator: formData.narrator.trim() || undefined,
               description: formData.description.trim(),
               genreId: formData.genre,
               tagIds: formData.tags,
               duration: 0,
               fileSize: 0,
               coverImage: formData.coverImage || undefined,
               scheduledAt: formData.scheduledAt,
            };

            await dispatch(createAudiobookThunk(createRequest)).unwrap();
            await dispatch(fetchAudiobooks({ page: 1, filter }));

            // Reset form only in create mode
            setFormData({
               title: '',
               author: '',
               narrator: '',
               description: '',
               genre: '',
               tags: [],
               coverImage: null,
               scheduledAt: undefined,
            });
         }

         if (onSuccess) {
            onSuccess();
         }
      } catch (error) {
         showApiError(error);
      }
   };

   const handleTagToggle = (tagId: string) => {
      if (formData.tags.includes(tagId)) {
         setFormData({
            ...formData,
            tags: formData.tags.filter((t) => t !== tagId),
         });
      } else {
         setFormData({
            ...formData,
            tags: [...formData.tags, tagId],
         });
      }
      if (errors.tags) {
         setErrors({ ...errors, tags: '' });
      }
   };

   return (
      <form onSubmit={handleSubmit} className="audiobook-form">
         <div className="form-group">
            <label htmlFor="title">
               Title <span className="required">*</span>
            </label>
            <input
               id="title"
               type="text"
               value={formData.title}
               onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: '' });
               }}
               placeholder="Enter audiobook title"
               className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="author">
               Author <span className="required">*</span>
            </label>
            <input
               id="author"
               type="text"
               value={formData.author}
               onChange={(e) => {
                  setFormData({ ...formData, author: e.target.value });
                  setErrors({ ...errors, author: '' });
               }}
               placeholder="Enter author name"
               className={errors.author ? 'input-error' : ''}
            />
            {errors.author && <span className="error-message">{errors.author}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="narrator">Narrator</label>
            <input
               id="narrator"
               type="text"
               value={formData.narrator}
               onChange={(e) => setFormData({ ...formData, narrator: e.target.value })}
               placeholder="Enter narrator name (optional)"
            />
         </div>

         <div className="form-group">
            <label htmlFor="description">
               Description <span className="required">*</span>
            </label>
            <textarea
               id="description"
               value={formData.description}
               onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setErrors({ ...errors, description: '' });
               }}
               placeholder="Enter audiobook description"
               rows={5}
               className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="coverImage">
               Cover Image {!isEditMode && <span className="required">*</span>}
               {isEditMode && <span className="optional-text">(optional - leave empty to keep current image)</span>}
            </label>
            {isEditMode && initialData?.coverImage && !formData.coverImage && (
               <div className="current-image-preview">
                  <img src={initialData.coverImage} alt="Current cover" style={{ maxWidth: '200px', maxHeight: '200px', marginBottom: '8px' }} />
                  <p className="current-image-text">Current cover image</p>
               </div>
            )}
            <input
               id="coverImage"
               type="file"
               accept="image/*"
               onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, coverImage: file });
               }}
               className="file-input"
            />
            {formData.coverImage && (
               <div className="file-preview">
                  <span className="file-name">{formData.coverImage.name}</span>
                  <button
                     type="button"
                     className="file-remove"
                     onClick={() => setFormData({ ...formData, coverImage: null })}
                  >
                     Remove
                  </button>
               </div>
            )}
         </div>

         <div className="form-group">
            <label htmlFor="genre">
               Genre <span className="required">*</span>
            </label>
            <Select
               id="genre"
               value={formData.genre}
               onChange={(e) => {
                  setFormData({ ...formData, genre: e.target.value });
                  setErrors({ ...errors, genre: '' });
               }}
               options={genres.map((genre) => ({
                  value: genre.id,
                  label: genre.name,
               }))}
               placeholder="Select a genre"
               error={!!errors.genre}
               loading={genresLoading}
            />
            {errors.genre && <span className="error-message">{errors.genre}</span>}
         </div>

         <div className="form-group">
            <label>
               Tags <span className="required">*</span>
            </label>
            {tagsLoading ? (
               <div className="loading-message">Loading tags...</div>
            ) : (
               <div className="tags-container">
                  {tags.map((tag) => (
                     <label key={tag.id} className="tag-checkbox">
                        <input
                           type="checkbox"
                           checked={formData.tags.includes(tag.id)}
                           onChange={() => handleTagToggle(tag.id)}
                        />
                        <span>{tag.name}</span>
                     </label>
                  ))}
               </div>
            )}
            {errors.tags && <span className="error-message">{errors.tags}</span>}
         </div>

         <div className="form-group">
            <label htmlFor="audiobook-schedule-at">Schedule at</label>
            <DatePicker
               id="audiobook-schedule-at"
               selected={formData.scheduledAt ? new Date(formData.scheduledAt) : null}
               onChange={(date: Date | null) => {
                  if (date) {
                     // Convert Date to datetime-local format (YYYY-MM-DDTHH:mm)
                     const year = date.getFullYear();
                     const month = String(date.getMonth() + 1).padStart(2, '0');
                     const day = String(date.getDate()).padStart(2, '0');
                     const hours = String(date.getHours()).padStart(2, '0');
                     const minutes = String(date.getMinutes()).padStart(2, '0');
                     const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                     setFormData({ ...formData, scheduledAt: formattedDate });
                  } else {
                     setFormData({ ...formData, scheduledAt: undefined });
                  }
                  setErrors({ ...errors, scheduledAt: '' });
               }}
               showTimeSelect
               timeFormat="HH:mm"
               timeIntervals={15}
               dateFormat="MMMM d, yyyy h:mm aa"
               placeholderText="Select date and time"
               className={`date-picker-input ${errors.scheduledAt ? 'input-error' : ''}`}
               minDate={new Date()}
               isClearable
            />
            {errors.scheduledAt && <span className="error-message">{errors.scheduledAt}</span>}
         </div>

         <div className="form-actions">
            {onCancel && (
               <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
               </Button>
            )}
            <Button
               type="button"
               variant="warning"
               onClick={handleSchedule}
               disabled={!formData.scheduledAt || isCreating}
               isLoading={isCreating}
            >
               Schedule
            </Button>
            <Button type="submit" disabled={!!formData.scheduledAt || isCreating} isLoading={isCreating}>
               {isEditMode ? 'Update Audiobook' : 'Create Audiobook'}
            </Button>
         </div>
      </form>
   );
};

export default AudiobookForm;
