// ==========================================
// FILE 1: src/components/ScrollReveal/ScrollReveal.tsx (FIX)
// ==========================================
import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'scale' | 'slide-up' | 'slide-left' | 'slide-right' | 'fade-scale';
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-scale',
  delay = 0,
  duration = 800,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Animation configs
    const animations = {
      'scale': {
        initial: { opacity: 0, transform: 'scale(0.8)' },
        final: { opacity: 1, transform: 'scale(1)' }
      },
      'slide-up': {
        initial: { opacity: 0, transform: 'translateY(60px)' },
        final: { opacity: 1, transform: 'translateY(0)' }
      },
      'slide-left': {
        initial: { opacity: 0, transform: 'translateX(60px)' },
        final: { opacity: 1, transform: 'translateX(0)' }
      },
      'slide-right': {
        initial: { opacity: 0, transform: 'translateX(-60px)' },
        final: { opacity: 1, transform: 'translateX(0)' }
      },
      'fade-scale': {
        initial: { opacity: 0, transform: 'scale(0.9) translateY(30px)' },
        final: { opacity: 1, transform: 'scale(1) translateY(0)' }
      }
    };

    const config = animations[animation];

    // Set initial state
    Object.assign(element.style, {
      opacity: config.initial.opacity,
      transform: config.initial.transform,
      transition: `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      willChange: 'opacity, transform' // Performance optimization
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            Object.assign(element.style, {
              opacity: config.final.opacity,
              transform: config.final.transform
            });
            
            // Remove will-change after animation
            setTimeout(() => {
              element.style.willChange = 'auto';
            }, duration);
          }, delay);
          
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animation, delay, duration]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};
