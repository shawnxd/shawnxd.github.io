import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

interface Post {
  slug: string;
  title: string;
  date: string;
  rawDate: string;
  summary: string;
  tags: string[];
}

interface ExternalPost {
  title: string;
  href: string;
  source: string;
  date: string;
  rawDate: string;
  summary: string;
}

const externalPosts: ExternalPost[] = [
  {
    title: 'How Uber Standardized Mobile Analytics for Cross-Platform Insights',
    href: 'https://www.uber.com/blog/how-uber-standardized-mobile-analytics/',
    source: 'Uber Engineering Blog',
    rawDate: '2025-10-02',
    date: 'October 2, 2025',
    summary:
      'How we unified iOS and Android event instrumentation — standardized event types, automatic metadata, and analytics logic lifted out of feature code into platform components.',
  },
];

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postModules = import.meta.glob('../content/posts/*.md', {
          query: '?raw',
          import: 'default',
        }) as Record<string, () => Promise<string>>;

        const postPromises = Object.entries(postModules).map(async ([path, resolver]) => {
          try {
            const content = await resolver();
            const { data } = matter(content);
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            return {
              slug,
              title: data.title || 'Untitled',
              rawDate: data.date || '',
              date: data.date
                ? new Date(data.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '',
              summary: data.summary || content.substring(0, 200) + '…',
              tags: data.tags || [],
            };
          } catch (error) {
            console.error('Error processing post:', path, error);
            return null;
          }
        });
        const allPosts = await Promise.all(postPromises);
        const validPosts = allPosts.filter(p => p !== null) as Post[];
        validPosts.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
        setPosts(validPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Group by year for the index
  const postsByYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.rawDate ? new Date(post.rawDate).getFullYear().toString() : 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="page-eyebrow">Writing</div>
        <h1>Notes & essays</h1>
        <p className="page-description">
          Long-form thinking on distributed systems, the design of data platforms,
          and the engineering work in between.
        </p>
      </header>

      {loading ? (
        <div className="loading-state">Loading posts…</div>
      ) : posts.length === 0 && externalPosts.length === 0 ? (
        <div className="empty-state">
          <p>No posts found.</p>
        </div>
      ) : (
        <div className="blog-list">
          {externalPosts.length > 0 && (
            <section className="blog-year-section">
              <div className="year-heading">Published elsewhere</div>
              <div className="blog-list-items">
                {externalPosts.map(post => (
                  <article key={post.href} className="blog-list-item">
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="blog-list-link"
                    >
                      <div className="blog-list-date">{post.date}</div>
                      <div className="blog-list-content">
                        <h3 className="blog-list-title">{post.title}</h3>
                        <p className="blog-list-summary">{post.summary}</p>
                        <div className="blog-list-source">{post.source} ↗</div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          )}
          {years.map(year => (
            <section key={year} className="blog-year-section">
              <div className="year-heading">{year}</div>
              <div className="blog-list-items">
                {postsByYear[year].map(post => (
                  <article key={post.slug} className="blog-list-item">
                    <Link to={`/blog/${post.slug}`} className="blog-list-link">
                      <div className="blog-list-date">{post.date}</div>
                      <div className="blog-list-content">
                        <h3 className="blog-list-title">{post.title}</h3>
                        <p className="blog-list-summary">{post.summary}</p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
