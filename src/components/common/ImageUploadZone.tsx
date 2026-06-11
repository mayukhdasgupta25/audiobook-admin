import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { CloudUpload, X } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface ImageUploadZoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  previewUrl?: string | null;
  compact?: boolean;
  showPreview?: boolean;
}

function ImageUploadZone({
  value,
  onChange,
  disabled = false,
  previewUrl,
  compact = false,
  showPreview = true,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const validateAndSet = (file: File | null) => {
    setError('');
    if (!file) {
      onChange(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WebP image');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Image must be smaller than 5 MB');
      return;
    }
    onChange(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    validateAndSet(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) {
      return;
    }
    const file = event.dataTransfer.files?.[0] ?? null;
    validateAndSet(file);
  };

  const objectPreview = showPreview
    ? previewUrl ?? (value ? URL.createObjectURL(value) : null)
    : null;

  const clearFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`image-upload-zone${compact ? ' image-upload-zone--compact' : ''}`}>
      <div
        className={`image-upload-dropzone${compact ? ' image-upload-dropzone--compact' : ''}${dragOver ? ' image-upload-dropzone--active' : ''}`}
        onDragOver={event => {
          event.preventDefault();
          if (!disabled) {
            setDragOver(true);
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload organization logo"
      >
        <CloudUpload size={compact ? 22 : 28} className="image-upload-icon" />
        <p className="image-upload-text">
          {compact ? (
            <>
              <span className="image-upload-link">Click to browse</span> or drag
              &amp; drop
            </>
          ) : (
            <>
              Drag &amp; drop your image here or{' '}
              <span className="image-upload-link">click to browse</span>
            </>
          )}
        </p>
        {!compact && (
          <p className="image-upload-hint">Recommended: Square JPG, PNG (512×512)</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="image-upload-input"
          onChange={handleFileChange}
          disabled={disabled}
          tabIndex={-1}
        />
      </div>

      {objectPreview && (
        <div className="image-upload-preview">
          <img src={objectPreview} alt="Uploaded image preview" />
          <button
            type="button"
            className="image-upload-remove"
            onClick={event => {
              event.stopPropagation();
              clearFile();
            }}
            disabled={disabled}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!showPreview && value && (
        <div className="image-upload-selected">
          <span className="image-upload-selected-name">{value.name}</span>
          <button
            type="button"
            className="image-upload-selected-remove"
            onClick={event => {
              event.stopPropagation();
              clearFile();
            }}
            disabled={disabled}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && <span className="partner-error-message">{error}</span>}
    </div>
  );
}

export default ImageUploadZone;
