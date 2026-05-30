import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import matter from 'gray-matter';
import { FaArrowLeft } from 'react-icons/fa';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('yml', yaml);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);

interface PostFrontmatter {
  title: string;
  date?: string;
  summary?: string;
  tags?: string[];
}

interface LoadedPost {
  frontmatter: PostFrontmatter;
  content: string;
  readingTimeMin: number;
}

const wordsPerMinute = 220;

const estimateReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<LoadedPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postModules = import.meta.glob('../content/posts/*.md', {
          query: '?raw',
          import: 'default',
        }) as Record<string, () => Promise<string>>;

        const postPath = `../content/posts/${slug}.md`;
        const postResolver = postModules[postPath];

        if (postResolver) {
          const content = await postResolver();
          const { data, content: markdownContent } = matter(content);
          setPost({
            frontmatter: {
              title: data.title || 'Untitled',
              date: data.date || '',
              summary: data.summary || '',
              tags: data.tags || [],
            },
            content: markdownContent,
            readingTimeMin: estimateReadingTime(markdownContent),
          });
        } else {
          console.error('Post not found:', slug);
          setPost(null);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return <div className="loading-state">Loading…</div>;
  }

  if (!post) {
    return (
      <div className="empty-state">
        <h1>Post not found</h1>
        <p>This post may have moved or been removed.</p>
        <Link to="/blog" className="btn btn-ghost">
          <FaArrowLeft /> Back to writing
        </Link>
      </div>
    );
  }

  const formattedDate = post.frontmatter.date
    ? new Date(post.frontmatter.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <article className="blog-post fade-in">
      <ReadingProgress />
      <Link to="/blog" className="back-link">
        <FaArrowLeft /> All writing
      </Link>
      <header className="blog-post-header">
        <div className="blog-post-meta">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && <span className="dot">·</span>}
          <span>{post.readingTimeMin} min read</span>
        </div>
        <h1>{post.frontmatter.title}</h1>
        {post.frontmatter.summary && (
          <p className="blog-post-summary">{post.frontmatter.summary}</p>
        )}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="experience-tags" style={{ marginTop: '1rem' }}>
            {post.frontmatter.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </header>
      <div className="blog-post-layout">
        <div className="markdown-body">
        <ReactMarkdown
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');

              if (!inline && match) {
                const isDark =
                  typeof document !== 'undefined' &&
                  document.documentElement.getAttribute('data-theme') === 'dark';
                return (
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '10px',
                      padding: '1.25rem 1.5rem',
                      fontSize: '0.92em',
                      margin: '1.5rem 0',
                      background: 'var(--code-bg)',
                    }}
                    codeTagProps={{ style: { fontFamily: 'JetBrains Mono, monospace' } }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
        </div>
        <aside className="blog-post-aside">
          <TableOfContents />
        </aside>
      </div>
      <footer className="blog-post-footer">
        <Link to="/blog" className="btn btn-ghost">
          <FaArrowLeft /> More writing
        </Link>
      </footer>
    </article>
  );
};

export default BlogPost;
