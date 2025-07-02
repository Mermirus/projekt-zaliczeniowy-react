import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

// Funkcja do aktualizacji atrybutu data-theme
const updateTheme = (isDark: boolean) => {
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

// Nasłuchiwanie zmian w localStorage
window.addEventListener('storage', (e) => {
  if (e.key === 'theme') {
    updateTheme(e.newValue === 'dark');
  }
});

// Inicjalizacja motywu
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  updateTheme(savedTheme === 'dark');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
