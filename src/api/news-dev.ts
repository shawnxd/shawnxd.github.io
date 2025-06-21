// Local development version of the news API
// This simulates the Vercel serverless function for local development

export async function fetchNewsLocal(category: string = 'general') {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  const pageSize = import.meta.env.NEWS_PAGE_SIZE || '10';

  if (!apiKey) {
    throw new Error('API key is not configured. Please add VITE_NEWS_API_KEY to your .env file');
  }

  const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&language=en&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=publishedAt&category=${category}`;

  try {
    const response = await fetch(newsApiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to fetch news from source: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'error' || data.error) {
      const errorMessage = data.message || data.error || 'An unknown API error occurred';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('Error in local news API:', error);
    throw error;
  }
} 