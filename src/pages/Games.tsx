import React from 'react';

const games = [
  {
    emoji: '🕹️',
    title: '5 In A Row (Chinese Game)',
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
    link: 'https://shawnxd.github.io/captain-rogers/',
    repo: 'https://github.com/shawnxd/captain-rogers',
  },
  {
    emoji: '👾',
    title: 'Alien Invasion',
    tech: 'JS/HTML5',
    year: 2022,
    link: 'https://shawnxd.github.io/alien-invasion/',
    repo: 'https://github.com/shawnxd/alien-invasion',
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

const Games: React.FC = () => {
  return (
    <div>
      <h1>Games</h1>
      <div className="games-list">
        {games.map((game) => (
          <div key={game.title} className="game-item">
            <div className="game-emoji">{game.emoji}</div>
            <h3 className="game-title">{game.title}</h3>
            <div className="game-meta">{game.tech} &middot; {game.year}</div>
            <div className="game-links">
              {game.link && game.title !== 'Greedy Snake' && (
                <a href={game.link} target="_blank" rel="noopener noreferrer">Play</a>
              )}
              {game.repo && <a href={game.repo} target="_blank" rel="noopener noreferrer">Source</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Games; 