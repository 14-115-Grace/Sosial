// Anda bisa tambahkan ini di posts.js atau buat file baru comments.js

import { supabase } from "./supabase.js";

// --- CREATE (Membuat Komentar Baru) ---
// Kita perlu tahu kita mau komentar di post mana (postId)
export async function createComment(postId, content) {
  const { data: { user } } = await supabase.auth.getUser(); // Kita butuh 'user' sekarang

  // Langkah 1: Buat komentar (kode lama Anda, sedikit diubah)
  const { data, error } = await supabase
    .from("comments")
    .insert([{ 
      content: content, 
      post_id: postId 
      // user_id akan diisi oleh Default Value
    }])
    .select()
    .single(); // .single() agar lebih mudah

  if (error) {
    console.error("Gagal membuat komentar:", error);
    return null;
  }

  // Langkah 2 (BARU): Cari tahu siapa pemilik post & buat notifikasi
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
        actor_id: user.id,              // Aktor = saya (yang komen)
        notification_type: 'new_comment',
        post_id: postId
      }
    ]);
  }
  
  return data;
}

// --- READ (Mengambil Komentar untuk SATU Post) ---
export async function getCommentsForPost(postId, page = 1, limit = 10) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      users ( name, handle, avatar_url ),
      comment_likes ( count )
    `)
    .eq("post_id", postId)
    .not(
      'user_id', // Filter komentar dari...
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .order("created_at", { ascending: true }) // Komentar biasanya diurutkan dari yang terlama
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil komentar:", error);
    return [];
  }

  // Proses data agar rapi (sama seperti di getPosts)
  const processedData = data.map(comment => ({
    ...comment,
    // Ubah array [ { count: N } ] menjadi angka N
    like_count: comment.comment_likes.length > 0 ? comment.comment_likes[0].count : 0
  }));
  
  // Hapus data mentah
  processedData.forEach(comment => delete comment.comment_likes);
  
  // Hasilnya akan seperti:
  // { id: ..., content: ..., users: {...}, like_count: 10 }
  
  return processedData;
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