import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { GPayUserProvider } from "./context/GPayUserContext";
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <ThemeProvider>
        <GPayUserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
        </GPayUserProvider>
    </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
