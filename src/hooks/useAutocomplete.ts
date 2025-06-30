
import { useState, useRef, useCallback } from 'react';

interface UseAutocompleteProps {
  onInsert: (value: string, position: number) => void;
}

export function useAutocomplete({ onInsert }: UseAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const calculateCursorPosition = useCallback((textarea: HTMLTextAreaElement) => {
    const rect = textarea.getBoundingClientRect();
    const style = window.getComputedStyle(textarea);
    
    // Create a mirror div to calculate text position
    const mirror = document.createElement('div');
    mirror.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${textarea.clientWidth}px;
      height: auto;
      font: ${style.font};
      padding: ${style.padding};
      border: ${style.border};
      box-sizing: ${style.boxSizing};
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      line-height: ${style.lineHeight};
    `;
    
    document.body.appendChild(mirror);
    
    const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
    mirror.textContent = textBeforeCursor;
    
    // Add a span at the cursor position
    const span = document.createElement('span');
    span.textContent = '|';
    mirror.appendChild(span);
    
    const mirrorRect = mirror.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    
    // Calculate position relative to textarea
    const x = rect.left + (spanRect.left - mirrorRect.left) + textarea.scrollLeft;
    const y = rect.top + (spanRect.top - mirrorRect.top) + textarea.scrollTop + parseInt(style.lineHeight || '20');
    
    document.body.removeChild(mirror);
    
    return { x, y };
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    
    if (e.key === '@') {
      console.log('@ key pressed, triggering autocomplete');
      
      // Use setTimeout to ensure the '@' character is inserted first
      setTimeout(() => {
        const cursorPos = textarea.selectionStart;
        console.log('Cursor position:', cursorPos);
        
        try {
          const pos = calculateCursorPosition(textarea);
          console.log('Calculated position:', pos);
          
          setPosition(pos);
          setCursorPosition(cursorPos);
          setIsOpen(true);
        } catch (error) {
          console.error('Error calculating cursor position:', error);
          // Fallback positioning
          const rect = textarea.getBoundingClientRect();
          setPosition({
            x: rect.left + 20,
            y: rect.top + rect.height + 5
          });
          setCursorPosition(cursorPos);
          setIsOpen(true);
        }
      }, 10);
    }
  }, [calculateCursorPosition]);

  const handleSelect = useCallback((value: string) => {
    console.log('Selected value:', value, 'at position:', cursorPosition);
    
    if (textareaRef.current) {
      // Remove the '@' character and insert the selected value
      onInsert(value, cursorPosition - 1); // -1 to account for the '@' character
      setIsOpen(false);
    }
  }, [onInsert, cursorPosition]);

  const handleClose = useCallback(() => {
    console.log('Closing autocomplete modal');
    setIsOpen(false);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node;
    if (textareaRef.current && !textareaRef.current.contains(target)) {
      // Check if click is inside the modal
      const modal = document.querySelector('[data-autocomplete-modal]');
      if (!modal || !modal.contains(target)) {
        setIsOpen(false);
      }
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
