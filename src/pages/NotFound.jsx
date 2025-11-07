// src/pages/NotFound.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// --- Styled Components (Sesuai Error Page.png) ---

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background || '#FDF8EE'};
  text-align: center;
  padding: 2rem;
`;

const ErrorCode = styled.h1`
  /* Ini font 'serif' tebel dari Figma */
  font-family: "Times New Roman", Times, serif; 
  font-size: 8rem;
  font-weight: 400;
  color: #333;
  margin: 0;
`;

const ErrorTitle = styled.h2`
  font-family: "Times New Roman", Times, serif;
  font-size: 3rem;
  font-weight: 400;
  color: #333;
  margin: -1.5rem 0 1rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 2rem;
  max-width: 400px;
`;

const HomeButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
`;

// --- Komponen ---
const NotFound = () => {
  return (
    <PageWrapper>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Page Not Found</ErrorTitle>
      <ErrorMessage>
        Halaman yang kamu cari tidak ditemukan.
        Coba periksa kembali alamat URL atau pastikan koneksi internetmu stabil
        sebelum kembali ke halaman utama.
      </ErrorMessage>
      {/* Kita arahin ke / (Tentang) atau /home (Timeline) */}
      <HomeButton to="/">Kembali ke Halaman Utama</HomeButton>
    </PageWrapper>
  );
};

export default NotFound;