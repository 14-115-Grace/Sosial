// Anda bisa buat file baru follows.js
import { supabase } from "./supabase.js";

// --- CREATE (Follow seorang Pengguna) ---
export async function followUser(userIdToFollow) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk follow!");
    return;
  }
  if (user.id === userIdToFollow) {
    console.warn("Tidak bisa follow diri sendiri.");
    return;
  }

  // Langkah 1: Lakukan aksi follow (kode lama Anda)
  const { data, error } = await supabase
    .from("follows")
    .insert([{ 
      follower_id: user.id, 
      following_id: userIdToFollow 
    }]);

  if (error) {
    console.error("Gagal follow:", error.message);
    return; // Hentikan jika gagal
  }
  
  console.log("Berhasil follow!");

  // Langkah 2 (BARU): Buat notifikasi
  // RLS (INSERT, check: auth.uid() = actor_id) mengizinkan ini
  await supabase.from("notifications").insert([
    {
      recipient_id: userIdToFollow, // Penerima = orang yang di-follow
      actor_id: user.id,            // Aktor = saya (yang me-follow)
      notification_type: 'new_follow'
      // post_id sengaja null
    }
  ]);
  
  return data;
}

// --- DELETE (Unfollow seorang Pengguna) ---
export async function unfollowUser(userIdToUnfollow) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id) // RLS juga akan memeriksa ini
    .eq("following_id", userIdToUnfollow);

  if (error) {
    console.error("Gagal unfollow:", error.message);
  } else {
    console.log("Berhasil unfollow!");
  }
  return data;
}

/**
 * Mengambil DAFTAR pengguna yang ME-FOLLOW seorang user (Followers).
 * @param {string} userId - ID pengguna yang profilnya sedang dilihat.
 */
export async function getFollowersList(userId, page = 1, limit = 20) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("follows")
    .select("users!follower_id(id, name, handle, avatar_url)")
    .eq("following_id", userId)
    .not(
        'follower_id', // Filter followers yang...
        'in', 
        '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
        )
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil daftar followers:", error);
    return [];
  }
  return data.map(item => item.users);
}

export async function getFollowingList(userId, page = 1, limit = 20) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("follows")
    .select("users!following_id(id, name, handle, avatar_url)")
    .eq("follower_id", userId)
    .not(
        'following_id', // Filter following yang...
        'in', 
        '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
        )
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil daftar following:", error);
    return [];
  }
  return data.map(item => item.users);
}