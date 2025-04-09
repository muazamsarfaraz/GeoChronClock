import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Add error handling
const renderApp = () => {
  try {
    console.log('Attempting to render React app...');
    const rootElement = document.getElementById('root');

    if (!rootElement) {
      console.error('Root element not found!');
      document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found!</div>';
      return;
    }

    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.log('React app rendered successfully!');
  } catch (error) {
    console.error('Error rendering React app:', error);
    document.body.innerHTML = `<div style="padding: 20px; color: red;">
      <h2>Error Rendering Application</h2>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`;
  }
};

// Execute the render function
renderApp();
