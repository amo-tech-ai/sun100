
import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  speed?: number;
  onComplete?: () => void;
  startDelay?: number;
}

export const useTypewriter = (text: string | undefined | null, options: UseTypewriterOptions = {}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { speed = 10, onComplete, startDelay = 0 } = options;
  
  const index = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Reset if text changes radically, but allow for stable re-renders
    if (text !== undefined && text !== null && !hasStartedRef.current) {
      hasStartedRef.current = true;
      setDisplayedText('');
      index.current = 0;
      setIsTyping(true);

      const startTyping = () => {
        const typeChar = () => {
          if (index.current < text.length) {
            setDisplayedText((prev) => prev + text.charAt(index.current));
            index.current += 1;
            
            // Variable speed for realism (faster on spaces/punctuation)
            let currentSpeed = speed;
            const char = text.charAt(index.current);
            if (char === ' ' || char === '\n') currentSpeed = speed / 2;
            if (char === '.' || char === ',') currentSpeed = speed * 3;

            timeoutRef.current = window.setTimeout(typeChar, currentSpeed);
          } else {
            setIsTyping(false);
            if (onComplete) onComplete();
          }
        };
        typeChar();
      };

      if (startDelay > 0) {
        timeoutRef.current = window.setTimeout(startTyping, startDelay);
      } else {
        startTyping();
      }
    } else if (!text) {
        setDisplayedText('');
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, onComplete, startDelay]);

  return { displayedText, isTyping };
};
