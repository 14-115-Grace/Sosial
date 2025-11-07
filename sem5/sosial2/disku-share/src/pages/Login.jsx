// src/pages/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/auth.js'; //

// --- Styled Components (NYAMAIN Login.png) ---

const PageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* Warna background off-white dari Figma */
  background-color: ${({ theme }) => theme.colors.background || '#FDF8EE'};
`;

const FormCard = styled.form`
  /* Warna kartu peach/pink muda dari Login.png */
  background: #FCEFEA; 
  padding: 2.5rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  /* Font hitam biasa */
  color: ${({ theme }) => theme.colors.textPrimary || '#333'};
`;

const Label = styled.label`
  display: block; /* <-- INI PENTING: Bikin "Email" di atas input */
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%; /* <-- INI PENTING: Bikin input full-width */
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: #FFFFFF; /* Input field-nya putih */
  font-size: 1rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary || '#9A2A2A'};
    border-color: transparent;
  }
`;

const Button = styled.button`
  width: 100%; /* <-- INI PENTING: Bikin tombol full-width */
  padding: 0.85rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary || '#9A2A2A'};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary || '#9A2A2A'};
  font-weight: 600;
  text-decoration: none;
`;

// --- Komponen ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Email dan password harus diisi!');
      return;
    }
    
    // Panggil fungsi dari auth.js
    await loginUser(email, password); 
    
    // AuthContext bakal otomatis deteksi login
    // dan ProtectedRoute bakal ngizinin kita masuk
    navigate('/home'); // Arahin ke /home (timeline)
  };

  return (
    <PageWrapper>
      <FormCard onSubmit={handleSubmit}>
        <Title>Masuk ke Akunmu</Title>
        
        <Label>Email</Label>
        <Input 
          type="email" 
          placeholder="nama@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <Label>Kata Sandi</Label>
        <Input 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button type="submit">Masuk</Button>

        <FooterText>
          Belum punya akun? <StyledLink to="/register">Daftar di sini</StyledLink>
        </FooterText>
      </FormCard>
    </PageWrapper>
  );
};

export default Login;