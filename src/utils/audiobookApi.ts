import type { ApiError } from '../types/auth';
import type {
   CreateAudiobookRequest,
   UpdateAudiobookRequest,
   AudiobooksApiResponse,
   AudiobookApiResponse,
   CreateChapterRequest,
   UpdateChapterRequest,
   ChapterApiResponse,
   ChaptersApiResponse,
} from '../types/audiobook';
import { getContentApiBaseUrl, getAuthHeaders, getAuthHeadersForFileUpload, handleApiError } from './config';
import { getAccessToken } from './token';

/**
 * Genre item from API response
 */
export interface GenreItem {
   id: string;
   name: string;
   createdAt: string;
   updatedAt: string;
}

/**
 * Tag item from API response
 */
export interface TagItem {
   id: string;
   name: string;
   type: string;
   createdAt: string;
   updatedAt: string;
}

/**
 * API response structure for genres
 */
export interface GenresResponse {
   success: boolean;
   data: GenreItem[];
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * API response structure for tags
 */
export interface TagsResponse {
   success: boolean;
   data: TagItem[];
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * Fetches genres from the API
 * @returns Promise resolving to genres response or throwing an error
 */
export async function getGenres(): Promise<GenreItem[]> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/genres`, {
         method: 'GET',
         headers,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch genres',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const genresResponse = data as GenresResponse;
      return genresResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Fetches tags from the API
 * @returns Promise resolving to tags response or throwing an error
 */
export async function getTags(): Promise<TagItem[]> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/tags`, {
         method: 'GET',
         headers,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch tags',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const tagsResponse = data as TagsResponse;
      return tagsResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

export async function createAudiobook(
   audiobookData: CreateAudiobookRequest
): Promise<AudiobookApiResponse> {
   try {
      // If coverImage is provided, use FormData; otherwise use JSON
      // NOTE: Audiobook creation does NOT include audio files - only coverImage if provided
      // Multer on the backend should handle FormData with only coverImage (no audio files)
      if (audiobookData.coverImage) {
         const headers = getAuthHeadersForFileUpload();
         const formData = new FormData();

         // Text fields
         formData.append('title', audiobookData.title);
         formData.append('author', audiobookData.author);
         if (audiobookData.narrator) {
            formData.append('narrator', audiobookData.narrator);
         }
         formData.append('description', audiobookData.description);
         formData.append('genreId', audiobookData.genreId);

         // Send tagIds as JSON array string
         formData.append('tagIds', JSON.stringify(audiobookData.tagIds));

         // File field - only coverImage, NO audio files
         formData.append('coverImage', audiobookData.coverImage, audiobookData.coverImage.name);

         // Optional fields
         if (audiobookData.scheduledAt !== undefined) {
            formData.append('scheduledAt', audiobookData.scheduledAt);
         }

         const response = await fetch(`${getContentApiBaseUrl()}/api/v1/audiobooks`, {
            method: 'POST',
            headers,
            body: formData,
         });
         const data = await response.json();
         if (!response.ok) {
            const error: ApiError = {
               message: data.message || data.error || 'Failed to create audiobook',
               error: data.error,
               statusCode: response.status,
            };
            throw error;
         }
         if (data.success && data.data) {
            return data.data as AudiobookApiResponse;
         }
         return data as AudiobookApiResponse;
      } else {
         // No file, use JSON - exclude duration and fileSize
         const headers = getAuthHeaders();
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { duration, fileSize, ...jsonData } = audiobookData;
         const response = await fetch(`${getContentApiBaseUrl()}/api/v1/audiobooks`, {
            method: 'POST',
            headers,
            body: JSON.stringify(jsonData),
         });
         const data = await response.json();
         if (!response.ok) {
            const error: ApiError = {
               message: data.message || data.error || 'Failed to create audiobook',
               error: data.error,
               statusCode: response.status,
            };
            throw error;
         }
         if (data.success && data.data) {
            return data.data as AudiobookApiResponse;
         }
         return data as AudiobookApiResponse;
      }
   } catch (error) {
      throw handleApiError(error);
   }
}

export async function getAudiobooks(
   page?: number,
   active?: boolean,
   scheduled?: boolean
): Promise<AudiobooksApiResponse> {
   try {
      const headers = getAuthHeaders();
      let url = `${getContentApiBaseUrl()}/api/v1/audiobooks`;
      const queryParams: string[] = [];

      if (page) {
         queryParams.push(`page=${page}`);
      }
      if (active !== undefined) {
         queryParams.push(`active=${active}`);
      }
      if (scheduled !== undefined) {
         queryParams.push(`scheduled=${scheduled}`);
      }

      if (queryParams.length > 0) {
         url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url, {
         method: 'GET',
         headers,
      });
      const data = await response.json();
      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch audiobooks',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }
      return data as AudiobooksApiResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Updates an existing audiobook
 * @param audiobookData - Audiobook data to update (coverImage is optional)
 * @returns Promise resolving to updated audiobook response or throwing an error
 */
export async function updateAudiobook(
   audiobookData: UpdateAudiobookRequest
): Promise<AudiobookApiResponse> {
   try {
      // If coverImage is provided, use FormData; otherwise use JSON
      if (audiobookData.coverImage) {
         const headers = getAuthHeadersForFileUpload();
         const formData = new FormData();
         formData.append('audiobookId', audiobookData.audiobookId);

         if (audiobookData.title !== undefined) {
            formData.append('title', audiobookData.title);
         }
         if (audiobookData.author !== undefined) {
            formData.append('author', audiobookData.author);
         }
         if (audiobookData.narrator !== undefined) {
            formData.append('narrator', audiobookData.narrator);
         }
         if (audiobookData.description !== undefined) {
            formData.append('description', audiobookData.description);
         }
         if (audiobookData.genreId !== undefined) {
            formData.append('genreId', audiobookData.genreId);
         }
         if (audiobookData.tagIds !== undefined) {
            // Send tagIds as JSON array string
            formData.append('tagIds', JSON.stringify(audiobookData.tagIds));
         }
         formData.append('coverImage', audiobookData.coverImage);
         if (audiobookData.scheduledAt !== undefined) {
            formData.append('scheduledAt', audiobookData.scheduledAt);
         }

         const response = await fetch(`${getContentApiBaseUrl()}/api/v1/audiobooks/${audiobookData.audiobookId}`, {
            method: 'PUT',
            headers,
            body: formData,
         });
         const data = await response.json();
         if (!response.ok) {
            const error: ApiError = {
               message: data.message || data.error || 'Failed to update audiobook',
               error: data.error,
               statusCode: response.status,
            };
            throw error;
         }
         if (data.success && data.data) {
            return data.data as AudiobookApiResponse;
         }
         return data as AudiobookApiResponse;
      } else {
         // No file, use JSON - exclude duration and fileSize
         const headers = getAuthHeaders();
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         const { audiobookId, coverImage, duration, fileSize, ...jsonData } = audiobookData;
         const response = await fetch(`${getContentApiBaseUrl()}/api/v1/audiobooks/${audiobookId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(jsonData),
         });
         const data = await response.json();
         if (!response.ok) {
            const error: ApiError = {
               message: data.message || data.error || 'Failed to update audiobook',
               error: data.error,
               statusCode: response.status,
            };
            throw error;
         }
         if (data.success && data.data) {
            return data.data as AudiobookApiResponse;
         }
         return data as AudiobookApiResponse;
      }
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Deletes an audiobook
 * @param audiobookId - The ID of the audiobook to delete
 * @returns Promise resolving to success response or throwing an error
 */
export async function deleteAudiobook(audiobookId: string): Promise<void> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/audiobooks/${audiobookId}`, {
         method: 'DELETE',
         headers,
      });

      // DELETE requests may return empty body (204 No Content) or JSON
      let data: ApiError | null = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
         const text = await response.text();
         if (text.trim()) {
            try {
               data = JSON.parse(text) as ApiError;
            } catch {
               // Empty or invalid JSON - treat as success if status is ok
               data = null;
            }
         }
      }

      if (!response.ok) {
         const error: ApiError = {
            message: data?.message || data?.error || 'Failed to delete audiobook',
            error: data?.error || 'DeleteFailed',
            statusCode: response.status,
         };
         throw error;
      }
      // Success - DELETE operations may return empty body
   } catch (error) {
      // Only re-throw if it's not already an ApiError
      if (error && typeof error === 'object' && 'message' in error && 'error' in error) {
         throw error;
      }
      throw handleApiError(error);
   }
}

/**
 * Creates a new chapter for an audiobook
 * @param chapterData - Chapter data including file
 * @returns Promise resolving to created chapter response or throwing an error
 */
export async function createChapter(
   chapterData: CreateChapterRequest
): Promise<ChapterApiResponse> {
   try {
      // Always use FormData for chapter creation (file is required)
      const token = getAccessToken();
      if (!token) {
         throw {
            message: 'Access token not found. Please login again.',
            error: 'TokenNotFound',
         };
      }

      // Create clean headers object with ONLY Authorization
      // DO NOT include Content-Type - browser MUST set it automatically for FormData
      // If you set Content-Type manually, you must include the boundary, but the browser
      // generates a unique boundary automatically when you don't set Content-Type
      const headers: Record<string, string> = {
         Authorization: `Bearer ${token}`,
         // Content-Type is intentionally NOT set here - browser will set:
         // Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
      };

      // Create FormData for file upload
      const formData = new FormData();

      // Required fields - ensure they are strings and not empty
      formData.append('audiobookId', String(chapterData.audiobookId).trim());
      formData.append('title', String(chapterData.title).trim());
      formData.append('description', String(chapterData.description).trim());
      formData.append('chapterNumber', String(chapterData.chapterNumber));

      // File is required for creation
      if (!chapterData.file || !(chapterData.file instanceof File)) {
         throw {
            message: 'Audio file is required for chapter creation',
            error: 'FileRequired',
         };
      }
      formData.append('file', chapterData.file, chapterData.file.name);

      // Cover Image is required for creation
      if (!chapterData.coverImage || !(chapterData.coverImage instanceof File)) {
         throw {
            message: 'Cover image is required for chapter creation',
            error: 'CoverImageRequired',
         };
      }
      formData.append('coverImage', chapterData.coverImage, chapterData.coverImage.name);

      // Add optional fields only if they have valid values
      if (chapterData.duration !== undefined && chapterData.duration !== null && !isNaN(chapterData.duration)) {
         formData.append('duration', String(chapterData.duration));
      }
      if (chapterData.startPosition !== undefined && chapterData.startPosition !== null && !isNaN(chapterData.startPosition)) {
         formData.append('startPosition', String(chapterData.startPosition));
      }
      if (chapterData.endPosition !== undefined && chapterData.endPosition !== null && !isNaN(chapterData.endPosition)) {
         formData.append('endPosition', String(chapterData.endPosition));
      }
      if (chapterData.scheduledAt !== undefined && chapterData.scheduledAt !== null && chapterData.scheduledAt.trim() !== '') {
         formData.append('scheduledAt', String(chapterData.scheduledAt).trim());
      }

      // Use fetch with FormData - browser will automatically set Content-Type: multipart/form-data
      // with the correct boundary parameter. DO NOT set Content-Type manually.
      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/chapters`, {
         method: 'POST',
         headers,
         body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to create chapter',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      // Handle response structure
      if (data.success && data.data) {
         return data.data as ChapterApiResponse;
      }
      return data as ChapterApiResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Fetches chapters for a specific audiobook
 * @param audiobookId - The ID of the audiobook
 * @param page - Optional page number for pagination
 * @returns Promise resolving to chapters response or throwing an error
 */
export async function getChapters(
   audiobookId: string,
   page?: number
): Promise<ChaptersApiResponse> {
   try {
      const headers = getAuthHeaders();

      let url = `${getContentApiBaseUrl()}/api/v1/audiobooks/${audiobookId}/chapters`;
      if (page) {
         url += `?page=${page}`;
      }

      const response = await fetch(url, {
         method: 'GET',
         headers,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch chapters',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      return data as ChaptersApiResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Updates an existing chapter
 * @param chapterData - Chapter data to update (file is optional)
 * @returns Promise resolving to updated chapter response or throwing an error
 */
export async function updateChapter(
   chapterData: UpdateChapterRequest
): Promise<ChapterApiResponse> {
   try {
      // Check if we need FormData (if there are files to upload)
      const hasFiles = chapterData.file !== undefined || chapterData.coverImage !== undefined;

      let headers: HeadersInit;
      let body: FormData | string;

      if (hasFiles) {
         // Use FormData for file uploads
         headers = getAuthHeadersForFileUpload();
         const formData = new FormData();
         formData.append('chapterId', chapterData.chapterId);

         if (chapterData.title !== undefined) {
            formData.append('title', chapterData.title);
         }
         if (chapterData.description !== undefined) {
            formData.append('description', chapterData.description);
         }
         if (chapterData.chapterNumber !== undefined) {
            formData.append('chapterNumber', chapterData.chapterNumber.toString());
         }
         if (chapterData.file !== undefined) {
            formData.append('file', chapterData.file);
         }
         if (chapterData.duration !== undefined) {
            formData.append('duration', chapterData.duration.toString());
         }
         if (chapterData.startPosition !== undefined) {
            formData.append('startPosition', chapterData.startPosition.toString());
         }
         if (chapterData.endPosition !== undefined) {
            formData.append('endPosition', chapterData.endPosition.toString());
         }
         if (chapterData.scheduledAt !== undefined) {
            formData.append('scheduledAt', chapterData.scheduledAt);
         }
         if (chapterData.coverImage !== undefined) {
            formData.append('coverImage', chapterData.coverImage);
         }
         body = formData;
      } else {
         // Use JSON for non-file updates
         headers = getAuthHeaders();
         const jsonData: Record<string, unknown> = {
            chapterId: chapterData.chapterId,
         };

         if (chapterData.title !== undefined) {
            jsonData.title = chapterData.title;
         }
         if (chapterData.description !== undefined) {
            jsonData.description = chapterData.description;
         }
         if (chapterData.chapterNumber !== undefined) {
            jsonData.chapterNumber = chapterData.chapterNumber;
         }
         if (chapterData.duration !== undefined) {
            jsonData.duration = chapterData.duration;
         }
         if (chapterData.startPosition !== undefined) {
            jsonData.startPosition = chapterData.startPosition;
         }
         if (chapterData.endPosition !== undefined) {
            jsonData.endPosition = chapterData.endPosition;
         }
         if (chapterData.scheduledAt !== undefined) {
            jsonData.scheduledAt = chapterData.scheduledAt;
         }
         body = JSON.stringify(jsonData);
      }

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/chapters/${chapterData.chapterId}`, {
         method: 'PUT',
         headers,
         body,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to update chapter',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      // Handle response structure
      if (data.success && data.data) {
         return data.data as ChapterApiResponse;
      }
      return data as ChapterApiResponse;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Deletes a chapter
 * @param chapterId - The ID of the chapter to delete
 * @returns Promise resolving to success response or throwing an error
 */
export async function deleteChapter(chapterId: string): Promise<void> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/chapters/${chapterId}`, {
         method: 'DELETE',
         headers,
      });

      // DELETE requests may return empty body (204 No Content) or JSON
      let data: ApiError | null = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
         const text = await response.text();
         if (text.trim()) {
            try {
               data = JSON.parse(text) as ApiError;
            } catch {
               // Empty or invalid JSON - treat as success if status is ok
               data = null;
            }
         }
      }

      if (!response.ok) {
         const error: ApiError = {
            message: data?.message || data?.error || 'Failed to delete chapter',
            error: data?.error || 'DeleteFailed',
            statusCode: response.status,
         };
         throw error;
      }
      // Success - DELETE operations may return empty body
   } catch (error) {
      // Only re-throw if it's not already an ApiError
      if (error && typeof error === 'object' && 'message' in error && 'error' in error) {
         throw error;
      }
      throw handleApiError(error);
   }
}
