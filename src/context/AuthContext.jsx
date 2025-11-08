import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase.js'; // Inisialisasi koneksi Supabase
import { getUserProfile } from '../services/auth.js'; // Fungsi untuk ambil data profil user dari DB

// Membuat context global untuk autentikasi
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State utama yang menyimpan data user, sesi, profil, dan status loading
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data profil berdasarkan user saat ini
  const fetchProfile = async (currentUser) => {
    if (currentUser) {
      setLoading(true);
      try {
        // Ambil data profil user dari Supabase
        const profileData = await getUserProfile(currentUser.id);
        setProfile(profileData);
      } catch (err) {
        console.error("Gagal fetch profile di context:", err);
        setProfile(null); // Jika gagal, kosongkan profil
      } finally {
        setLoading(false); // Pastikan loading berhenti
      }
    } else {
      // Jika tidak ada user, kosongkan profil
      setProfile(null);
      setLoading(false);
    }
  };

  // Efek pertama kali aplikasi dijalankan
  useEffect(() => {
    // Dapatkan sesi login aktif dari Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      fetchProfile(currentUser); // Ambil profil user
    });

    // Listener untuk mendeteksi perubahan status autentikasi (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        fetchProfile(currentUser); // Refresh profil saat status berubah
      }
    );

    // Bersihkan listener saat komponen dilepas (hindari memory leak)
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fungsi untuk refresh profil secara manual
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  // Fungsi untuk memperbarui profil di state lokal (tanpa fetch ke server)
  const updateLocalProfile = (newData) => {
    setProfile(prevProfile => ({
      ...prevProfile, // Ambil data lama
      ...newData      // Timpa dengan data baru (misal: name, bio, avatar_url)
    }));
  };

  // Nilai yang dibagikan ke seluruh komponen aplikasi melalui context
  const value = {
    session,
    user,
    profile,
    refreshProfile, 
    updateLocalProfile, // Fungsi untuk update profil lokal
  };

  // Provider untuk membungkus seluruh aplikasi (children)
  // Pastikan anak-anak tidak dirender sebelum loading selesai
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook khusus untuk menggunakan context ini di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
