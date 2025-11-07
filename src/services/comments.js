// Anda bisa tambahkan ini di posts.js atau buat file baru comments.js

import { supabase } from "./supabase.js";

// --- CREATE (Membuat Komentar Baru) ---
// Kita perlu tahu kita mau komentar di post mana (postId)
// --- CREATE (Membuat Komentar Baru) ---
export async function createComment(postId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk berkomentar.");
    return null;
  }

  // Langkah 1: Buat komentar
  const { data, error } = await supabase
    .from("comments")
    .insert([{ 
      content: content, 
      post_id: postId,
      user_id: user.id
    }])
    // Minta HANYA ID dan timestamp
    .select("id, created_at") 
    .single(); // Kita hanya insert satu

  if (error) {
    console.error("Gagal membuat komentar (INSERT error):", error.message);
    return null; 
  }

  // Langkah 2: Notifikasi (Biarkan apa adanya)
  const { data: postData } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (postData && postData.user_id !== user.id) {
    await supabase.from("notifications").insert([
      {
        recipient_id: postData.user_id,
        actor_id: user.id,
        notification_type: 'new_comment',
        post_id: postId
      }
    ]);
  }
  
  // 'data' sekarang adalah objek { id: "...", created_at: "..." }
  return data; 
}


// --- READ (Mengambil Komentar untuk SATU Post) ---
export async function getCommentsForPost(postId, page = 1, limit = 10) {

  // KITA PANGGIL FUNGSI SQL (RPC) YANG BARU DIBUAT
  const { data, error } = await supabase.rpc('get_comments_for_post', {
    post_id_input: postId,
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil komentar (RPC):", error);
    return [];
  }

  // Data sudah dalam format yang benar (termasuk 'users' sebagai JSON)
  // Tidak perlu 'processing' lagi.
  return data;
}

// --- DELETE (Menghapus Komentar) ---
// Ini sama seperti deletePost, tapi RLS akan memastikan
// hanya pemilik yang bisa melakukannya.
export async function deleteComment(commentId) {
  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Gagal hapus komentar:", error.message);
    return null;
  }
  return data;
}

// (Fungsi updateComment akan mirip dengan updatePost)

/**
 * Me-like sebuah komentar.
 * @param {string} commentId - ID dari komentar yang di-like.
 */
export async function likeComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk me-like!");
    return;
  }

  // Langkah 1: Lakukan aksi like (kode lama Anda)
  const { data, error } = await supabase
    .from("comment_likes")
    .insert([{ 
      comment_id: commentId, 
      user_id: user.id 
    }]);
  
  if (error) {
    console.warn("Gagal me-like komentar (mungkin sudah):", error.message);
    return; // Hentikan jika gagal
  }
  
  console.log("Berhasil me-like komentar!");

  // Langkah 2 (BARU): Cari tahu siapa pemilik komentar & buat notifikasi
  const { data: commentData } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  // Hanya kirim notif jika pemilik komentar bukan diri sendiri
  if (commentData && commentData.user_id !== user.id) {
    await supabase.from("notifications").insert([
      {
        recipient_id: commentData.user_id, // Penerima = pemilik komentar
        actor_id: user.id,                 // Aktor = saya (yang me-like)
        notification_type: 'like_comment'
        // post_id bisa null atau bisa kita cari (tapi lebih rumit)
      }
    ]);
  }
  
  return data;
}

/**
 * Membatalkan like pada sebuah komentar.
 * @param {string} commentId - ID dari komentar yang di-unlike.
 */
export async function unlikeComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", user.id); // RLS juga akan memverifikasi ini

  if (error) {
    console.error("Gagal batal-like komentar:", error.message);
  } else {
    console.log("Berhasil batal-like komentar!");
  }

  return data;
}

/**
 * Meng-edit (update) isi dari sebuah komentar.
 * @param {string} commentId - ID dari komentar yang akan diedit.
 * @param {string} newContent - Teks isi yang baru.
 */
export async function updateComment(commentId, newContent) {
  // RLS (yang sudah kita buat) akan memastikan
  // hanya pemilik komentar yang bisa melakukan ini.
  const { data, error } = await supabase
    .from("comments")
    .update({ content: newContent })
    .eq("id", commentId)
    .select(); // Kembalikan data yang di-update

  if (error) {
    console.error("Gagal update komentar:", error.message);
    return null;
  }
  return data;
}