import { useState, useEffect, useRef } from 'react';

// Custom hook for detecting when an element is on screen
// FIX: Made the hook generic to support different HTML element types.
const useOnScreen = <T extends Element>(options: IntersectionObserverInit) => {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }, options);

        const currentElement = ref.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options, ref]);

    return [ref, isVisible] as const;
};

export default useOnScreen;