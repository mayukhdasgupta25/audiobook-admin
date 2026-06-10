import { useEffect, useRef, useState } from 'react';
import '../../styles/components/common/FieldErrorHint.css';

interface FieldErrorHintProps {
  message?: string;
}

function FieldErrorHint({ message }: FieldErrorHintProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    document.addEventListener('keydown', handleEscape);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [message]);

  if (!message) {
    return null;
  }

  const toggle = () => {
    setOpen(current => !current);
  };

  return (
    <span
      ref={containerRef}
      className="field-error-hint"
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={message}
      onClick={event => {
        event.stopPropagation();
        toggle();
      }}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
    >
      <span className="field-error-hint-icon" aria-hidden="true">
        i
      </span>
      {open && (
        <span className="field-error-hint-popover" role="tooltip">
          {message}
        </span>
      )}
    </span>
  );
}

export default FieldErrorHint;
