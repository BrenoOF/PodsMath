import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { PrimeReactProvider } from "primereact/api";

// ✅ CSS BASE DO PRIMEREACT
import 'primereact/resources/primereact.min.css';
// ✅ Ícones
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Css Global
import './style.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
);

reportWebVitals();
