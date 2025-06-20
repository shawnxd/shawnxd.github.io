import React from 'react';

const games = [
  {
    emoji: '🕹️',
    title: '5 In A Row (Chinese Game) 五子棋',
    tech: 'JS/HTML5',
    year: 2023,
    link: 'https://shawnxd.github.io/5-in-a-row/',
    repo: 'https://github.com/shawnxd/5-in-a-row',
  },
  {
    emoji: '🚀',
    title: 'Captain Rogers',
    tech: 'JS/HTML5',
    year: 2023,
    link: 'https://shawnxd.github.io/CaptainRogers/',
    repo: 'https://github.com/shawnxd/CaptainRogers',
  },
  {
    emoji: '👾',
    title: 'Alien Invasion',
    tech: 'JS/HTML5',
    year: 2022,
    link: 'https://shawnxd.github.io/AlienInvasion/',
    repo: 'https://github.com/shawnxd/AlienInvasion',
  },
  {
    emoji: '🐍',
    title: 'Greedy Snake',
    tech: 'Python',
    year: 2020,
    link: '',
    repo: 'https://github.com/shawnxd/greedy_snake',
  },
];

export default function Games() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Games</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {games.map((game) => (
          <li key={game.title} style={{ marginBottom: '2rem', background: '#f9f9f9', borderRadius: 12, padding: '1.5rem 1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{game.emoji}</div>
            <div style={{ fontWeight: 600, fontSize: 20 }}>{game.title}</div>
            <div style={{ color: '#666', margin: '0.5rem 0 1rem 0' }}>{game.tech} &middot; {game.year}</div>
            <div>
              {game.link && game.title !== 'Greedy Snake' && (
                <a href={game.link} target="_blank" rel="noopener noreferrer" style={{ marginRight: 16, color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>Play</a>
              )}
              {game.repo && <a href={game.repo} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 500 }}>Source</a>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 