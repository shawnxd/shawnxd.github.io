import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const publicationModules = import.meta.glob('../content/publications/*.md', { as: 'raw', eager: true });

const Publication: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const rawContent = publicationModules[`../content/publications/${slug}.md`];

  if (!rawContent) {
    return <div>Publication not found!</div>;
  }

  const { attributes, body } = fm(rawContent as string);

  return (
    <div>
      <h1>{attributes.title}</h1>
      <p>{attributes.venue} - {new Date(attributes.date).toLocaleDateString()}</p>
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>
  );
};

export default Publication; 