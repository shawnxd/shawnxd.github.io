import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';

interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postModules = import.meta.glob('/src/content/posts/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

      const postPromises = Object.entries(postModules).map(async ([path, resolver]) => {
        const content = await resolver();
        
        const { data } = matter(content);

        const slug = path.split('/').pop()?.replace('.md', '');
        return {
          slug: slug || '',
          title: data.title || 'Untitled',
          date: data.date ? new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          summary: data.summary || content.substring(0, 150) + '...',
        };
      });

      const allPosts = await Promise.all(postPromises);
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.slug}>
          <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <p>{post.summary}</p>
          <p><em>{post.date}</em></p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Home;