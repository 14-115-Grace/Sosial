// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Ambil koneksi kita
import { getUserProfile } from '../services/auth'; // <-- 1. IMPORT FUNGSI PROFIL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // <-- State ini sudah ada
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi yang ada pas app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Jangan setLoading(false) di sini, biarkan effect kedua yg urus
    });

    // "Dengerin" perubahan auth (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        // Jangan setLoading(false) di sini juga
      }
    );

    // Cleanup listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // --- ⬇️ INI BAGIAN BARU YANG KITA TAMBAHKAN ⬇️ ---
  // Effect ini TUGASNYA mengambil data profil dari database
  // SETELAH kita mendapatkan 'user' dari effect di atas.
  useEffect(() => {
    // Jika 'user' ada (sudah login)
    if (user) {
      setLoading(true); // Mulai loading data profil
      getUserProfile(user.id)
        .then((profileData) => {
          setProfile(profileData); // Simpan data profil ke state
        })
        .catch((err) => {
          console.error("Gagal fetch profile di context:", err);
          setProfile(null); // Gagal fetch, pastikan profile null
        })
        .finally(() => {
          setLoading(false); // Selesai loading (berhasil atau gagal)
        });
    } else {
      // Jika 'user' null (logout)
      setProfile(null); // Kosongkan profil
      setLoading(false); // Selesai loading
    }
  }, [user]); // <-- Hook ini bergantung pada 'user'

  // Nilai yang mau di-share ke seluruh app
  const value = {
    session,
    user,
    profile, // <-- 2. PASTIKAN 'profile' ADA DI SINI
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Bikin hook kustom biar gampang dipake
export const useAuth = () => {
  return useContext(AuthContext);
};