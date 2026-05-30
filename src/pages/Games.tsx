import React from 'react';
import { FaCode, FaExternalLinkAlt, FaGamepad, FaKeyboard, FaRegCircle, FaRocket, FaSpaceShuttle } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface Game {
  icon: IconType;
  title: string;
  tech: string;
  year: number;
  description: string;
  link?: string;
  repo?: string;
}

const games: Game[] = [
  {
    icon: FaRegCircle,
    title: 'Connect Four',
    tech: 'TypeScript / Canvas',
    year: 2024,
    description: 'Classic Connect Four with a minimax-based AI opponent and canvas-rendered chips.',
    link: 'https://shawnxd.github.io/connect-4/',
    repo: 'https://github.com/shawnxd/connect-4',
  },
  {
    icon: FaGamepad,
    title: '5 In A Row',
    tech: 'JS / HTML5',
    year: 2023,
    description: 'Gomoku — the traditional Chinese board game, playable in any modern browser.',
    link: 'https://shawnxd.github.io/5-in-a-row/',
    repo: 'https://github.com/shawnxd/5-in-a-row',
  },
  {
    icon: FaRocket,
    title: 'Captain Rogers',
    tech: 'JS / HTML5',
    year: 2023,
    description: 'A side-scrolling space adventure built with the Phaser game engine.',
    link: 'https://shawnxd.github.io/captain-rogers/',
    repo: 'https://github.com/shawnxd/captain-rogers',
  },
  {
    icon: FaSpaceShuttle,
    title: 'Alien Invasion',
    tech: 'JS / HTML5',
    year: 2022,
    description: 'Defend the Earth from waves of pixel-art aliens. Keyboard controls, score, levels.',
    link: 'https://shawnxd.github.io/alien-invasion/',
    repo: 'https://github.com/shawnxd/alien-invasion',
  },
  {
    icon: FaKeyboard,
    title: 'Greedy Snake',
    tech: 'JS / Canvas',
    year: 2020,
    description: 'A minimal take on the snake classic, with smooth grid movement and growing tail.',
    link: 'https://shawnxd.github.io/greedy_snake/',
    repo: 'https://github.com/shawnxd/greedy_snake',
  },
];

const Games: React.FC = () => {
  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="page-eyebrow">Projects</div>
        <h1>Browser games</h1>
        <p className="page-description">
          A small collection of browser games I've built over the years — mostly
          for fun, sometimes to learn a new framework or rendering technique.
        </p>
      </header>
      <div className="games-list">
        {games.map(game => {
          const Icon = game.icon;
          return (
            <article key={game.title} className="game-item">
              <div className="game-icon" aria-hidden="true">
                <Icon />
              </div>
              <h3 className="game-title">{game.title}</h3>
              <div className="game-meta">{game.tech} · {game.year}</div>
              <p className="game-description">{game.description}</p>
              <div className="game-links">
                {game.link && (
                  <a href={game.link} target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt /> Play
                  </a>
                )}
                {game.repo && (
                  <a href={game.repo} target="_blank" rel="noopener noreferrer">
                    <FaCode /> Source
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Games;
