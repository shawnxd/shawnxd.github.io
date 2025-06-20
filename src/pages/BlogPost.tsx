import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const postModules = import.meta.glob('../content/posts/*.md', { as: 'raw', eager: true });

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const rawContent = postModules[`../content/posts/${slug}.md`];

  if (!rawContent) {
    return <div>Post not found!</div>;
  }

  const { attributes, body } = fm(rawContent as string);

  return (
    <div>
      <h1>{attributes.title}</h1>
      <p>{new Date(attributes.date).toLocaleDateString()}</p>
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );
};

export default BlogPost; 