import { useEffect, useState } from 'react';

interface Props {
  /**
   * Selector for the container whose img tags should be clickable.
   * Defaults to `.markdown-body`.
   */
  rootSelector?: string;
}

/**
 * Adds a click-to-zoom lightbox to all images in the given container.
 * Click an image to open a fullscreen view; click again or press Escape to close.
 */
const ImageLightbox = ({ rootSelector = '.markdown-body' }: Props) => {
  const [openImage, setOpenImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const images = root.querySelectorAll<HTMLImageElement>('img');
    const cleanups: Array<() => void> = [];

    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      const onClick = () => {
        setOpenImage({ src: img.currentSrc || img.src, alt: img.alt });
      };
      img.addEventListener('click', onClick);
      cleanups.push(() => img.removeEventListener('click', onClick));
    });

    return () => cleanups.forEach(fn => fn());
  }, [rootSelector]);

  useEffect(() => {
    if (!openImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenImage(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [openImage]);

  if (!openImage) return null;

  return (
    <div className="lightbox-backdrop" onClick={() => setOpenImage(null)} role="dialog" aria-modal="true">
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close image"
        onClick={() => setOpenImage(null)}
      >
        ×
      </button>
      <img
        src={openImage.src}
        alt={openImage.alt}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageLightbox;
