import React from 'react';
import News from '../components/News';

const NewsPage: React.FC = () => {
  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="page-eyebrow">Newsroom</div>
        <h1>Latest headlines</h1>
        <p className="page-description">
          A passive scroll of headlines pulled live from trusted U.S. news sources
          via NewsAPI. Pick a category to filter the feed.
        </p>
      </header>
      <News />
    </div>
  );
};

export default NewsPage;
