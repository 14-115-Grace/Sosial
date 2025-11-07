// posts.js
import { supabase } from "./supabase.js";

/**
 * Membuat post baru DAN melampirkan kategorinya.
 * @param {string} content - Isi dari post.
 * @param {string[]} categoryNames - Array nama tag, misal: ["EtikaAI", "KopiLokal"]
 */
export async function createPost(content, categoryNames = []) {
  
  // ----- Bagian 1: Buat atau temukan ID Kategori -----
  // Kita gunakan upsert: jika tag "EtikaAI" belum ada, buat. Jika sudah, ambil ID-nya.
  // RLS di tabel 'categories' (INSERT: authenticated) mengizinkan ini.
  
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
  // RLS di tabel 'posts' (INSERT: authenticated) mengizinkan ini.
  
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert([{ content: content }])
    .select("id")
    .single(); // .single() agar hasilnya objek, bukan array

  if (postError) {
    console.error("Gagal membuat post:", postError);
    return null;
  }

  const newPostId = postData.id;

  // ----- Bagian 3: Tautkan Postingan dengan Kategori -----
  // RLS di 'post_categories' (INSERT: cek pemilik post) mengizinkan ini.
  
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
      // Peringatan: Post tetap dibuat, tapi tanpa tag.
    }
  }

  console.log("Post dan tag berhasil dibuat!");
  return postData; // Mengembalikan post yang baru dibuat
}

export async function getPosts(page = 1, limit = 10) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      users ( name, handle, avatar_url ), 
      likes ( count ),
      comments ( count )
    `)
    .not(
      'user_id', // Filter postingan dari...
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .order("created_at", { ascending: false })
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil post:", error);
    return [];
  }

  // ... (Sisa kode pemrosesan data Anda tetap sama) ...
  const processedData = data.map(post => ({
    ...post,
    like_count: post.likes.length > 0 ? post.likes[0].count : 0,
    comment_count: post.comments.length > 0 ? post.comments[0].count : 0
  }));
  processedData.forEach(post => {
    delete post.likes;
    delete post.comments;
  });  
  return processedData;
}

// ... (fungsi updatePost dan deletePost Anda tetap sama) ...

// Ganti searchPosts LAMA Anda dengan yang INI:
export async function searchPosts(queryText, page = 1, limit = 10) {
  if (!queryText || queryText.trim() === "") {
    return [];
  }
  const formattedQuery = `%${queryText}%`;

  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      users ( name, handle, avatar_url ), 
      likes ( count ),
      comments ( count )
    `)
    .ilike('content', formattedQuery)
    .not(
      'user_id', // Filter postingan dari...
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .order("created_at", { ascending: false })
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mencari post:", error);
    return [];
  }

  // ... (Sisa kode pemrosesan data Anda tetap sama) ...
  const processedData = data.map(post => ({
    ...post,
    like_count: post.likes.length > 0 ? post.likes[0].count : 0,
    comment_count: post.comments.length > 0 ? post.comments[0].count : 0
  }));
  processedData.forEach(post => {
    delete post.likes;
    delete post.comments;
  });  
  return processedData;
}

// Ganti getLikedPosts LAMA Anda dengan yang INI:
export async function getLikedPosts(userId, page = 1, limit = 10) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("likes")
    .select(
      `
      posts (
        id,
        content,
        created_at,
        users ( name, handle, avatar_url ), 
        likes ( count ),
        comments ( count )
      )
    `
    )
    .eq("user_id", userId)
    .not( // Filter postingan dari...
      'posts.user_id', 
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .order("created_at", { referencedTable: "posts", ascending: false })
    .range(from, to); // 2. Tambahkan .range()

  if (error) {
    console.error("Gagal mengambil post yang disukai:", error);
    return [];
  }

  // ... (Sisa kode pemrosesan data Anda tetap sama) ...
  const posts = data.map((item) => item.posts);
  const processedData = posts.map((post) => ({
    ...post,
    like_count: post.likes.length > 0 ? post.likes[0].count : 0,
    comment_count: post.comments.length > 0 ? post.comments[0].count : 0,
  }));
  processedData.forEach((post) => {
    delete post.likes;
    delete post.comments;
  });
  return processedData;
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
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      users ( name, handle, avatar_url ), 
      likes ( count ),
      comments ( count )
    `
    )
    .eq("user_id", userId) // <-- Filter utamanya di sini
    .not(
      'user_id', // Filter postingan dari...
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Gagal mengambil post by user:", error);
    return [];
  }
  
  const processedData = data.map(post => ({
    ...post,
    like_count: post.likes.length > 0 ? post.likes[0].count : 0,
    comment_count: post.comments.length > 0 ? post.comments[0].count : 0
  }));
  processedData.forEach(post => {
    delete post.likes;
    delete post.comments;
  });  
  return processedData;
}