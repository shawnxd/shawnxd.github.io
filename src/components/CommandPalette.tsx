import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { parseMarkdownFrontmatter } from '../utils/frontmatter';

interface CommandItem {
  id: string;
  label: string;
  group: string;
  path: string;
  hint?: string;
}

const baseCommands: CommandItem[] = [
  { id: 'home', label: 'Home', group: 'Pages', path: '/' },
  { id: 'blog', label: 'Writing — Blog index', group: 'Pages', path: '/blog' },
  { id: 'now', label: 'Now — What I am focused on', group: 'Pages', path: '/now' },
  { id: 'games', label: 'Games', group: 'Pages', path: '/games' },
  { id: 'news', label: 'News', group: 'Pages', path: '/news' },
  { id: 'contact', label: 'Contact', group: 'Pages', path: '/contact' },
];

interface PostMeta {
  slug: string;
  title: string;
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [postCommands, setPostCommands] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Load post-based commands lazily once when the palette is first opened
  useEffect(() => {
    if (!isOpen || postCommands.length > 0) return;
    const load = async () => {
      const modules = import.meta.glob('/src/content/posts/*.md', {
        query: '?raw',
        import: 'default',
      }) as Record<string, () => Promise<string>>;
      const posts: PostMeta[] = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
          const content = await resolver();
          const { data } = parseMarkdownFrontmatter(content);
          const slug = path.split('/').pop()?.replace('.md', '') || '';
          return { slug, title: data.title || slug };
        })
      );
      setPostCommands(
        posts.map(p => ({
          id: `post-${p.slug}`,
          label: p.title,
          group: 'Writing',
          path: `/blog/${p.slug}`,
          hint: 'Blog post',
        }))
      );
    };
    void load();
  }, [isOpen, postCommands.length]);

  const allCommands = useMemo(() => [...baseCommands, ...postCommands], [postCommands]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCommands;
    return allCommands.filter(cmd => cmd.label.toLowerCase().includes(q));
  }, [query, allCommands]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onSelect = useCallback(
    (cmd: CommandItem) => {
      navigate(cmd.path);
      close();
    },
    [navigate, close]
  );

  // Keyboard shortcuts: ⌘K / Ctrl+K to open, Esc to close, arrows + enter to navigate
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const accelerator = isMac ? e.metaKey : e.ctrlKey;

      if (accelerator && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) close();
        else open();
        return;
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd) onSelect(cmd);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, filtered, selectedIndex, open, close, onSelect]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Group filtered results by group
  const grouped: Record<string, CommandItem[]> = {};
  filtered.forEach(c => {
    if (!grouped[c.group]) grouped[c.group] = [];
    grouped[c.group].push(c);
  });

  let runningIndex = -1;

  return (
    <div className="command-palette-backdrop" role="dialog" aria-modal="true" onClick={close}>
      <div className="command-palette" onClick={e => e.stopPropagation()}>
        <div className="command-input">
          <FaSearch aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, posts…"
            aria-label="Search"
          />
          <kbd>esc</kbd>
        </div>
        <div className="command-results">
          {filtered.length === 0 ? (
            <div className="command-empty">No matches for "{query}"</div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="command-group">
                <div className="command-group-label">{group}</div>
                {items.map(item => {
                  runningIndex += 1;
                  const itemIndex = runningIndex;
                  const isSelected = itemIndex === selectedIndex;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={`command-item ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => onSelect(item)}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="command-hint">{item.hint}</span>}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="command-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
