
import { useState, useRef, useCallback } from 'react';

interface UseAutocompleteProps {
  onInsert: (value: string, position: number) => void;
}

export function useAutocomplete({ onInsert }: UseAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Get cursor position in pixels
      setTimeout(() => {
        const rect = textarea.getBoundingClientRect();
        const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
        
        // Create a temporary div to measure text position
        const div = document.createElement('div');
        const styles = window.getComputedStyle(textarea);
        
        div.style.position = 'absolute';
        div.style.visibility = 'hidden';
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.style.font = styles.font;
        div.style.padding = styles.padding;
        div.style.border = styles.border;
        div.style.width = textarea.offsetWidth + 'px';
        
        document.body.appendChild(div);
        div.textContent = textBeforeCursor;
        
        const span = document.createElement('span');
        span.textContent = '@';
        div.appendChild(span);
        
        const spanRect = span.getBoundingClientRect();
        
        setPosition({
          x: spanRect.left,
          y: spanRect.bottom + 5
        });
        
        document.body.removeChild(div);
        
        setCursorPosition(textarea.selectionStart);
        setIsOpen(true);
      }, 0);
    }
  }, []);

  const handleSelect = useCallback((value: string) => {
    if (textareaRef.current) {
      onInsert(value, cursorPosition);
      setIsOpen(false);
    }
  }, [onInsert, cursorPosition]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  return {
    isOpen,
    position,
    textareaRef,
    handleKeyDown,
    handleSelect,
    handleClose,
    handleClickOutside
  };
}
