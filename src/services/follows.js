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

  const { data, error } = await supabase
    .from("follows")
    .insert([{ 
      follower_id: user.id, 
      following_id: userIdToFollow 
    }]);

  if (error) {
    console.error("Gagal follow:", error.message);
    return;
  }
  
  console.log("Berhasil follow!");

  await supabase.from("notifications").insert([
    {
      recipient_id: userIdToFollow, 
      actor_id: user.id,           
      notification_type: 'new_follow'
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
    .eq("follower_id", user.id)
    .eq("following_id", userIdToUnfollow);

  if (error) {
    console.error("Gagal unfollow:", error.message);
  } else {
    console.log("Berhasil unfollow!");
  }
  return data;
}

export async function getFollowersList(userId, page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("follows")
    .select("users!follower_id(id, name, handle, avatar_url)")
    .eq("following_id", userId)
    .not(
        'follower_id', 
        'in', 
        '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
        )
    .range(from, to); 

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
        'following_id',
        'in', 
        '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
        )
    .range(from, to); 

  if (error) {
    console.error("Gagal mengambil daftar following:", error);
    return [];
  }
  return data.map(item => item.users);
}
