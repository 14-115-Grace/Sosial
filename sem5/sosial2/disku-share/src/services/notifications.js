// notifications.js
import { supabase } from "./supabase.js";

/**
 * Mengambil notifikasi untuk pengguna yang sedang login.
 * Menggunakan paginasi.
 */
export async function getNotifications(page = 1, limit = 15) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      created_at,
      notification_type,
      is_read,
      actor:actor_id ( id, name, handle, avatar_url ),
      post:post_id ( id, content )
    `)
    .eq("recipient_id", user.id) // RLS juga mengamankan ini
    .not(
        'actor_id', // Filter notifikasi dari...
        'in', 
        '(select blocked_id from blocks where blocker_id = auth.uid() union select blocker_id from blocks where blocked_id = auth.uid())'
        )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Gagal mengambil notifikasi:", error);
    return [];
  }
  
  // Hasilnya akan seperti:
  // { id: ..., actor: { name: "Budi" }, post: { content: "..." } }
  return data;
}

/**
 * Menandai satu notifikasi sebagai 'telah dibaca'.
 * @param {string} notificationId - ID dari notifikasi yang akan ditandai.
 */
export async function markNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId); // RLS akan memastikan ini milik kita

  if (error) {
    console.error("Gagal menandai notif:", error.message);
  }
}

/**
 * Menandai SEMUA notifikasi yang belum dibaca sebagai 'telah dibaca'.
 */
export async function markAllNotificationsAsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("recipient_id", user.id)
    .eq("is_read", false); // Hanya update yang belum dibaca

  if (error) {
    console.error("Gagal menandai semua notif:", error.message);
  }
}