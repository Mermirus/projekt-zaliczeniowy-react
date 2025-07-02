import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Ładowanie...</div>;
  return user ? <>{children}</> : <Navigate to="/logowanie" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId="292765007135-i99qpa7th02g15regpq5f5p0qt5b11kn.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/rejestracja" element={<RegisterPage />} />
              <Route path="/logowanie" element={<LoginPage />} />
              <Route path="/panel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/logowanie" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App; 