import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import matter from 'gray-matter';
import { FaArrowRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface Post {
  slug: string;
  title: string;
  date: string;
  rawDate: string;
  summary: string;
}

interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
}

const experiences: Experience[] = [
  {
    period: '2020 — Now',
    role: 'Staff Software Engineer',
    company: 'Uber',
    description:
      'Building data and platform systems used by thousands of engineers. Focus on large-scale ingest pipelines, schema evolution, and developer tooling.',
    tags: ['Go', 'Java', 'Kafka', 'Spark', 'TypeScript'],
  },
  {
    period: '2018 — 2020',
    role: 'Software Engineer',
    company: 'Backend & Data Platforms',
    description:
      'Owned services at the intersection of product and platform — backend APIs, frontend dashboards, and data pipelines.',
    tags: ['Python', 'PostgreSQL', 'React', 'gRPC'],
  },
  {
    period: 'Earlier',
    role: 'Computer & Information Science',
    company: 'University of Pennsylvania',
    description:
      'Studied distributed systems, machine learning, and HCI. Research and side projects spanning games, search, and visualization.',
    tags: ['Research', 'Algorithms', 'Systems'],
  },
];

const focusAreas = [
  {
    title: 'Distributed Systems',
    description: 'Designing services that stay correct and fast as they scale across regions and millions of QPS.',
  },
  {
    title: 'Data Platforms',
    description: 'Pipelines, schema evolution, and the metadata layer that lets analysts and ML teams move quickly.',
  },
  {
    title: 'Developer Experience',
    description: 'Tooling, abstractions, and docs that make the right thing the easy thing for other engineers.',
  },
];

interface Project {
  title: string;
  description: string;
  tags: string[];
  repo?: string;
  link?: string;
}

const projects: Project[] = [
  {
    title: 'Personal Site',
    description: 'This very site — a hand-built React + Vite + SCSS personal home with blog, browser games, and a live news feed.',
    tags: ['React', 'TypeScript', 'Vite', 'SCSS'],
    repo: 'https://github.com/shawnxd',
  },
  {
    title: 'Browser Game Collection',
    description: 'Five small games written in vanilla JS and Canvas — Connect Four with minimax AI, Gomoku, Snake, and more.',
    tags: ['Canvas', 'JavaScript', 'Game Loop'],
    link: '/games',
  },
  {
    title: 'Distributed Job Scheduler',
    description: 'Design notes for a job scheduler that handles millions of cron-like jobs across a fleet of workers — see the writing section.',
    tags: ['Systems Design', 'Scheduling'],
    link: '/blog/2025-02-07-designing-a-distributed-job-scheduler',
  },
];

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postModules = import.meta.glob('/src/content/posts/*.md', {
        query: '?raw',
        import: 'default',
      }) as Record<string, () => Promise<string>>;

      const postPromises = Object.entries(postModules).map(async ([path, resolver]) => {
        const content = await resolver();
        const { data } = matter(content);
        const slug = path.split('/').pop()?.replace('.md', '');
        return {
          slug: slug || '',
          title: data.title || 'Untitled',
          rawDate: data.date || '',
          date: data.date
            ? new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '',
          summary: data.summary || content.substring(0, 180) + '…',
        };
      });

      const allPosts = await Promise.all(postPromises);
      allPosts.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());
      setPosts(allPosts);
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-content">
      <section className="home-hero fade-in">
        <h1 className="hero-title">
          Building <span className="accent">durable</span> systems and the teams that own them.
        </h1>
        <p className="hero-subtitle">
          I'm Shawn — an engineer focused on distributed systems, data platforms, and
          the developer tooling that makes large teams move fast without breaking the
          things underneath them.
        </p>
        <div className="hero-cta">
          <Link to="/blog" className="btn btn-primary">
            Read my writing <FaArrowRight />
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            Get in touch
          </Link>
        </div>
        <div className="availability-indicator">
          <span className="availability-dot" aria-hidden="true" />
          <span>Open to interesting conversations about distributed systems</span>
        </div>
      </section>

      <section className="section fade-in fade-in-delay-1">
        <div className="section-heading">
          <h2>What I work on</h2>
        </div>
        <div className="focus-grid">
          {focusAreas.map(area => (
            <div key={area.title} className="focus-card">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section fade-in fade-in-delay-2">
        <div className="section-heading">
          <h2>Experience</h2>
        </div>
        <div className="experience-list">
          {experiences.map(exp => (
            <article key={exp.role + exp.company} className="experience-item">
              <div className="experience-period">{exp.period}</div>
              <div className="experience-content">
                <h3 className="experience-role">{exp.role}</h3>
                <div className="experience-company">{exp.company}</div>
                <p className="experience-description">{exp.description}</p>
                <div className="experience-tags">
                  {exp.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section fade-in fade-in-delay-2">
        <div className="section-heading">
          <h2>Selected work</h2>
          <a
            href="https://github.com/shawnxd"
            target="_blank"
            rel="noopener noreferrer"
            className="section-link"
          >
            View on GitHub →
          </a>
        </div>
        <div className="projects-grid">
          {projects.map(project => {
            const externalRepo = !!project.repo;
            const isExternalLink = project.link?.startsWith('http');
            return (
              <article key={project.title} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.link && (
                    isExternalLink ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> View
                      </a>
                    ) : (
                      <Link to={project.link}>
                        <FaExternalLinkAlt /> View
                      </Link>
                    )
                  )}
                  {externalRepo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer">
                      <FaGithub /> Source
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section blog-posts fade-in fade-in-delay-3">
        <div className="section-heading">
          <h2>Recent writing</h2>
          <Link to="/blog" className="section-link">View all →</Link>
        </div>
        {posts.slice(0, 4).map(post => (
          <article key={post.slug} className="blog-post-preview">
            <div className="blog-meta">{post.date}</div>
            <h3>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.summary}</p>
            <Link to={`/blog/${post.slug}`} className="read-more">
              Read more
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Home;
