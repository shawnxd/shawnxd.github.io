import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

/**
 * Builds a sticky table of contents from h2/h3 elements inside a `.markdown-body`.
 * Highlights the active section as the reader scrolls.
 *
 * Auto-hides itself if the post has fewer than 2 headings.
 */
const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const root = document.querySelector('.markdown-body');
    if (!root) return;

    const collected: Heading[] = [];
    root.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach(node => {
      const text = node.textContent || '';
      if (!text) return;
      let id = node.id;
      if (!id) {
        id = slugify(text);
        node.id = id;
      }
      collected.push({
        id,
        text,
        level: Number(node.tagName.substring(1)),
      });
    });
    setHeadings(collected);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const handle = () => {
      // Find the heading nearest the top of the viewport
      const viewportOffset = 120;
      let current = headings[0]?.id || '';
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - viewportOffset <= 0) {
          current = h.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };
    handle();
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="post-toc" aria-label="Table of contents">
      <div className="post-toc-label">On this page</div>
      <ul>
        {headings.map(h => (
          <li
            key={h.id}
            className={`level-${h.level} ${activeId === h.id ? 'is-active' : ''}`}
          >
            <a
              href={`#${h.id}`}
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 90;
                  window.scrollTo({ top, behavior: 'smooth' });
                  history.replaceState(null, '', `#${h.id}`);
                }
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
