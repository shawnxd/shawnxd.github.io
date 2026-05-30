import { useEffect, useState } from 'react';

/**
 * A fixed bar at the top of the viewport that tracks how far down the page
 * the reader has scrolled. Renders a single thin element styled by
 * `.reading-progress`.
 */
const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setProgress(pct);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
};

export default ReadingProgress;
