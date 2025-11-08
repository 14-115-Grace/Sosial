import { supabase } from "./supabase.js";

export async function createComment(postId, content) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk berkomentar.");
    return null;
  }

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
  
  return data; 
}


// --- READ (Mengambil Komentar untuk SATU Post) ---
export async function getCommentsForPost(postId, page = 1, limit = 10) {

  const { data, error } = await supabase.rpc('get_comments_for_post', {
    post_id_input: postId,
    page_num: page,
    page_limit: limit
  });

  if (error) {
    console.error("Gagal mengambil komentar (RPC):", error);
    return [];
  }
  
  return data;
}

// --- DELETE (Menghapus Komentar) ---
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

export async function likeComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk me-like!");
    return;
  }

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

  const { data: commentData } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (commentData && commentData.user_id !== user.id) {
    await supabase.from("notifications").insert([
      {
        recipient_id: commentData.user_id, // Penerima = pemilik komentar
        actor_id: user.id,                 // Aktor = saya (yang me-like)
        notification_type: 'like_comment'
      }
    ]);
  }
  
  return data;
}

export async function unlikeComment(commentId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Gagal batal-like komentar:", error.message);
  } else {
    console.log("Berhasil batal-like komentar!");
  }

  return data;
}

export async function updateComment(commentId, newContent) {
  const { data, error } = await supabase
    .from("comments")
    .update({ content: newContent })
    .eq("id", commentId)
    .select(); 

  if (error) {
    console.error("Gagal update komentar:", error.message);
    return null;
  }
  return data;
}
