// blocks.js
import { supabase } from "./supabase.js";

/**
 * Memblokir seorang pengguna.
 * @param {string} userIdToBlock - ID pengguna yang akan diblokir.
 */
export async function blockUser(userIdToBlock) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk memblokir!");
    return;
  }

  // Mencegah blokir diri sendiri
  if (user.id === userIdToBlock) {
    console.warn("Tidak bisa memblokir diri sendiri.");
    return;
  }

  const { data, error } = await supabase
    .from("blocks")
    .insert([
      { 
        blocker_id: user.id, // ID saya
        blocked_id: userIdToBlock // ID orang yang saya blokir
      }
    ]);

  if (error) {
    console.error("Gagal memblokir:", error.message);
  } else {
    console.log("Pengguna berhasil diblokir!");
  }
  return data;
}

/**
 * Membatalkan blokir seorang pengguna.
 * @param {string} userIdToUnblock - ID pengguna yang akan dibatal-blokir.
 */
export async function unblockUser(userIdToUnblock) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", user.id) // RLS juga akan memeriksa ini
    .eq("blocked_id", userIdToUnblock);

  if (error) {
    console.error("Gagal batal-blokir:", error.message);
  } else {
    console.log("Berhasil batal-blokir!");
  }
  return data;
}