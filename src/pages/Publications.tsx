import React from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

interface Publication {
  slug: string;
  title: string;
  venue: string;
  date: string;
}

const publicationModules = import.meta.glob('../content/publications/*.md', { as: 'raw', eager: true });

const publications: Publication[] = Object.entries(publicationModules).map(([path, rawContent]) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const { attributes } = fm(rawContent as string);
  return {
    slug: slug!,
    title: attributes.title,
    venue: attributes.venue,
    date: attributes.date,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const Publications: React.FC = () => {
  return (
    <div>
      <h1>Publications</h1>
      <ul>
        {publications.map(pub => (
          <li key={pub.slug}>
            <Link to={`/publications/${pub.slug}`}>
              <h2>{pub.title}</h2>
              <p>{pub.venue} - {new Date(pub.date).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Publications; 