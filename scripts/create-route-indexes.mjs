import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const postsDir = path.join(root, 'src', 'content', 'posts');

const staticRoutes = [
  'blog',
  'contact',
  'games',
  'news',
  'now',
];

const writeRouteIndex = async (route, html) => {
  const routeDir = path.join(distDir, route);
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, 'index.html'), html);
};

const getBlogRoutes = async () => {
  const entries = await readdir(postsDir, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => `blog/${entry.name.replace(/\.md$/, '')}`);
};

const indexHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
const routes = [...staticRoutes, ...(await getBlogRoutes())];

await Promise.all(routes.map(route => writeRouteIndex(route, indexHtml)));
await writeFile(path.join(distDir, '.nojekyll'), '');

console.log(`Created ${routes.length} route index files for GitHub Pages.`);
