import React from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

interface Talk {
  slug: string;
  title: string;
  venue: string;
  date: string;
}

const talkModules = import.meta.glob('../content/talks/*.md', { as: 'raw', eager: true });

const talks: Talk[] = Object.entries(talkModules).map(([path, rawContent]) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const { attributes } = fm(rawContent as string);
  return {
    slug: slug!,
    title: attributes.title,
    venue: attributes.venue,
    date: attributes.date,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const Talks: React.FC = () => {
  return (
    <div>
      <h1>Talks</h1>
      <ul>
        {talks.map(talk => (
          <li key={talk.slug}>
            <Link to={`/talks/${talk.slug}`}>
              <h2>{talk.title}</h2>
              <p>{talk.venue} - {new Date(talk.date).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Talks; 