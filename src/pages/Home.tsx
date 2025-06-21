import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import News from '../components/News';

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
      <div className="home-content">
        <section className="news-section-home">
          <div className="news-intro">
            <h2>Latest News</h2>
            <p>
              Stay updated with the latest headlines from around the United States. 
              This section automatically fetches current news from trusted sources using the free NewsAPI.org service.
            </p>
          </div>
          <News />
        </section>
        
        <section className="blog-posts">
          <h2>Latest Blog Posts</h2>
          {posts.map(post => (
            <div key={post.slug} className="blog-post-preview">
              <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p>{post.summary}</p>
              <p><em>{post.date}</em></p>
              <hr />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;