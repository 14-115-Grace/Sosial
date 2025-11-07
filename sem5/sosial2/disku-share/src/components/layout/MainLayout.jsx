// src/components/layout/MainLayout.jsx
import React from 'react';
import styled from 'styled-components';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Panggil Satpam
import { logoutUser } from '../../services/auth'; //
import LogoImage from '../../assets/DS.png'; // <-- 1. IMPORT (Udah bener)

// --- Styled Components ---
const AppWrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.nav`
  width: 250px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 2rem 1.5rem;
  color: white;
  position: sticky;
  top: 0;
  align-self: flex-start;
`;

// 2. KITA BIKIN KOMPONEN GAMBAR BARU
const LogoImg = styled.img`
  width: 80px; /* Atur sizenya */
  margin-bottom: 2rem;
`;

const NavLink = styled(Link)`
  display: block;
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.75rem 0;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  position: relative;
`;

const LoginButton = styled(Link)`
  position: absolute;
  top: 2rem;
  right: 3rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

// --- Komponen (CUMA ADA SATU) ---
const MainLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(); //
    navigate('/login');
  };

  return (
    <AppWrapper>
      {/* --- Sidebar Merah --- */}
      <Sidebar>
        {/* 3. GANTI <Logo>DS</Logo> PAKE INI */}
        <LogoImg src={LogoImage} alt="DiskuShare Logo" />
        
        <NavLink to="/home">Beranda</NavLink>
        <NavLink to="/profil/me">Profil</NavLink>
        <NavLink to="/populer">Populer</NavLink>
        <NavLink to="/kategori">Kategori</NavLink>
        <NavLink to="/">Tentang</NavLink>
      </Sidebar>
      
      {/* --- Konten Halaman --- */}
      <MainContent>
        {/* Tombol di pojok kanan atas */}
        {user ? (
          <LoginButton as="button" onClick={handleLogout}>
            Keluar
          </LoginButton>
        ) : (
          <LoginButton to="/login">
            Masuk
          </LoginButton>
        )}
        
        <Outlet />
      </MainContent>
    </AppWrapper>
  );
};

export default MainLayout;