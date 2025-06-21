# News Section Setup Guide

This guide will help you set up the news section on your personal website using the free NewsAPI.org service.

## Getting Started

### 1. Sign up for NewsAPI.org

1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key" or "Sign Up"
3. Create a free account
4. Verify your email address
5. Get your API key from the dashboard

### 2. Configure the API Key (Secure Method)

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your API key to the `.env` file:

```bash
VITE_NEWS_API_KEY=your_actual_api_key_here
```

3. **Important**: The `.env` file is already in your `.gitignore`, so it won't be committed to version control

### 3. Test the News Section

1. Run your development server: `npm run dev`
2. Navigate to `/news` or check your homepage
3. You should see the latest US news articles

## Security Features

✅ **Environment Variables**: API key is stored in `.env` file (not in code)  
✅ **Git Ignored**: `.env` files are automatically excluded from version control  
✅ **Error Handling**: Shows helpful error if API key is missing  
✅ **No Hardcoding**: API key is never committed to your repository  

## Features

- **Free Tier**: 1,000 requests per day
- **US News**: Automatically fetches top headlines from US sources
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful fallback when API is unavailable
- **Loading States**: Shows loading indicators while fetching data
- **Secure**: API key stored in environment variables

## Customization

### Change News Source

To get news from different countries or categories, modify the API URL in `src/components/News.tsx`:

```typescript
// For different countries
const response = await fetch(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}&pageSize=6`
);

// For different categories
const response = await fetch(
  `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${apiKey}&pageSize=6`
);

// For general news (not country-specific)
const response = await fetch(
  `https://newsapi.org/v2/everything?q=technology&apiKey=${apiKey}&pageSize=6`
);
```

### Available Categories

- `business`
- `entertainment`
- `general`
- `health`
- `science`
- `sports`
- `technology`

### Available Countries

- `us` (United States)
- `gb` (United Kingdom)
- `ca` (Canada)
- `au` (Australia)
- And many more...

## Alternative Free News APIs

If you prefer different news sources, here are some alternatives:

### 1. GNews API
- **URL**: https://gnews.io/
- **Free Tier**: 100 requests per day
- **Setup**: Similar to NewsAPI.org

### 2. MediaStack API
- **URL**: https://mediastack.com/
- **Free Tier**: 500 requests per month
- **Setup**: Requires different API endpoints

### 3. NewsData.io
- **URL**: https://newsdata.io/
- **Free Tier**: 200 requests per day
- **Setup**: Similar structure to NewsAPI.org

## Troubleshooting

### Common Issues

1. **"News API key not configured" error**
   - Make sure you have a `.env` file in your project root
   - Check that `VITE_NEWS_API_KEY=your_key_here` is in the `.env` file
   - Restart your development server after adding the `.env` file

2. **"Failed to fetch news" error**
   - Check your API key is correct
   - Verify your internet connection
   - Check if you've exceeded the daily limit

3. **No images showing**
   - Some news sources don't provide images
   - The component handles missing images gracefully

4. **CORS errors**
   - NewsAPI.org supports CORS for development
   - If using alternatives, check their CORS policy

### Rate Limiting

The free tier of NewsAPI.org allows 1,000 requests per day. If you exceed this limit:
- The API will return an error
- The news section will show an error message
- Wait until the next day for the limit to reset

## Production Deployment

For production deployment:

1. **Environment Variables**: Your `.env` file will work in production
2. **Build Process**: Vite automatically includes environment variables in the build
3. **Security**: API key remains secure and not in your codebase

### Example `.env` file structure:
```bash
# Development
VITE_NEWS_API_KEY=your_development_key_here

# Production (if different)
# VITE_NEWS_API_KEY=your_production_key_here
```

## File Structure

```
your-project/
├── .env                    # Your actual API key (not in git)
├── env.example            # Template file (safe to commit)
├── src/
│   └── components/
│       └── News.tsx       # News component
└── .gitignore             # Already excludes .env files
```

## Quick Setup Checklist

- [ ] Sign up at [NewsAPI.org](https://newsapi.org/)
- [ ] Get your API key
- [ ] Create `.env` file in project root
- [ ] Add `VITE_NEWS_API_KEY=your_key_here` to `.env`
- [ ] Restart development server
- [ ] Test the news section

That's it! Your API key is now secure and won't be exposed in your public repository. 