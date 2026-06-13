import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

export interface TableActionsMenuItem {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface TableActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  items: TableActionsMenuItem[];
}

const MENU_MIN_WIDTH = 148;
const MENU_ITEM_HEIGHT = 40;
const VIEWPORT_PADDING = 8;

function TableActionsMenu({
  isOpen,
  onClose,
  anchorRef,
  items,
}: TableActionsMenuProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const menuHeight = items.length * MENU_ITEM_HEIGHT + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + VIEWPORT_PADDING;

    const top = openUpward
      ? rect.top - menuHeight - 4
      : rect.bottom + 4;

    const left = Math.min(
      Math.max(VIEWPORT_PADDING, rect.right - MENU_MIN_WIDTH),
      window.innerWidth - MENU_MIN_WIDTH - VIEWPORT_PADDING
    );

    setPosition({ top, left });
  }, [anchorRef, items.length]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }
    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        anchorRef.current?.contains(target) ||
        document.getElementById('table-actions-menu-portal')?.contains(target)
      ) {
        return;
      }
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleReposition = () => updatePosition();

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [anchorRef, isOpen, onClose, updatePosition]);

  if (!isOpen || !position) {
    return null;
  }

  return createPortal(
    <div
      id="table-actions-menu-portal"
      className="table-actions-menu"
      style={{ top: position.top, left: position.left }}
      role="menu"
    >
      {items.map(item => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          className={
            item.variant === 'danger'
              ? 'table-actions-menu-item table-actions-menu-item--danger'
              : 'table-actions-menu-item'
          }
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
}

export default TableActionsMenu;
