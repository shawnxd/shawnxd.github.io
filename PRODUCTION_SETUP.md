# Production Setup for News API

This guide will help you configure the News API key for your live website on GitHub Pages.

## Method 1: GitHub Actions (Recommended)

### Step 1: Add API Key to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/shawnxd/shawnxd.github.io`
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `VITE_NEWS_API_KEY`
6. Value: Your actual API key from NewsAPI.org
7. Click **Add secret**

### Step 2: Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow
3. Click **Run workflow** to trigger the first deployment
4. Or simply push any change to the `main` branch

### Step 3: Configure GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy your site

## Method 2: Manual Deployment (Alternative)

If you prefer to keep using the manual deploy script:

1. Add your API key to the GitHub repository secrets as above
2. Use the deploy script: `npm run deploy`
3. The API key will be available during build time

## Testing

After setup:
1. Visit your live site: `https://shawnxd.github.io/`
2. The news section should now display actual news articles
3. If you still see errors, check the browser console for details

## Troubleshooting

### "Failed to fetch news" error
- Verify your API key is correct in GitHub secrets
- Check that the secret name is exactly `VITE_NEWS_API_KEY`
- Ensure you haven't exceeded the daily API limit (1,000 requests)

### GitHub Actions not running
- Check the **Actions** tab for any workflow errors
- Verify the workflow file is in `.github/workflows/deploy.yml`
- Make sure GitHub Actions is enabled for your repository

### Environment variable not working
- Remember: environment variables are only available at build time
- The API key is embedded in the built JavaScript files
- This is normal and expected for client-side applications

## Security Note

The API key will be visible in the built JavaScript files. This is normal for client-side applications and is the standard approach for frontend-only websites. The key is still secure because:
- It's not in your source code
- It's only accessible from your domain
- NewsAPI.org has rate limiting and usage monitoring

## API Usage Monitoring

- Monitor your usage at: https://newsapi.org/account
- Free tier: 1,000 requests per day
- Consider upgrading if you exceed the limit regularly 