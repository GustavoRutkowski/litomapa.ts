import './types/global';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

import './styles/resets.scss';
import './styles/variables.scss';
import './styles/mixins.scss';

const rootElement = document.getElementById('root');
if (!rootElement)
  throw new Error('Root element not found');

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
