import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/tokens.css';
import './i18n';

import '@fontsource-variable/archivo';
import '@fontsource/atkinson-hyperlegible-next';

// Initialize MSW Mock Service Worker for client-side API interception
async function enableMocking() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  try {
    const { worker } = await import('./api/mocks/browser');
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  } catch (err) {
    console.info('Mock Service Worker registration bypassed:', err);
  }
}

enableMocking().finally(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
