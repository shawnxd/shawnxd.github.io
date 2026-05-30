import React from 'react';

const nowItems = [
  {
    category: 'Work',
    items: [
      'Leading platform work on data ingestion at Uber',
      'Mentoring two junior engineers through their first promo',
      'Drafting a design doc for a schema-evolution framework',
    ],
  },
  {
    category: 'Learning',
    items: [
      'Re-reading "Designing Data-Intensive Applications"',
      'Experimenting with Rust for systems-level tooling',
      'Tinkering with local-first software ideas',
    ],
  },
  {
    category: 'Side projects',
    items: [
      'Polishing this site — design, performance, dark mode',
      'A small CLI for organizing engineering notes',
      'Slowly working on a longer essay on platform abstractions',
    ],
  },
  {
    category: 'Reading',
    items: [
      '"The Beginning of Infinity" — David Deutsch',
      '"Conversational Design" — Erika Hall',
      'Various papers on incremental computation',
    ],
  },
];

const Now: React.FC = () => {
  const updated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="page-eyebrow">/now</div>
        <h1>What I'm focused on</h1>
        <p className="page-description">
          A snapshot of what's holding my attention right now — work, ideas, books.
          Updated periodically. Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">Derek Sivers</a>.
        </p>
        <p className="now-updated">Last updated · {updated}</p>
      </header>

      <div className="now-grid">
        {nowItems.map(group => (
          <section key={group.category} className="now-group">
            <h2>{group.category}</h2>
            <ul>
              {group.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Now;
