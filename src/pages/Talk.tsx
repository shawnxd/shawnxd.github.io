import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const talkModules = import.meta.glob('../content/talks/*.md', { as: 'raw', eager: true });

const Talk: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const rawContent = talkModules[`../content/talks/${slug}.md`];

  if (!rawContent) {
    return <div>Talk not found!</div>;
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

export default Talk; 