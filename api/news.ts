// This is a Vercel Serverless Function which acts as a proxy to the NewsAPI.
// It securely handles the API key on the backend.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Use the same environment variable name for consistency.
  const apiKey = process.env.VITE_NEWS_API_KEY;
  const pageSize = process.env.NEWS_PAGE_SIZE || '10'; // Configurable page size, default to 10

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }

  if (!apiKey) {
    console.error('News API key is not configured on the server.');
    return res.status(500).json({ error: 'API key is not configured.' });
  }

  // Get query parameters from the request
  const { category = 'general', country = 'us', language = 'en' } = req.query;

  const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&language=${language}&apiKey=${apiKey}&pageSize=${pageSize}&sortBy=publishedAt&category=${category}`;

  try {
    const newsResponse = await fetch(newsApiUrl);

    // If the request to NewsAPI fails, forward the error status and message.
    if (!newsResponse.ok) {
      const errorData = await newsResponse.json().catch(() => ({ message: newsResponse.statusText }));
      console.error('Error from NewsAPI:', errorData);
      return res.status(newsResponse.status).json({
        error: `Failed to fetch news from source: ${errorData.message || newsResponse.statusText}`,
      });
    }

    const newsData = await newsResponse.json();

    // Set cache headers to cache the response for 10 minutes on Vercel's CDN.
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

    return res.status(200).json(newsData);
  } catch (error) {
    console.error('Error in the news proxy function:', error);
    return res.status(500).json({ error: 'An internal server error occurred.' });
  }
} 