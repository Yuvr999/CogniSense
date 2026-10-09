import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './styles/tokens.css'
import './i18n';

import '@fontsource-variable/archivo';
import '@fontsource/atkinson-hyperlegible-next';

// Start MSW mock service worker in development
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }
  const { worker } = await import('./api/mocks/browser')
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
