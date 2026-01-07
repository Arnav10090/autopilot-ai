import { useEffect, useRef } from 'react';

export type KeyboardNavigationDirection = 'up' | 'down' | 'left' | 'right' | 'home' | 'end';

interface UseKeyboardNavigationOptions {
  onNavigate?: (direction: KeyboardNavigationDirection, currentIndex: number) => number;
  onSelect?: (index: number) => void;
  itemCount: number;
  disabled?: boolean;
  loop?: boolean;
}

/**
 * Hook to handle keyboard navigation for lists and menus
 * Supports arrow keys, home/end, and enter/space for selection
 */
export function useKeyboardNavigation({
  onNavigate,
  onSelect,
  itemCount,
  disabled = false,
  loop = true,
}: UseKeyboardNavigationOptions) {
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (disabled || itemCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      let newIndex = currentIndexRef.current;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newIndex = loop
            ? (currentIndexRef.current - 1 + itemCount) % itemCount
            : Math.max(0, currentIndexRef.current - 1);
          onNavigate?.('up', currentIndexRef.current);
          break;

        case 'ArrowDown':
          e.preventDefault();
          newIndex = loop
            ? (currentIndexRef.current + 1) % itemCount
            : Math.min(itemCount - 1, currentIndexRef.current + 1);
          onNavigate?.('down', currentIndexRef.current);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          newIndex = loop
            ? (currentIndexRef.current - 1 + itemCount) % itemCount
            : Math.max(0, currentIndexRef.current - 1);
          onNavigate?.('left', currentIndexRef.current);
          break;

        case 'ArrowRight':
          e.preventDefault();
          newIndex = loop
            ? (currentIndexRef.current + 1) % itemCount
            : Math.min(itemCount - 1, currentIndexRef.current + 1);
          onNavigate?.('right', currentIndexRef.current);
          break;

        case 'Home':
          e.preventDefault();
          newIndex = 0;
          onNavigate?.('home', currentIndexRef.current);
          break;

        case 'End':
          e.preventDefault();
          newIndex = itemCount - 1;
          onNavigate?.('end', currentIndexRef.current);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect?.(currentIndexRef.current);
          return;

        default:
          return;
      }

      currentIndexRef.current = newIndex;
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [itemCount, disabled, loop, onNavigate, onSelect]);

  return {
    currentIndex: currentIndexRef.current,
    setCurrentIndex: (index: number) => {
      currentIndexRef.current = Math.max(0, Math.min(itemCount - 1, index));
    },
  };
}

/**
 * Hook for managing ARIA live region announcements
 */
export function useAriaLiveRegion() {
  const regionRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (regionRef.current) {
      regionRef.current.setAttribute('aria-live', priority);
      regionRef.current.textContent = message;
    }
  };

  return { regionRef, announce };
}

/**
 * Hook for managing focus management
 */
export function useFocusManagement(containerRef: React.RefObject<HTMLElement>) {
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(focusableSelector));
  };

  const focusElement = (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  };

  const focusFirst = () => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      focusElement(elements[0]);
    }
  };

  const focusLast = () => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      focusElement(elements[elements.length - 1]);
    }
  };

  const focusNext = () => {
    const elements = getFocusableElements();
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    if (currentIndex < elements.length - 1) {
      focusElement(elements[currentIndex + 1]);
    }
  };

  const focusPrevious = () => {
    const elements = getFocusableElements();
    const currentElement = document.activeElement as HTMLElement;
    const currentIndex = elements.indexOf(currentElement);
    if (currentIndex > 0) {
      focusElement(elements[currentIndex - 1]);
    }
  };

  return {
    focusableElements: getFocusableElements,
    focusElement,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
  };
}
