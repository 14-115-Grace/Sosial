// Anda bisa tambahkan ini di posts.js atau file baru likes.js
import { supabase } from "./supabase.js";

// --- CREATE (Me-like sebuah Post) ---
// user_id akan diisi oleh RLS (WITH CHECK) dan Primary Key.
// Kita hanya perlu tahu post_id mana yang di-like.
export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk me-like!");
    return;
  }

  // Langkah 1: Lakukan aksi like (kode lama Anda)
  const { data, error } = await supabase
    .from("likes")
    .insert([{ 
      post_id: postId, 
      user_id: user.id 
    }]);

  if (error) {
    console.warn("Gagal me-like (mungkin sudah di-like):", error.message);
    return; // Hentikan jika gagal (atau sudah di-like)
  }
  
  console.log("Berhasil me-like post!");

  // Langkah 2 (BARU): Cari tahu siapa pemilik post & buat notifikasi
  // Kita perlu query dulu untuk cari tahu siapa 'recipient_id'-nya
  const { data: postData } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  // Hanya kirim notif jika pemilik post bukan diri sendiri
  if (postData && postData.user_id !== user.id) {
    await supabase.from("notifications").insert([
      {
        recipient_id: postData.user_id, // Penerima = pemilik post
        actor_id: user.id,              // Aktor = saya (yang me-like)
        notification_type: 'like_post',
        post_id: postId                 // Post yang terkait
      }
    ]);
  }
  
  return data;
}

// --- DELETE (Batal Like) ---
export async function unlikePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)    // RLS akan otomatis menambahkan
    .eq("user_id", user.id);  // "... DAN user_id = auth.uid()"

  if (error) {
    console.error("Gagal batal-like:", error.message);
  } else {
    console.log("Berhasil batal-like post!");
  }

  return data;
}

/**
 * Mengambil DAFTAR pengguna yang me-like sebuah post.
 * @param {string} postId - ID dari post yang ingin dilihat.
 */
export async function getUsersWhoLikedPost(postId, page = 1, limit = 20) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("likes")
    .select("users(id, name, handle, avatar_url)")
    .eq("post_id", postId)
    .not(
      'user_id', // Filter likers yang...
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil daftar likers:", error);
    return [];
  }
  return data.map(item => item.users);
}