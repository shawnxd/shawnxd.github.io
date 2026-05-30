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
  { text: 'Building auto-observability libraries for service teams' },
  { text: 'Contributing to traffic and demand forecasting systems' },
  { text: 'Improving code-quality tooling for the wider eng org' },
  { text: 'Drafting a design doc for a schema-evolution framework' },
  { text: 'Mentoring two junior engineers through their first promo' },
  { text: 'Pushing for sharper SLOs on the highest-traffic paths' },
  { text: 'Running a weekly office hour for the broader data org' },
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
    text: "The Engineering Executive's Primer",
    author: 'Will Larson',
    href: 'https://lethain.com/eeprimer/',
  },
  {
    text: 'Crafting Engineering Strategy',
    author: 'Will Larson',
    href: 'https://craftingengstrategy.com/',
  },
  {
    text: 'An Elegant Puzzle',
    author: 'Will Larson',
    href: 'https://lethain.com/elegant-puzzle/',
  },
  {
    text: "The Manager's Path",
    author: 'Camille Fournier',
    href: 'https://www.oreilly.com/library/view/the-managers-path/9781491973882/',
  },
  {
    text: 'The Software Engineer’s Guidebook',
    author: 'Gergely Orosz',
    href: 'https://www.pragmaticengineer.com/',
  },
  {
    text: 'Irrational Exuberance — staff-plus essays',
    author: 'Will Larson',
    href: 'https://lethain.com/',
  },
  {
    text: 'The Pragmatic Engineer',
    author: 'Gergely Orosz',
    href: 'https://blog.pragmaticengineer.com/',
  },
  {
    text: 'Rands in Repose',
    author: 'Michael Lopp',
    href: 'https://randsinrepose.com/',
  },
  {
    text: 'Engineering Management for the Rest of Us',
    author: 'Sarah Drasner',
    href: 'https://www.engmanagement.dev/',
  },
];

const sideProjectItems: SimpleItem[] = [
  { text: 'Polishing this site — design, performance, dark mode' },
  { text: 'Contributing to a Django open-source project on weekends' },
  { text: 'Writing long-form essays on distributed-systems design' },
  { text: 'Interviewing prospective students as a Penn Ambassador' },
  { text: 'Maintaining a handful of small browser games on GitHub' },
  { text: 'A small CLI for organizing engineering notes' },
  { text: 'Slowly working on a longer essay on platform abstractions' },
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
          title="Reading - leadership"
          items={leadershipReading}
          description="Books and long-running blogs on engineering strategy, executive scope, and principal-level technical leadership."
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
