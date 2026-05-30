import React from 'react';

interface SimpleItem {
  text: string;
}

interface LinkItem {
  text: string;
  href: string;
  author?: string;
}

const isLinkItem = (item: SimpleItem | LinkItem): item is LinkItem =>
  (item as LinkItem).href !== undefined;

const workItems: SimpleItem[] = [
  { text: 'Leading platform work on data ingestion at Uber' },
  { text: 'Mentoring two junior engineers through their first promo' },
  { text: 'Drafting a design doc for a schema-evolution framework' },
  { text: 'Reviewing rollout plans for a multi-region migration' },
  { text: 'Untangling on-call hot spots in the ingestion pipeline' },
  { text: 'Pushing for sharper SLOs on the highest-traffic paths' },
  { text: 'Running a weekly office hour for the broader data org' },
  { text: 'Helping shape the next quarter of platform roadmap' },
];

// A principal-engineer-style reading list — long-running sources I keep coming back to
const readingList: LinkItem[] = [
  {
    text: 'Papers We Love',
    author: 'paperswelove.org',
    href: 'https://paperswelove.org/',
  },
  {
    text: 'The Morning Paper archive',
    author: 'Adrian Colyer',
    href: 'https://blog.acolyer.org/',
  },
  {
    text: 'Marc Brooker on distributed systems',
    author: 'AWS',
    href: 'https://brooker.co.za/blog/',
  },
  {
    text: 'All Things Distributed',
    author: 'Werner Vogels',
    href: 'https://www.allthingsdistributed.com/',
  },
  {
    text: 'Jepsen consistency analyses',
    author: 'Kyle Kingsbury',
    href: 'https://jepsen.io/analyses',
  },
  {
    text: 'Performance & systems posts',
    author: 'Brendan Gregg',
    href: 'https://www.brendangregg.com/blog/',
  },
  {
    text: 'Interactive engineering explainers',
    author: 'Bartosz Ciechanowski',
    href: 'https://ciechanow.ski/',
  },
  {
    text: 'Computer science in formal methods',
    author: 'Hillel Wayne',
    href: 'https://www.hillelwayne.com/',
  },
];

const leadershipReading: LinkItem[] = [
  {
    text: 'Irrational Exuberance — staff-plus essays',
    author: 'Will Larson',
    href: 'https://lethain.com/',
  },
  {
    text: 'On Engineering Management',
    author: 'Camille Fournier',
    href: 'https://skamille.medium.com/',
  },
  {
    text: 'The Staff Engineer’s Path archive',
    author: 'Tanya Reilly',
    href: 'https://noidea.dog/blog',
  },
  {
    text: 'High Scalability post archive',
    author: 'highscalability.com',
    href: 'http://highscalability.com/',
  },
];

const sideProjectItems: SimpleItem[] = [
  { text: 'Polishing this site — design, performance, dark mode' },
  { text: 'A small CLI for organizing engineering notes' },
  { text: 'Slowly working on a longer essay on platform abstractions' },
  { text: 'Prototyping a local-first markdown reader for papers' },
  { text: 'Reading the source of a few small open-source databases' },
  { text: 'Tinkering with a tiny static-site generator in Go' },
  { text: 'Sketching a board-game prototype with paper and dice' },
  { text: 'Trying to hold a steady weekly running habit' },
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
          A snapshot of what's holding my attention right now — work, ideas, the
          things I'm reading. Updated periodically. Inspired by{' '}
          <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
            Derek Sivers
          </a>
          .
        </p>
        <p className="now-updated">Last updated &middot; {updated}</p>
      </header>

      <div className="now-grid">
        <NowGroup title="Work" items={workItems} />
        <NowGroup title="Side projects" items={sideProjectItems} />
        <NowGroup
          title="Reading — systems"
          items={readingList}
          description="Long-running sources I return to whenever I need to think more clearly about distributed systems."
        />
        <NowGroup
          title="Reading — leadership"
          items={leadershipReading}
          description="The handful of writers I learned the most from on the soft side of senior engineering."
        />
      </div>
    </div>
  );
};

const NowGroup: React.FC<{
  title: string;
  items: Array<SimpleItem | LinkItem>;
  description?: string;
}> = ({ title, items, description }) => (
  <section className="now-group">
    <h2>{title}</h2>
    {description && <p className="now-group-description">{description}</p>}
    <ul>
      {items.map(item => (
        <li key={item.text}>
          {isLinkItem(item) ? (
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <span className="now-link-title">{item.text}</span>
              {item.author && <span className="now-link-author"> — {item.author}</span>}
            </a>
          ) : (
            item.text
          )}
        </li>
      ))}
    </ul>
  </section>
);

export default Now;
