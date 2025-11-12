import React, { useState, useEffect, useRef } from 'react';
import useOnScreen from '../hooks/useOnScreen';

const AnimatedCounter: React.FC<{ value: number, duration?: number, suffix?: string, prefix?: string }> = ({ value, duration = 2000, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    // FIX: Specified the generic type for useOnScreen to match the `span` element.
    const [ref, isVisible] = useOnScreen<HTMLSpanElement>({ threshold: 0.5 });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isVisible && !hasAnimated.current) {
            hasAnimated.current = true;
            let start = 0;
            const end = value;
            if (start === end) return;

            let startTime: number | null = null;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * (end - start) + start));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [isVisible, value, duration]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

export default AnimatedCounter;