import './types/global.d.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { UserInfosProvider } from './contexts/UserInfosContext';

import './styles/global.scss';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

const root: ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <UserInfosProvider>
                <App />
            </UserInfosProvider>
        </AuthProvider>
    </React.StrictMode>
);
