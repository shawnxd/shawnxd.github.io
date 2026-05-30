import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound: React.FC = () => {
  return (
    <div className="not-found fade-in">
      <div className="not-found-code">404</div>
      <h1>Page not found</h1>
      <p>
        The page you're looking for has either been moved or never existed in
        the first place. Apologies for the dead end.
      </p>
      <div className="hero-cta" style={{ marginTop: '1.5rem' }}>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
