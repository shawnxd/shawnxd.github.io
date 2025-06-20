import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import matter from 'gray-matter';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postModules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
        const postPath = `../content/posts/${slug}.md`;
        const postResolver = postModules[postPath];

        if (postResolver) {
          const content = await postResolver();
          const { data, content: markdownContent } = matter(content);
          setPost({ title: data.title || 'Untitled', content: markdownContent });
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
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
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
};

export default BlogPost; 