import { supabase } from "./supabase.js";

// --- REGISTER USER ---
export async function registerUser(fullName, email, password, handle) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: { data: { name: fullName } },
  });

  if (error) {
    alert("❌ Gagal daftar: " + error.message);
    return;
  }

  alert("✅ Pendaftaran berhasil! Cek email kamu untuk verifikasi.");

  // opsional: simpan ke tabel users
  if (data.user) {
    await supabase.from("users").insert([
      { id: data.user.id, name: fullName, email: email, handle: handle },
    ]);
  }
}

// --- LOGIN USER ---
export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Gagal login: " + error.message);
    return;
  }

  alert("✅ Login berhasil, selamat datang " + data.user.email);
}


// Fungsi untuk mengambil data profil lengkap
export async function getUserProfile(userId) {
  
  // KITA GANTI NAMA FUNGSINYA AGAR SESUAI DENGAN SQL ANDA
  const { data, error } = await supabase.rpc('get_user_profile_by_id_admin', {
    user_id_input: userId
  })
  .single(); // <-- .single() penting karena SQL Anda mengembalikan 1 objek json

  if (error) {
    console.error("Gagal ambil profil (SQL):", error);
    return null;
  }
  
  return data; // 'data' sekarang adalah objek profil
}

/**
 * Mengambil data profil lengkap berdasarkan @handle (username)
 * @param {string} handle - Handle unik pengguna (misal: "leony07")
 */
export async function getUserByHandle(handle) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      email,
      handle,
      bio,
      avatar_url,
      banner_url,
      following_count:follows!follower_id ( count ),
      follower_count:follows!following_id ( count )
    `
    )
    .eq("handle", handle) // <-- Filter berdasarkan 'handle', BUKAN 'id'
    .single();

  if (error) {
    console.error("Gagal ambil profil by handle:", error);
    return null;
  }

  // (Kode pemrosesan data 'count' tetap sama persis)
  if (!data) return null;
  const profile = {
    ...data,
    following_count: data.following_count[0]?.count || 0,
    follower_count: data.follower_count[0]?.count || 0,
  };
  
  return profile;
}

/**
 * Meng-upload DAN mengatur avatar profil baru dalam satu langkah.
 * @param {File} file - File gambar yang didapat dari input <input type="file">
 */
export async function uploadAvatar(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Harus login untuk upload avatar.");
    return null;
  }

  const filePath = `${user.id}/${Date.now()}_${file.name}`;

  // Langkah 1: Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Gagal upload avatar:", uploadError);
    alert("Gagal upload foto.");
    return null;
  }

  // Langkah 2: Ambil URL publiknya
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  
  const newAvatarUrl = urlData.publicUrl;

  // Langkah 3 (BARU): Simpan URL ke database
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: newAvatarUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Gagal update profil:", updateError);
    alert("Upload foto berhasil, tapi gagal menyimpan ke profil.");
    return null;
  }

  alert("Foto profil berhasil diperbarui!");
  return newAvatarUrl; // Kembalikan URL jika frontend membutuhkannya
}

/**
 * Memperbarui data profil pengguna (bio atau avatar_url)
 * @param {object} profileData - Contoh: { bio: "Halo" } atau { avatar_url: "http://..." }
 */
export async function updateProfile(profileData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("users")
    .update(profileData) // profileData adalah objek, misal: { bio, avatar_url }
    .eq("id", user.id); // RLS juga akan memverifikasi ini

  if (error) {
    console.error("Gagal update profil:", error);
    alert("Gagal update profil.");
  } else {
    alert("Profil berhasil diperbarui!");
  }
}

/**
 * Meng-upload DAN mengatur banner profil baru dalam satu langkah.
 * @param {File} file - File gambar yang didapat dari input <input type="file">
 */
export async function uploadBanner(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Harus login untuk upload banner.");
    return null;
  }

  const filePath = `${user.id}/banner_${Date.now()}_${file.name}`;

  // Langkah 1: Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Gagal upload banner:", uploadError);
    alert("Gagal upload foto banner.");
    return null;
  }

  // Langkah 2: Ambil URL publiknya
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  
  const newBannerUrl = urlData.publicUrl;

  // Langkah 3 (BARU): Simpan URL ke database
  const { error: updateError } = await supabase
    .from("users")
    .update({ banner_url: newBannerUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Gagal update profil:", updateError);
    alert("Upload banner berhasil, tapi gagal menyimpan ke profil.");
    return null;
  }

  alert("Banner profil berhasil diperbarui!");
  return newBannerUrl;
}

/**
 * Melakukan logout pengguna yang sedang login.
 */
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Gagal logout:", error.message);
    alert("Gagal logout, silakan coba lagi.");
  } else {
    // Tim frontend Anda akan menangani ini
    // dengan memindahkan pengguna ke halaman login.
    alert("Anda berhasil keluar!");
    // window.location.href = "/login.html"; // (Contoh untuk frontend)
  }
}

/**
 * Memperbarui kata sandi pengguna yang sedang login.
 * @param {string} newPassword - Kata sandi baru yang akan diatur.
 */
export async function updateUserPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error("Gagal update kata sandi:", error.message);
    alert("Gagal memperbarui kata sandi: " + error.message);
  } else {
    alert("Kata sandi Anda telah berhasil diperbarui!");
  }
}

/**
 * Mengirim email "Lupa Password" ke pengguna.
 * @param {string} email - Email dari pengguna yang lupa password.
 */
export async function sendPasswordResetEmail(email) {
  // Ini adalah URL ke HALAMAN FRONTEND BARU yang harus dibuat oleh tim Anda.
  // Ini adalah halaman tempat pengguna akan memasukkan password baru mereka.
  const resetURL = 'http://localhost:3000/update-password.html'; // <-- Ganti dengan URL frontend Anda

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetURL,
  });

  if (error) {
    console.error("Gagal mengirim email reset:", error.message);
    alert("Gagal mengirim email reset: " + error.message);
  } else {
    alert("Email reset password telah dikirim! Silakan cek inbox Anda.");
  }
}