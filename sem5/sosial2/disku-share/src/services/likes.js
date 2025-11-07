import { supabase } from "./supabase.js";

export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk me-like!");
    return;
  }

  const { data, error } = await supabase
    .from("likes")
    .insert([{ 
      post_id: postId, 
      user_id: user.id 
    }]);

  if (error) {
    console.warn("Gagal me-like (mungkin sudah di-like):", error.message);
    return;
  }
  
  console.log("Berhasil me-like post!");

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
        notification_type: 'like_post',
        post_id: postId                 
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
    .eq("post_id", postId)    
    .eq("user_id", user.id);  

  if (error) {
    console.error("Gagal batal-like:", error.message);
  } else {
    console.log("Berhasil batal-like post!");
  }

  return data;
}

export async function getUsersWhoLikedPost(postId, page = 1, limit = 20) {
  // 1. Hitung rentang (range)
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("likes")
    .select("users(id, name, handle, avatar_url)")
    .eq("post_id", postId)
    .not(
      'user_id', 
      'in', 
      '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
    )
    .range(from, to);

  if (error) {
    console.error("Gagal mengambil daftar likers:", error);
    return [];
  }
  return data.map(item => item.users);
}
