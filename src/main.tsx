import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize i18n after React is loaded
import('./i18n').then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch(() => {
  // Fallback: render without i18n if it fails to load
  createRoot(document.getElementById("root")!).render(<App />);
});
