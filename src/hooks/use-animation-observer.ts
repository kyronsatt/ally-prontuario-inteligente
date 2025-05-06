
import { useEffect } from "react";

/**
 * Hook for observing and animating elements that enter the viewport
 */
export function useAnimationObserver() {
  useEffect(() => {
    // Function to animate elements when they enter the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with the fade-in-section class
    document.querySelectorAll(".fade-in-section").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}
