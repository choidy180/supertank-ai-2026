import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean, onEscape?: () => void) => {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isLocked, onEscape]);
};
