import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// --- Impor Layout & Halaman ---
import MainLayout from './components/layout/MainLayout.jsx';
import HalamanTentang from './pages/HalamanTentang.jsx';
import Beranda from './pages/Beranda.jsx';
import Populer from './pages/Populer.jsx';
import Kategori from './pages/Kategori.jsx';
import Profil from './pages/Profil.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';
import Pengaturan from './pages/Pengaturan.jsx';

// --- Pelindung Rute Private ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Cek status login
  if (!user) {
    // Kalo belom login, tendang ke /login
    return <Navigate to="/login" replace />;
  }
  return children; // Kalo udah, tampilin halamannya
};

// --- Komponen Shortcut Buat /profil/me ---
const MyProfileRedirect = () => {
  const { profile } = useAuth(); 
  
  if (!profile) return <Navigate to="/login" replace />;
  
  // Ambil 'handle' dari OBJEK PROFIL, bukan user_metadata
  const userIdentifier = profile.handle; // <-- INI PERBAIKANNYA
  
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
        path: 'profil/:username', // Rute dinamis
        element: (
          <ProtectedRoute> {/* Dijagain */}
            <Profil />
          </ProtectedRoute>
        ),
      },
      {
        path: 'post/:postId',
        element: <ProtectedRoute><PostDetail /></ProtectedRoute>,
      },
      {
        path: 'pengaturan/akun',
        element: (
          <ProtectedRoute>
            <Pengaturan />
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
    path: '*', // Kalo URL gak ketemu
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
