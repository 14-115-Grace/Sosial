import { supabase } from "./supabase.js";

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_official", true); 

  if (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
  return data;
}

export async function getTrendingTags(limit = 5) {
  const { data, error } = await supabase.rpc('get_trending_categories', {
    limit_count: limit
  });

  if (error) {
    console.error("Gagal mengambil tren:", error);
    return [];
  }
  
  return data;
}
