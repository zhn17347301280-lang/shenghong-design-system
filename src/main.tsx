import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { DesignSystemProvider } from './providers/DesignSystemProvider';
import './styles/global.css';
import './styles/components.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DesignSystemProvider>
      <App />
    </DesignSystemProvider>
  </StrictMode>,
);
