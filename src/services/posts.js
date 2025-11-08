import { supabase } from "./supabase.js";

export async function createPost(content, categoryNames = []) {
  
  const categoryObjects = categoryNames.map(name => ({ name: name.trim() }));
  
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .upsert(categoryObjects, { onConflict: 'name' }) 
    .select("id, name");

  if (categoryError) {
    console.error("Gagal membuat/mencari kategori:", categoryError);
    return null;
  }

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
  return postData; 
}

export async function getPosts(page = 1, limit = 10) {
  const { data, error } = await supabase.rpc('get_all_posts_with_user_data', {
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil post:", error);
    return [];
  }

  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

export async function searchPosts(queryText, page = 1, limit = 10) {
  if (!queryText || queryText.trim() === "") {
    return [];
  }

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

  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

export async function getLikedPosts(userId, page = 1, limit = 10) {
  
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

  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

export async function updatePost(postId, newContent) {
  const { data, error } = await supabase
    .from("posts")
    .update({ content: newContent, updated_at: 'now()' }) 
    .eq("id", postId);

  if (error) {
    console.error("Gagal update post:", error.message);
    return null;
  }
  return data;
}

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

  return data.map(post => ({
    ...post,
    users: post.user 
  }));
}

export async function getPostById(postId) {
  const { data, error } = await supabase.rpc('get_post_by_id', {
    post_id_input: postId
  })
  .single();

  if (error) {
    console.error("Gagal mengambil post by id:", error);
    return null;
  }
  
  return {
    ...data,
    users: data.user
  };
}
