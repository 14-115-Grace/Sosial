// categories.js
import { supabase } from "./supabase.js";

/**
 * Mengambil SEMUA kategori yang tersedia (untuk disarankan ke pengguna).
 */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_official", true); // <-- INI PERBAIKANNYA

  if (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
  return data;
}

/**
 * Mengambil tag yang sedang tren (memanggil fungsi SQL yang kita buat).
 */
export async function getTrendingTags(limit = 5) {
  const { data, error } = await supabase.rpc('get_trending_categories', {
    limit_count: limit
  });

  if (error) {
    console.error("Gagal mengambil tren:", error);
    return [];
  }

  // Hasilnya akan seperti:
  // [
  //   { category_id: "...", category_name: "EtikaAI", post_count: 50 },
  //   { category_id: "...", category_name: "KopiLokal", post_count: 30 }
  // ]
  return data;
}