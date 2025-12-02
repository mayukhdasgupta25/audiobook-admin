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

/**
 * API response structure for a single genre
 */
export interface GenreResponse {
   success: boolean;
   data: GenreItem;
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * API response structure for a single tag
 */
export interface TagResponse {
   success: boolean;
   data: TagItem;
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * Creates a new genre
 * @param name - The name of the genre
 * @returns Promise resolving to created genre or throwing an error
 */
export async function createGenre(name: string): Promise<GenreItem> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/genres/`, {
         method: 'POST',
         headers,
         body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to create genre',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const genreResponse = data as GenreResponse;
      return genreResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Updates an existing genre
 * @param id - The ID of the genre to update
 * @param name - The new name of the genre
 * @returns Promise resolving to updated genre or throwing an error
 */
export async function updateGenre(id: string, name: string): Promise<GenreItem> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/genres/${id}`, {
         method: 'PUT',
         headers,
         body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to update genre',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const genreResponse = data as GenreResponse;
      return genreResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Deletes a genre
 * @param id - The ID of the genre to delete
 * @returns Promise resolving to success response or throwing an error
 */
export async function deleteGenre(id: string): Promise<void> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/genres/${id}`, {
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
            message: data?.message || data?.error || 'Failed to delete genre',
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
 * Creates a new tag
 * @param name - The name of the tag
 * @param type - Optional type of the tag
 * @returns Promise resolving to created tag or throwing an error
 */
export async function createTag(name: string, type?: string): Promise<TagItem> {
   try {
      const headers = getAuthHeaders();

      const body: { name: string; type?: string } = { name };
      if (type) {
         body.type = type;
      }

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/tags/`, {
         method: 'POST',
         headers,
         body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to create tag',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const tagResponse = data as TagResponse;
      return tagResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Updates an existing tag
 * @param id - The ID of the tag to update
 * @param name - The new name of the tag
 * @param type - Optional new type of the tag
 * @returns Promise resolving to updated tag or throwing an error
 */
export async function updateTag(id: string, name: string, type?: string): Promise<TagItem> {
   try {
      const headers = getAuthHeaders();

      const body: { name: string; type?: string } = { name };
      if (type) {
         body.type = type;
      }

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/tags/${id}`, {
         method: 'PUT',
         headers,
         body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to update tag',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const tagResponse = data as TagResponse;
      return tagResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Deletes a tag
 * @param id - The ID of the tag to delete
 * @returns Promise resolving to success response or throwing an error
 */
export async function deleteTag(id: string): Promise<void> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/tags/${id}`, {
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
            message: data?.message || data?.error || 'Failed to delete tag',
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
 * Author item from API response
 */
export interface AuthorItem {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   address?: string;
   contact?: string;
   createdAt: string;
   updatedAt: string;
}

/**
 * API response structure for authors
 */
export interface AuthorsResponse {
   success: boolean;
   data: AuthorItem[];
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * API response structure for a single author
 */
export interface AuthorResponse {
   success: boolean;
   data: AuthorItem;
   message: string;
   statusCode: number;
   timestamp: string;
   path: string;
}

/**
 * Request interface for creating an author
 */
export interface CreateAuthorRequest {
   firstName: string;
   lastName: string;
   email: string;
   address?: string;
   contact?: string;
}

/**
 * Request interface for updating an author
 */
export interface UpdateAuthorRequest {
   firstName?: string;
   lastName?: string;
   email?: string;
   address?: string;
   contact?: string;
}

/**
 * Fetches authors from the API
 * @returns Promise resolving to authors response or throwing an error
 */
export async function getAuthors(): Promise<AuthorItem[]> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/authors`, {
         method: 'GET',
         headers,
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to fetch authors',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const authorsResponse = data as AuthorsResponse;
      return authorsResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Creates a new author
 * @param authorData - Author data to create
 * @returns Promise resolving to created author or throwing an error
 */
export async function createAuthor(authorData: CreateAuthorRequest): Promise<AuthorItem> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/authors/`, {
         method: 'POST',
         headers,
         body: JSON.stringify(authorData),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to create author',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const authorResponse = data as AuthorResponse;
      return authorResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Updates an existing author
 * @param id - The ID of the author to update
 * @param authorData - Author data to update
 * @returns Promise resolving to updated author or throwing an error
 */
export async function updateAuthor(id: string, authorData: UpdateAuthorRequest): Promise<AuthorItem> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/authors/${id}`, {
         method: 'PUT',
         headers,
         body: JSON.stringify(authorData),
      });

      const data = await response.json();

      if (!response.ok) {
         const error: ApiError = {
            message: data.message || data.error || 'Failed to update author',
            error: data.error,
            statusCode: response.status,
         };
         throw error;
      }

      const authorResponse = data as AuthorResponse;
      return authorResponse.data;
   } catch (error) {
      throw handleApiError(error);
   }
}

/**
 * Deletes an author
 * @param id - The ID of the author to delete
 * @returns Promise resolving to success response or throwing an error
 */
export async function deleteAuthor(id: string): Promise<void> {
   try {
      const headers = getAuthHeaders();

      const response = await fetch(`${getContentApiBaseUrl()}/api/v1/authors/${id}`, {
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
            message: data?.message || data?.error || 'Failed to delete author',
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
         if (audiobookData.narrators && audiobookData.narrators.length > 0) {
            formData.append('narrators', JSON.stringify(audiobookData.narrators));
         }
         formData.append('description', audiobookData.description);

         // Send genreIds as JSON array string
         formData.append('genreIds', JSON.stringify(audiobookData.genreIds));

         // Send tagIds as JSON array string
         formData.append('tagIds', JSON.stringify(audiobookData.tagIds));

         // Send meta as JSON object string if provided
         if (audiobookData.meta !== undefined && Object.keys(audiobookData.meta).length > 0) {
            formData.append('meta', JSON.stringify(audiobookData.meta));
         }

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
         if (audiobookData.narrators !== undefined && audiobookData.narrators.length > 0) {
            formData.append('narrators', JSON.stringify(audiobookData.narrators));
         }
         if (audiobookData.description !== undefined) {
            formData.append('description', audiobookData.description);
         }
         if (audiobookData.genreIds !== undefined && audiobookData.genreIds.length > 0) {
            formData.append('genreIds', JSON.stringify(audiobookData.genreIds));
         }
         if (audiobookData.tagIds !== undefined) {
            // Send tagIds as JSON array string
            formData.append('tagIds', JSON.stringify(audiobookData.tagIds));
         }
         if (audiobookData.meta !== undefined && Object.keys(audiobookData.meta).length > 0) {
            formData.append('meta', JSON.stringify(audiobookData.meta));
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
