import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, runTransaction } from 'firebase/database';

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    const counterRef = ref(database, 'visitors/count');

    const incrementCounter = () => {
      runTransaction(counterRef, (currentValue) => {
        return (currentValue || 0) + 1;
      });
    };

    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      incrementCounter();
      sessionStorage.setItem('hasVisited', 'true');
    }

    onValue(counterRef, (snapshot) => {
      const count = snapshot.val();
      if (count !== null) {
        setVisitorCount(count);
      }
    });
  }, []);

  return (
    <div className="visitor-counter">
      <span>Visitors</span>
      <span>{visitorCount !== null ? visitorCount.toLocaleString() : '—'}</span>
    </div>
  );
};

export default VisitorCounter;
