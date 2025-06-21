import React, { useState } from 'react';
import News from '../components/News';

const NewsPage: React.FC = () => {
  return (
    <div>
      <h1>Latest News</h1>
      <p>Stay updated with the latest news from around the United States.</p>
      <News />
    </div>
  );
};

export default NewsPage; 