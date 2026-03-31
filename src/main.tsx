import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

if (!localStorage.getItem('emulators.ui.ui.tipsV2')) {
  localStorage.setItem('emulators.ui.ui.tipsV2', 'false');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
