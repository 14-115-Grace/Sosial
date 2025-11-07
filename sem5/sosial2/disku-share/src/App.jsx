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
// Komponen ini "jagain" halaman yang cuma boleh diliat kalo udah login
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Cek status login
  if (!user) {
    // Kalo belom login, tendang ke /login
    return <Navigate to="/login" replace />;
  }
  return children; // Kalo udah, tampilin halamannya
};

// --- Komponen Shortcut Buat /profil/me ---
// Ini ngurusin link "Profil" di sidebar
const MyProfileRedirect = () => {
  const { user } = useAuth(); // Cek user yg lagi login
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Ambil 'handle' (username) dari data user,
  // Kalo gak ada, pake 'id' (tapi harusnya ada)
  const userIdentifier = user.user_metadata?.handle || user.id;
  
  // Arahin ke halaman profil kita sendiri
  return <Navigate to={`/profil/${userIdentifier}`} replace />;
};

// --- Konfigurasi Router ---
const router = createBrowserRouter([
  {
    // Rute yang pake MainLayout (Sidebar merah)
    path: '/',
    element: <MainLayout />, // Layout utama jadi 'wrapper'
    children: [
      {
        path: '/', // Rute root (cth: localhost:5173/)
        element: <HalamanTentang />, // Ini Halaman "Tentang" (Public)
      },
      {
        path: 'home', // Rute /home
        element: (
          <ProtectedRoute> {/* Dijagain */}
            <Beranda />
          </ProtectedRoute>
        ),
      },
      {
        path: 'populer', // Rute /populer
        element: (
          <ProtectedRoute> {/* Dijagain */}
            <Populer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'kategori', // Rute /kategori
        element: <Kategori />, // Ini public, gak perlu <ProtectedRoute>
      },
      {
        path: 'profil/me', // Rute 'shortcut' dari sidebar
        element: (
          <ProtectedRoute> {/* Dijagain */}
            <MyProfileRedirect />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profil/:username', // Rute dinamis (cth: /profil/adit_sopo)
        element: (
          <ProtectedRoute> {/* Dijagain */}
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
    path: '*', // Kalo URL gak ketemu
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;