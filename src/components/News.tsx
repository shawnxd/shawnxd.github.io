import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaExternalLinkAlt, FaClock } from 'react-icons/fa';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
  message?: string;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Using environment variable for API key
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        
        if (!apiKey) {
          throw new Error('News API key not configured. Please set VITE_NEWS_API_KEY in your .env file.');
        }
        
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=6`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const data: NewsResponse = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'API error');
        }

        setArticles(data.articles);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="news-section">
        <h2><FaNewspaper /> Latest News</h2>
        <div className="loading">Loading latest news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-section">
        <h2><FaNewspaper /> Latest News</h2>
        <div className="error">
          <p>Unable to load news at the moment.</p>
          <p><small>Error: {error}</small></p>
          <p><small>To enable news, please sign up for a free API key at <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">NewsAPI.org</a></small></p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-section">
      <h2><FaNewspaper /> Latest News</h2>
      <div className="news-grid">
        {articles.map((article, index) => (
          <article key={index} className="news-card">
            {article.urlToImage && (
              <div className="news-image">
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="news-content">
              <h3 className="news-title">
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title={article.title}
                >
                  {article.title}
                  <FaExternalLinkAlt className="external-link" />
                </a>
              </h3>
              <p className="news-description">
                {article.description?.substring(0, 120)}...
              </p>
              <div className="news-meta">
                <span className="news-source">{article.source.name}</span>
                <span className="news-time">
                  <FaClock /> {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="news-footer">
        <p>
          <small>
            Powered by <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">NewsAPI.org</a>
          </small>
        </p>
      </div>
    </div>
  );
};

export default News; 