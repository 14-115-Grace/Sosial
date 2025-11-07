import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles.js';
import { theme } from './styles/theme.js';
import { AuthProvider } from './context/AuthContext.jsx'; // <-- IMPORT SATPAM

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider> {/* <-- BUNGKUS APP PAKE AUTH */}
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);