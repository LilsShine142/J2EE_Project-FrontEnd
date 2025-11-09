// ==========================================
// FILE 1: src/hooks/useScrollReveal.ts
// ==========================================
import { useEffect, useRef } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  scale?: number;
  distance?: number;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    duration = 800,
    delay = 0,
    scale = 0.9,
    distance = 50
  } = options;

  const elementsRef = useRef<Map<Element, boolean>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting && !elementsRef.current.get(entry.target)) {
            elementsRef.current.set(entry.target, true);
            
            // Trigger animation
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'scale(1) translateY(0)';
            }, delay);
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe all elements with data-scroll-reveal
    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      
      // Set initial state
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = `scale(${scale}) translateY(${distance}px)`;
      htmlEl.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
      
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [threshold, rootMargin, duration, delay, scale, distance]);
};