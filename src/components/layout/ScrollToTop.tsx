import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Custom Work is the ONLY exception, which uses #custom-work
    if (hash === '#custom-work') {
      // Delay slightly to ensure page renders before scrolling
      setTimeout(() => {
        const element = document.getElementById('custom-work');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    // Normal page navigation resets scroll to top
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
