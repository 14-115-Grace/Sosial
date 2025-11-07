// src/App.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// --- Impor Halaman & Komponen ---
import MainLayout from './components/layout/MainLayout';
import HalamanTentang from './pages/HalamanTentang';
import Beranda from './pages/Beranda';
import Populer from './pages/Populer';
import Kategori from './pages/Kategori';
import Profil from './pages/Profil';
import PostDetail from './pages/PostDetail';
import EditProfil from './pages/EditProfil'; // Halaman baru
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Loading from './components/common/Loading'; // Spinner

// --- Pelindung Rute Private (UDAH DI-UPGRADE) ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Ambil 'loading' dari context
  const location = useLocation(); // Ambil lokasi sekarang

  if (loading) {
    // Kalo app lagi loading session, TAMPILIN SPINNER
    return <Loading />; 
  }

  if (!user) {
    // Kalo udah gak loading DAN user gak ada, tendang ke login
    // Kirim 'state' biar Login.jsx tau kita abis dari mana
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return children; // Aman, user ada
};

// --- Komponen Shortcut Buat /profil/me (UDAH DI-UPGRADE) ---
const MyProfileRedirect = () => {
  // Ambil 'profile' & 'loading' dari context
  const { user, profile, loading } = useAuth(); 
  
  if (loading) {
    return <Loading />; // TAMPILIN SPINNER
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }
  
  // PAKE 'handle' DARI PROFIL, BUKAN METADATA
  const userIdentifier = profile.handle || user.id;
  
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
          <ProtectedRoute> <Beranda /> </ProtectedRoute>
        ),
      },
      {
        path: 'populer', // Rute /populer
        element: (
          <ProtectedRoute> <Populer /> </ProtectedRoute>
        ),
      },
      {
        path: 'kategori', // Rute /kategori
        element: <Kategori />, // Ini public, gak perlu <ProtectedRoute>
      },
      {
        path: 'profil/me', // Rute 'shortcut' dari sidebar
        element: (
          <ProtectedRoute> <MyProfileRedirect /> </ProtectedRoute>
        ),
      },
      {
        path: 'profil/:username', // Rute dinamis (cth: /profil/adit_sopo)
        element: (
          <ProtectedRoute> <Profil /> </ProtectedRoute>
        ),
      },
      {
        path: 'post/:postId', // Rute buat detail post
        element: <ProtectedRoute><PostDetail /></ProtectedRoute>,
      },
      { 
        path: 'pengaturan/akun', // Rute buat edit profil
        element: <ProtectedRoute><EditProfil /></ProtectedRoute>,
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