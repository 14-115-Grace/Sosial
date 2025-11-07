// posts.js
import { supabase } from "./supabase.js";

/**
 * Membuat post baru DAN melampirkan kategorinya.
 * @param {string} content - Isi dari post.
 * @param {string[]} categoryNames - Array nama tag, misal: ["EtikaAI", "KopiLokal"]
 */
export async function createPost(content, categoryNames = []) {
  
  // ----- Bagian 1: Buat atau temukan ID Kategori (UPSERT) -----
  // KITA KEMBALIKAN KE 'UPSERT'. Ini akan membuat kategori baru jika belum ada.
  const categoryObjects = categoryNames.map(name => ({ name: name.trim() }));
  
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .upsert(categoryObjects, { onConflict: 'name' }) // Membutuhkan 'name' sebagai UNIQUE
    .select("id, name");

  if (categoryError) {
    console.error("Gagal membuat/mencari kategori:", categoryError);
    return null;
  }

  // ----- Bagian 2: Buat Postingan -----
  // (Kode ini tidak berubah)
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert([{ content: content }])
    .select("id")
    .single();

  if (postError) {
    console.error("Gagal membuat post:", postError);
    return null;
  }

  const newPostId = postData.id;

  // ----- Bagian 3: Tautkan Postingan dengan Kategori -----
  // (Kode ini tidak berubah)
  if (categories && categories.length > 0) {
    const links = categories.map(cat => ({
      post_id: newPostId,
      category_id: cat.id
    }));

    const { error: linkError } = await supabase
      .from("post_categories")
      .insert(links);

    if (linkError) {
      console.error("Gagal menautkan kategori ke post:", linkError);
    }
  }

  console.log("Post dan tag berhasil dibuat!");
  return postData; // Mengembalikan post yang baru dibuat
}

export async function getPosts(page = 1, limit = 10) {
  // Panggil fungsi SQL yang baru saja Anda buat
  const { data, error } = await supabase.rpc('get_all_posts_with_user_data', {
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil post:", error);
    return [];
  }

  // Ubah 'user' (dari SQL) menjadi 'users' (yang diharapkan PostCard)
  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

// ... (fungsi updatePost dan deletePost Anda tetap sama) ...

// Ganti searchPosts LAMA Anda dengan yang INI:
export async function searchPosts(queryText, page = 1, limit = 10) {
  if (!queryText || queryText.trim() === "") {
    return [];
  }

  // Panggil fungsi RPC yang baru kita buat di Langkah 1
  const { data, error } = await supabase.rpc('search_posts_with_user_data', {
    search_term: queryText,
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mencari post (RPC):", error);
    return [];
  }
  
  if (!data) {
    return [];
  }

  // 'data' sudah memiliki format yang benar
  // Kita hanya perlu mengubah 'user' (dari SQL) menjadi 'users'
  // agar konsisten dengan PostCard
  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

// Ganti getLikedPosts LAMA Anda dengan yang INI:
export async function getLikedPosts(userId, page = 1, limit = 10) {
  
  // Panggil fungsi RPC baru kita
  const { data, error } = await supabase.rpc('get_liked_posts_by_user', {
    user_id_input: userId,
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil post yang disukai (RPC):", error);
    return [];
  }
  if (!data) return [];

  // Ubah 'user' (dari SQL) menjadi 'users' (yang diharapkan PostCard)
  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

// --- UPDATE (Mengedit Post) ---
// RLS akan otomatis memblokir ini jika user_id tidak cocok.
export async function updatePost(postId, newContent) {
  const { data, error } = await supabase
    .from("posts")
    .update({ content: newContent, updated_at: 'now()' }) // (Opsional: tambahkan kolom updated_at)
    .eq("id", postId);

  if (error) {
    console.error("Gagal update post:", error.message);
    return null;
  }
  return data;
}

// --- DELETE (Menghapus Post) ---
// RLS akan otomatis memblokir ini jika user_id tidak cocok.
export async function deletePost(postId) {
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Gagal hapus post:", error.message);
    return null;
  }
  return data;

}

/**
 * Mengambil SEMUA post yang dibuat oleh SATU user.
 * @param {string} userId - ID dari user yang post-nya mau diliat.
 * @param {number} page - Halaman ke-berapa (untuk pagination).
 * @param {number} limit - Berapa post per halaman.
 */
export async function getPostsByUserId(userId, page = 1, limit = 10) {

  // Panggil fungsi RPC baru kita
  const { data, error } = await supabase.rpc('get_posts_by_user_id', {
    user_id_input: userId,
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil post by user (RPC):", error);
    return [];
  }
  if (!data) return [];

  // Ubah 'user' (dari SQL) menjadi 'users' (yang diharapkan PostCard)
  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

/**
 * Mengambil SATU post berdasarkan ID-nya.
 * (Untuk halaman detail post)
 */
export async function getPostById(postId) {
  const { data, error } = await supabase.rpc('get_post_by_id', {
    post_id_input: postId
  })
  .single(); // Kita hanya ingin satu hasil

  if (error) {
    console.error("Gagal mengambil post by id:", error);
    return null;
  }
  
  // Ubah 'user' (dari SQL) menjadi 'users' (yang diharapkan PostCard)
  return {
    ...data,
    users: data.user
  };
}