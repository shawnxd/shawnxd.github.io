import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Use the correct relative glob pattern for Vite
        const postModules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
        console.log('Found post modules:', Object.keys(postModules));
        const postPromises = Object.entries(postModules).map(async ([path, resolver]) => {
          try {
            const content = await resolver();
            const { data } = matter(content);
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            return {
              slug,
              title: data.title || 'Untitled',
              date: data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
              summary: data.summary || content.substring(0, 150) + '...',
            };
          } catch (error) {
            console.error('Error processing post:', path, error);
            return null;
          }
        });
        const allPosts = await Promise.all(postPromises);
        const validPosts = allPosts.filter(post => post !== null) as Post[];
        // Sort by date (newest first)
        validPosts.sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        setPosts(validPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <div>
          <p>No posts found. Check the console for debugging information.</p>
          <p>Posts array length: {posts.length}</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.slug}>
            <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p><em>{post.date}</em></p>
            <p>{post.summary}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;