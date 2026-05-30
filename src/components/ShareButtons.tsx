import { useState } from 'react';
import { FaXTwitter, FaLinkedin, FaLink, FaCheck } from 'react-icons/fa6';

interface Props {
  title: string;
}

const ShareButtons = ({ title }: Props) => {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Older browsers — silently no-op
    }
  };

  return (
    <div className="share-buttons">
      <span className="share-label">Share</span>
      <div className="share-buttons-list">
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          title="Share on X"
        >
          <FaXTwitter />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          <FaLinkedin />
        </a>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy link"
          title={copied ? 'Copied!' : 'Copy link'}
          className={copied ? 'is-copied' : ''}
        >
          {copied ? <FaCheck /> : <FaLink />}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
