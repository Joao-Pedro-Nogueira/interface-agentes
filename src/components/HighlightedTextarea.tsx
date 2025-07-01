import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface HighlightedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

interface HighlightMatch {
  start: number;
  end: number;
  content: string;
  innerContent: string;
}

const HighlightedTextarea = React.forwardRef<HTMLTextAreaElement, HighlightedTextareaProps>(
  ({ value, onChange, onKeyDown, placeholder, rows = 12, className, id }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Forward ref to parent
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    // Find all matches of {{...}} pattern
    const findMatches = useCallback((text: string): HighlightMatch[] => {
      const regex = /\{\{([^}]+)\}\}/g;
      const matches: HighlightMatch[] = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[0],
          innerContent: match[1]
        });
      }

      return matches;
    }, []);

    // Handle backspace when cursor is before a highlight
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Backspace') {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPos = textarea.selectionStart;
        const matches = findMatches(value);
        
        // Check if cursor is immediately before a highlight
        const matchAtCursor = matches.find(match => match.start === cursorPos);
        
        if (matchAtCursor) {
          e.preventDefault();
          const newValue = value.slice(0, matchAtCursor.start) + value.slice(matchAtCursor.end);
          onChange(newValue);
          
          // Set cursor position after deletion
          setTimeout(() => {
            textarea.setSelectionRange(matchAtCursor.start, matchAtCursor.start);
          }, 0);
          return;
        }
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    }, [value, onChange, onKeyDown, findMatches]);

    // Render highlighted text
    const renderHighlightedText = useCallback(() => {
      const matches = findMatches(value);
      
      if (matches.length === 0) {
        return <span className="whitespace-pre-wrap break-words">{value}</span>;
      }

      const parts: React.ReactNode[] = [];
      let lastIndex = 0;

      matches.forEach((match, index) => {
        // Add text before match
        if (match.start > lastIndex) {
          parts.push(
            <span key={`text-${index}`} className="whitespace-pre-wrap break-words">
              {value.slice(lastIndex, match.start)}
            </span>
          );
        }

        // Add highlighted match (showing only inner content)
        parts.push(
          <span
            key={`highlight-${index}`}
            className="bg-blue-100 text-blue-800 px-1 rounded whitespace-pre-wrap break-words"
          >
            {match.innerContent}
          </span>
        );

        lastIndex = match.end;
      });

      // Add remaining text
      if (lastIndex < value.length) {
        parts.push(
          <span key="text-end" className="whitespace-pre-wrap break-words">
            {value.slice(lastIndex)}
          </span>
        );
      }

      return <>{parts}</>;
    }, [value, findMatches]);

    // Sync scroll position
    const handleScroll = useCallback(() => {
      const textarea = textareaRef.current;
      const overlay = overlayRef.current;
      
      if (textarea && overlay) {
        setScrollTop(textarea.scrollTop);
        setScrollLeft(textarea.scrollLeft);
      }
    }, []);

    // Apply scroll to overlay
    useEffect(() => {
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.scrollTop = scrollTop;
        overlay.scrollLeft = scrollLeft;
      }
    }, [scrollTop, scrollLeft]);

    // Sync styles between textarea and overlay
    useEffect(() => {
      const textarea = textareaRef.current;
      const overlay = overlayRef.current;
      
      if (textarea && overlay) {
        const computedStyle = window.getComputedStyle(textarea);
        
        // Apply critical styles from textarea to overlay
        overlay.style.fontFamily = computedStyle.fontFamily;
        overlay.style.fontSize = computedStyle.fontSize;
        overlay.style.fontWeight = computedStyle.fontWeight;
        overlay.style.lineHeight = computedStyle.lineHeight;
        overlay.style.letterSpacing = computedStyle.letterSpacing;
        overlay.style.wordSpacing = computedStyle.wordSpacing;
        overlay.style.padding = computedStyle.padding;
        overlay.style.border = computedStyle.border;
        overlay.style.borderWidth = computedStyle.borderWidth;
        overlay.style.borderStyle = computedStyle.borderStyle;
        overlay.style.borderColor = 'transparent';
        overlay.style.boxSizing = computedStyle.boxSizing;
        overlay.style.whiteSpace = 'pre-wrap';
        overlay.style.wordWrap = 'break-word';
        overlay.style.overflowWrap = 'break-word';
        overlay.style.width = computedStyle.width;
        overlay.style.height = computedStyle.height;
      }
    }, []);

    return (
      <div className="relative w-full">
        {/* Overlay with highlighted text */}
        <div
          ref={overlayRef}
          className={cn(
            "absolute inset-0 pointer-events-none overflow-hidden",
            "text-sm bg-transparent w-full text-gray-900",
            "whitespace-pre-wrap break-words",
            className
          )}
          style={{
            caretColor: 'transparent',
            resize: 'none',
            outline: 'none',
            border: 'none',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {renderHighlightedText()}
        </div>

        {/* Actual textarea (transparent text) */}
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            "relative bg-transparent text-transparent caret-black w-full",
            "resize-none outline-none",
            "px-3 py-2 text-sm",
            "border border-input rounded-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "whitespace-pre-wrap break-words",
            className
          )}
          style={{
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            wordSpacing: 'inherit',
            color: 'transparent',
            caretColor: 'black',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>
    );
  }
);

HighlightedTextarea.displayName = 'HighlightedTextarea';

export default HighlightedTextarea;
