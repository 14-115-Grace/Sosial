// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- Impor Layout & Halaman ---
import MainLayout from './components/layout/MainLayout';
import HalamanTentang from './pages/HalamanTentang';
import Beranda from './pages/Beranda';
import Populer from './pages/Populer';
import Kategori from './pages/Kategori';
import Profil from './pages/Profil';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// --- Pelindung Rute Private ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); 
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children; 
};

// --- Komponen Shortcut Buat /profil/me ---
const MyProfileRedirect = () => {
  const { user } = useAuth(); 
  
  if (!user) return <Navigate to="/login" replace />;
  
  const userIdentifier = user.user_metadata?.handle || user.id;

  return <Navigate to={`/profil/${userIdentifier}`} replace />;
};

// --- Konfigurasi Router ---
const router = createBrowserRouter([
  {
    // Rute yang pake MainLayout (Sidebar merah)
    path: '/',
    element: <MainLayout />, 
    children: [
      {
        path: '/', 
        element: <HalamanTentang />,
      },
      {
        path: 'home', // Rute /home
        element: (
          <ProtectedRoute> 
            <Beranda />
          </ProtectedRoute>
        ),
      },
      {
        path: 'populer', // Rute /populer
        element: (
          <ProtectedRoute>
            <Populer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'kategori', // Rute /kategori
        element: <Kategori />, 
      },
      {
        path: 'profil/me', // Rute 'shortcut' dari sidebar
        element: (
          <ProtectedRoute> 
            <MyProfileRedirect />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profil/:username', // Rute dinamis (cth: /profil/adit_sopo)
        element: (
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    // Rute polosan (Login & Register)
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    // Rute 'Catch-all' (404)
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
