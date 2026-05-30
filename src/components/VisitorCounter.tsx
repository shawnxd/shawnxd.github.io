import React, { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const hasVisitedThisSession = () => {
  try {
    return sessionStorage.getItem('hasVisited') === 'true';
  } catch {
    return true;
  }
};

const markVisitedThisSession = () => {
  try {
    sessionStorage.setItem('hasVisited', 'true');
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
};

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    if (!hasFirebaseConfig) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const loadCounter = async () => {
      try {
        const [{ getApps, initializeApp }, databaseModule] = await Promise.all([
          import('firebase/app'),
          import('firebase/database'),
        ]);

        if (cancelled) return;

        const app = getApps()[0] || initializeApp(firebaseConfig);
        const database = databaseModule.getDatabase(app);
        const counterRef = databaseModule.ref(database, 'visitors/count');

        if (!hasVisitedThisSession()) {
          markVisitedThisSession();
          void databaseModule.runTransaction(counterRef, currentValue => (
            (currentValue || 0) + 1
          )).catch(error => {
            console.warn('Visitor counter increment failed:', error);
          });
        }

        unsubscribe = databaseModule.onValue(counterRef, snapshot => {
          if (cancelled) return;
          const count = snapshot.val();
          if (typeof count === 'number') {
            setVisitorCount(count);
          }
        }, error => {
          console.warn('Visitor counter unavailable:', error);
        });
      } catch (error) {
        console.warn('Visitor counter unavailable:', error);
      }
    };

    const win = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const idleHandle = win.requestIdleCallback?.(() => {
      void loadCounter();
    }, { timeout: 2000 });
    const timeoutHandle = idleHandle === undefined
      ? window.setTimeout(() => {
          void loadCounter();
        }, 500)
      : undefined;

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (idleHandle !== undefined) {
        win.cancelIdleCallback?.(idleHandle);
      }
      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, []);

  if (!hasFirebaseConfig) {
    return null;
  }

  return (
    <div className="visitor-counter">
      <span>Visitors</span>
      <span>{visitorCount !== null ? visitorCount.toLocaleString() : '—'}</span>
    </div>
  );
};

export default VisitorCounter;
