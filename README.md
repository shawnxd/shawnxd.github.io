# Personal Website

A modern, responsive personal website built with React, TypeScript, and Vite. Features a blog, games section, and contact page with a clean, professional design.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **Responsive Design**: Mobile-first approach with SCSS styling
- **Blog System**: Markdown-based blog posts with frontmatter
- **Routing**: Client-side routing with React Router
- **Static Site Generation**: Builds to static HTML for easy deployment
- **Content Management**: Simple markdown files for blog posts and pages

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shawnxd/captain-rogers.git
cd personal-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The development server will start at `http://localhost:5173`. The page will automatically reload when you make changes to the code.

### 4. Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages

## 📁 Project Structure

```
personal-website/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── pages/          # Static pages (markdown)
│   │   └── posts/          # Blog posts (markdown)
│   ├── pages/              # Page components
│   ├── styles/             # SCSS stylesheets
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── docs/                   # Build output (for GitHub Pages)
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## ✍️ Adding Content

### Blog Posts

1. Create a new markdown file in `src/content/posts/`
2. Use the following frontmatter format:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
summary: "Brief description of your post"
---

Your post content here...
```

3. The post will automatically appear in the blog section

### Pages

1. Create a new markdown file in `src/content/pages/`
2. Use the same frontmatter format as blog posts
3. Pages will be accessible via their filename (without extension)

## 🚀 Deployment

### GitHub Pages (Recommended)

This project is configured for GitHub Pages deployment. The build output goes to the `docs/` folder, which GitHub Pages can serve directly.

1. **Automatic Deployment** (using the provided script):
   ```bash
   npm run deploy
   ```
   This command will:
   - Build the project
   - Copy the build to the `docs/` folder
   - Commit and push the changes

2. **Manual Deployment**:
   ```bash
   npm run build
   git add docs
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select the `main` branch and `/docs` folder
   - Save the settings

### Other Hosting Platforms

The project builds to static files in the `docs/` folder, making it compatible with any static hosting service:

- **Netlify**: Drag and drop the `docs/` folder
- **Vercel**: Connect your repository and set build command to `npm run build`
- **AWS S3**: Upload the contents of `docs/` folder
- **Firebase Hosting**: Deploy the `docs/` folder

## 🎨 Customization

### Styling

- Main styles are in `src/styles/main.scss`
- Variables are defined in `src/styles/_variables.scss`
- The design uses a mobile-first responsive approach

### Components

- Page components are in `src/pages/`
- Reusable components can be added to `src/components/`
- The main app structure is in `src/App.tsx`

### Configuration

- Vite configuration: `vite.config.ts`
- TypeScript configuration: `tsconfig.json`
- Build output directory is set to `docs/` for GitHub Pages compatibility

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**: If port 5173 is busy, Vite will automatically try the next available port
2. **Build errors**: Ensure all dependencies are installed with `npm install`
3. **TypeScript errors**: Check that all imports are correct and types are properly defined

### Development Tips

- Use the browser's developer tools to debug styling issues
- Check the console for any JavaScript errors
- The development server provides hot module replacement for fast development

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

---

Happy coding! 🎉 