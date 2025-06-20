import React from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

interface TeachingItem {
  slug: string;
  title: string;
  type: string;
  date: string;
}

const teachingModules = import.meta.glob('../content/teaching/*.md', { as: 'raw', eager: true });

const teachingItems: TeachingItem[] = Object.entries(teachingModules).map(([path, rawContent]) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  const { attributes } = fm(rawContent as string);
  return {
    slug: slug!,
    title: attributes.title,
    type: attributes.type,
    date: attributes.date,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const Teaching: React.FC = () => {
  return (
    <div>
      <h1>Teaching</h1>
      <ul>
        {teachingItems.map(item => (
          <li key={item.slug}>
            <Link to={`/teaching/${item.slug}`}>
              <h2>{item.title}</h2>
              <p>{item.type} - {new Date(item.date).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teaching; 