// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Ambil koneksi kita

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi yang ada pas app load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // "Dengerin" perubahan auth (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Nilai yang mau di-share ke seluruh app
  const value = {
    session,
    user,
    // Kita bisa tambahin fungsi login/logout di sini
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