// src/pages/EditProfil.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { 
  updateProfile, 
  updateUserPassword,
  uploadAvatar,
  uploadBanner
} from '../services/auth';
import Loading from '../components/common/Loading';

// --- Styled Components (SESUAI Edit profil.png) ---

const PageHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// Ganti <form> jadi wrapper biasa
const SettingsWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card}; /* Putih */
  border: 1px solid #eee;
  border-radius: 8px;
`;

const Form = styled.form`
  /* Form-nya jadi satu */
`;

const SectionHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  h2 {
    font-size: 1.5rem;
    margin: 0;
  }
  p {
    font-size: 0.9rem;
    color: #555;
    margin-top: 0.25rem;
  }
`;

const SectionBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// --- Komponen Form ---
const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 1rem;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    border-color: transparent;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 500px;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

// --- Komponen Upload Foto ---
const FileInputLabel = styled(Label)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
`;

const BannerPreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 8px;
  background: #eee;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const AvatarPreview = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #ddd;
  margin-top: -60px;
  margin-left: 1.5rem;
`;

const SectionFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  background-color: #fafafa;
`;

const Button = styled.button`
  width: auto;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

// --- Komponen Utama ---
const EditProfil = () => {
  const { profile, loading: authLoading } = useAuth();

  // State buat text fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  
  // State buat file
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // State buat URL preview
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setHandle(profile.handle || '');
      setBio(profile.bio || '');
      setAvatarPreview(profile.avatar_url || '');
      setBannerPreview(profile.banner_url || '');
    }
  }, [profile]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else if (type === 'banner') {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (avatarFile) await uploadAvatar(avatarFile);
      if (bannerFile) await uploadBanner(bannerFile);
      await updateProfile({ name, handle, bio });
      if (password.trim() !== '') {
        await updateUserPassword(password);
      }
      
      alert('Profil berhasil diperbarui!');
      setPassword('');
      setAvatarFile(null);
      setBannerFile(null);
      // TODO: Panggil refresh profile di AuthContext
      
    } catch (error) {
      alert('Gagal update profil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !profile) {
    return <Loading />;
  }

  return (
    <>
      <PageHeader>Pengaturan Akun</PageHeader>
      
      <SettingsWrapper>
        <Form onSubmit={handleSubmit}>
          {/* === SEKSI FOTO === */}
          <SectionHeader>
            <h2>Foto Profil & Banner</h2>
            <p>Perbarui foto profil dan banner untuk mempersonalisasi akunmu.</p>
          </SectionHeader>
          <SectionBody>
            <PreviewWrapper>
              <BannerPreview src={bannerPreview} />
              <AvatarPreview src={avatarPreview} />
            </PreviewWrapper>
            <FormRow>
              <FileInputLabel htmlFor="bannerInput">
                Ganti Foto Banner
                <HiddenInput 
                  id="bannerInput" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'banner')}
                />
              </FileInputLabel>
            </FormRow>
            <FormRow>
              <FileInputLabel htmlFor="avatarInput">
                Ganti Foto Profil
                <HiddenInput 
                  id="avatarInput" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                />
              </FileInputLabel>
            </FormRow>
          </SectionBody>

          {/* === SEKSI INFO DASAR === */}
          <SectionHeader>
            <h2>Info Dasar Akun</h2>
            <p>Kelola nama, handle, dan kata sandi Anda.</p>
          </SectionHeader>
          <SectionBody>
            <FormRow>
              <Label htmlFor="nama">Nama Pengguna</Label>
              <Input 
                type="text" 
                id="nama" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="handle">Handle (@)</Label>
              <Input 
                type="text" 
                id="handle" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                placeholder="Ceritakan sedikit tentang dirimu"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </FormRow>
            <FormRow>
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Kosongkan jika tidak ingin ganti"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormRow>
          </SectionBody>

          {/* --- TOMBOL SIMPAN --- */}
          <SectionFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan Akun'}
            </Button>
          </SectionFooter>
        </Form>
      </SettingsWrapper>
    </>
  );
};

export default EditProfil;