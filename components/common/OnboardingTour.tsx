
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
    steps: TourStep[];
    isOpen: boolean;
    onComplete: () => void;
    onSkip: () => void;
}

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
);

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, isOpen, onComplete, onSkip }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [step, setStep] = useState<TourStep | null>(null);

    const updatePosition = useCallback(() => {
        if (!isOpen || !steps[currentStepIndex]) return;
        
        const currentStep = steps[currentStepIndex];
        const element = document.getElementById(currentStep.targetId);
        
        if (element) {
            const rect = element.getBoundingClientRect();
            setTargetRect(rect);
            setStep(currentStep);
            
            // Scroll into view if needed
            element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        } else {
            // If element not found, skip to next or finish
            console.warn(`Tour target #${currentStep.targetId} not found.`);
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }
    }, [isOpen, currentStepIndex, steps, onComplete]);

    useEffect(() => {
        if (isOpen) {
            // Initial delay to allow rendering
            const timer = setTimeout(updatePosition, 500);
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
            
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen, updatePosition]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    if (!isOpen || !targetRect || !step) return null;

    // Calculate tooltip position
    const tooltipStyle: React.CSSProperties = {
        position: 'fixed',
        zIndex: 9999,
        width: '320px',
    };

    const PADDING = 16;
    const position = step.position || 'bottom';

    if (position === 'bottom') {
        tooltipStyle.top = targetRect.bottom + PADDING;
        tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 160;
    } else if (position === 'top') {
        tooltipStyle.bottom = window.innerHeight - targetRect.top + PADDING;
        tooltipStyle.left = targetRect.left + (targetRect.width / 2) - 160;
    } else if (position === 'left') {
        tooltipStyle.right = window.innerWidth - targetRect.left + PADDING;
        tooltipStyle.top = targetRect.top + (targetRect.height / 2) - 100;
    } else if (position === 'right') {
        tooltipStyle.left = targetRect.right + PADDING;
        tooltipStyle.top = targetRect.top + (targetRect.height / 2) - 100;
    }

    // Ensure tooltip stays within viewport (basic clamping)
    if (typeof tooltipStyle.left === 'number') {
        tooltipStyle.left = Math.max(10, Math.min(window.innerWidth - 330, tooltipStyle.left));
    }

    return createPortal(
        <>
            {/* Backdrop with hole (using box-shadow trick) */}
            <div 
                className="fixed inset-0 z-[9998] pointer-events-none transition-all duration-500 ease-in-out"
                style={{
                    boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.6)`,
                    borderRadius: '8px',
                    left: targetRect.left - 4,
                    top: targetRect.top - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />
            
            {/* Spotlight Border */}
            <div 
                className="fixed z-[9998] pointer-events-none border-2 border-brand-orange rounded-lg transition-all duration-500 ease-in-out animate-pulse"
                style={{
                    left: targetRect.left - 4,
                    top: targetRect.top - 4,
                    width: targetRect.width + 8,
                    height: targetRect.height + 8,
                }}
            />

            {/* Tooltip */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-5 transition-all duration-500 ease-in-out animate-fade-in-up" style={tooltipStyle}>
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg mt-1">
                        <SparklesIcon />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-gray-900 text-lg">{step.title}</h4>
                            <span className="text-xs font-semibold text-gray-400">{currentStepIndex + 1} / {steps.length}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{step.content}</p>
                        <div className="flex items-center justify-between mt-2">
                            <button 
                                onClick={onSkip} 
                                className="text-xs font-bold text-gray-400 hover:text-gray-600"
                            >
                                Skip Tour
                            </button>
                            <button 
                                onClick={handleNext}
                                className="bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 shadow-md"
                            >
                                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Arrow */}
                <div 
                    className="absolute w-3 h-3 bg-white transform rotate-45 border-l border-t border-gray-100"
                    style={{
                        ...(position === 'bottom' ? { top: -6, left: '50%', marginLeft: -6 } : {}),
                        ...(position === 'top' ? { bottom: -6, left: '50%', marginLeft: -6, borderLeft: 0, borderTop: 0, borderRight: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' } : {}),
                        ...(position === 'right' ? { left: -6, top: '50%', marginTop: -6, borderRight: 0, borderTop: 0, borderLeft: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' } : {}),
                        ...(position === 'left' ? { right: -6, top: '50%', marginTop: -6, borderLeft: 0, borderBottom: 0, borderRight: '1px solid #f3f4f6', borderTop: '1px solid #f3f4f6' } : {}),
                    }}
                ></div>
            </div>
        </>,
        document.body
    );
};
