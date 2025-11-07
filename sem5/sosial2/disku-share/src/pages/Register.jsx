// src/pages/Register.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/auth.js'; //

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
  /* Font hitam biasa, bukan maroon */
  color: ${({ theme }) => theme.colors.textPrimary || '#333'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
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
  width: 100%;
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
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName || !handle) {
      alert('Semua field harus diisi, G!');
      return;
    }
    
    await registerUser(fullName, email, password, handle); //
    navigate('/login');
  };

  return (
    <PageWrapper>
      <FormCard onSubmit={handleSubmit}>
        <Title>Buat Akun Barumu</Title>
        
        <Label>Nama Lengkap</Label>
        <Input 
          type="text" 
          placeholder="Adit Sopojarwo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        
        <Label>Handle (@username)</Label>
        <Input 
          type="text" 
          placeholder="adit_sopo (tanpa @)"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        
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
        
        <Button type="submit">Daftar</Button>

        <FooterText>
          Udah punya akun? <StyledLink to="/login">Masuk di sini</StyledLink>
        </FooterText>
      </FormCard>
    </PageWrapper>
  );
};

export default Register;