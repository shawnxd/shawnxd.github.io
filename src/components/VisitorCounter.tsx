import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, runTransaction } from 'firebase/database';

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const counterRef = ref(database, 'visitors/count');

    // Function to increment the counter
    const incrementCounter = () => {
      runTransaction(counterRef, (currentValue) => {
        return (currentValue || 0) + 1;
      });
    };

    // Check if the user has visited before in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      incrementCounter();
      sessionStorage.setItem('hasVisited', 'true');
    }

    // Listen for changes to the counter and update the state
    onValue(counterRef, (snapshot) => {
      const count = snapshot.val();
      if (count !== null) {
        setVisitorCount(count);
      }
    });

  }, []);

  return (
    <div className="visitor-counter" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
        Visitor Count: {visitorCount !== null ? visitorCount.toLocaleString() : 'Loading...'}
      </p>
    </div>
  );
};

export default VisitorCounter; 