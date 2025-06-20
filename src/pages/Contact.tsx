import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div>
      <h1>Contact</h1>
      <div className="contact-links">
        <a href="mailto:shawnxd@alumni.upenn.edu" aria-label="Email">
          <FaEnvelope />
          <span>shawnxd@alumni.upenn.edu</span>
        </a>
        <a href="https://github.com/shawnxd" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <FaGithub />
          <span>shawnxd</span>
        </a>
        <a href="https://www.linkedin.com/in/shawn-x-dong/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin />
          <span>Shawn D.</span>
        </a>
      </div>
    </div>
  );
};

export default Contact;