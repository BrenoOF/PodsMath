import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ TEMA
import 'primereact/resources/themes/lara-light-blue/theme.css';

// ✅ CSS BASE DO PRIMEREACT
import 'primereact/resources/primereact.min.css';

// ✅ Ícones
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
