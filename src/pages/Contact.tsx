import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';

interface ContactLink {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

const links: ContactLink[] = [
  {
    icon: <FaEnvelope />,
    label: 'Email',
    value: 'shawnxd@alumni.upenn.edu',
    href: 'mailto:shawnxd@alumni.upenn.edu',
  },
  {
    icon: <FaLinkedin />,
    label: 'LinkedIn',
    value: 'shawn-x-dong',
    href: 'https://www.linkedin.com/in/shawn-x-dong/',
    external: true,
  },
  {
    icon: <FaGithub />,
    label: 'GitHub',
    value: '@shawnxd',
    href: 'https://github.com/shawnxd',
    external: true,
  },
  {
    icon: <SiGooglescholar />,
    label: 'Google Scholar',
    value: 'Publications',
    href: 'https://scholar.google.com/citations?user=vJbvaGcAAAAJ&hl=en',
    external: true,
  },
];

const Contact: React.FC = () => {
  return (
    <div className="fade-in">
      <header className="page-header">
        <div className="page-eyebrow">Get in touch</div>
        <h1>Let's talk</h1>
        <p className="page-description">
          Happy to chat about distributed systems, data platforms, engineering
          careers, or anything you think is interesting. The fastest way to reach me
          is email — I usually reply within a day or two.
        </p>
      </header>
      <div className="contact-links">
        {links.map(link => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            aria-label={link.label}
          >
            {link.icon}
            <div>
              <span className="contact-label">{link.label}</span>
              <span className="contact-value">{link.value}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
