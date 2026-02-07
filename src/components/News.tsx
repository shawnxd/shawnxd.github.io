import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import { fetchNewsLocal } from '../api/news-dev';

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
  status?: string; // This might not be present on error
  totalResults?: number;
  message?: string;
  error?: string; // For errors from our proxy
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('general');

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'sports', label: 'Sports' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health' },
    { value: 'science', label: 'Science' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: NewsResponse;

        // Local dev: direct NewsAPI call (with .env key). Production: use proxy (same-origin on Vercel, or Vercel URL from GitHub Pages).
        const isGitHubPages = typeof window !== 'undefined' && window.location.hostname === 'shawnxd.github.io';
        const newsApiUrl = isGitHubPages
          ? 'https://shawnxd.vercel.app/api/news'
          : '/api/news';

        if (import.meta.env.DEV) {
          data = await fetchNewsLocal(category);
        } else {
          const response = await fetch(`${newsApiUrl}?category=${category}`);

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Failed to fetch news. Status: ${response.status}`);
          }

          data = await response.json();
        }
        
        // Handle errors returned in the JSON body from the proxy
        if (data.status === 'error' || data.error) {
          const errorMessage = data.message || data.error || 'An unknown API error occurred';
          throw new Error(errorMessage);
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
  }, [category]);

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
      <div className="news-header">
        <h2><FaNewspaper /> Latest News</h2>
        <div className="category-selector">
          <label htmlFor="category-select">Category: </label>
          <select 
            id="category-select"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
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