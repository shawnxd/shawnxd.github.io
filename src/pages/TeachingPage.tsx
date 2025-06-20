import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const teachingModules = import.meta.glob('../content/teaching/*.md', { as: 'raw', eager: true });

const TeachingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const rawContent = teachingModules[`../content/teaching/${slug}.md`];

  if (!rawContent) {
    return <div>Teaching material not found!</div>;
  }

  const { attributes, body } = fm(rawContent as string);

  return (
    <div>
      <h1>{attributes.title}</h1>
      <p>{attributes.type} - {new Date(attributes.date).toLocaleDateString()}</p>
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );
};

export default TeachingPage; 