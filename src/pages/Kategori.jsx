// src/pages/Kategori.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPosts, searchPosts } from '../services/posts'; // <-- 1. IMPORT 'searchPosts'
import PostCard from '../components/post/PostCard';
import Loading from '../components/common/Loading';
import RightSidebarKategori from '../components/layout/RightSidebarKategori';
import CreatePostBox from '../components/post/CreatePostBox';

// --- Styled Components (Biarkan apa adanya) ---
const PageWrapper = styled.div`
  display: flex;
`;
const MainFeed = styled.div`
  flex: 1;
  max-width: 700px;
`;
const PageHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;
const SubHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;
// ---

const Kategori = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // 2. Buat state untuk menyimpan 'query' pencarian yang aktif
  const [activeQuery, setActiveQuery] = useState('');

  // 3. Ubah useEffect agar 'mendengarkan' perubahan 'activeQuery'
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let data;
      
      if (activeQuery) {
        // Jika ADA query, panggil searchPosts
        data = await searchPosts(activeQuery);
      } else {
        // Jika TIDAK ADA query, panggil getPosts (default)
        data = await getPosts(1, 20);
      }
      
      setPosts(data);
      setLoading(false);
    };

    fetchPosts();
  }, [activeQuery]); // <-- 4. Jalankan ulang effect ini saat 'activeQuery' berubah

  const handlePostCreated = () => {
    // Saat post baru dibuat, reset pencarian agar post baru muncul
    setActiveQuery(''); 
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== deletedPostId)
    );
  };

  // 5. Buat fungsi handler yang akan dikirim ke Sidebar
  const handleSearchSubmit = (query) => {
    setActiveQuery(query);
  };

  return (
    <PageWrapper>
      {/* === KOLOM TENGAH (FEED) === */}
      <MainFeed>
        <PageHeader>Jelajahi Kategori</PageHeader>
        <p style={{marginTop: "-1.5rem", marginBottom: "2rem", fontSize: "1.1rem"}}>
          Temukan topik hangat yang sedang dibicarakan komunitas.
        </p>

        <CreatePostBox onPostCreated={handlePostCreated} />
        
        {/* 6. Ganti judul SubHeader secara dinamis */}
        <SubHeader>
          {activeQuery ? `Hasil untuk "${activeQuery}"` : 'Postingan Terkini'}
        </SubHeader>
        
        {loading ? (
          <Loading />
        ) : posts.length > 0 ? ( // 7. Cek jika 'posts' ada isinya
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDeleteSuccess={handlePostDeleted}
            />
          ))
        ) : (
          // 8. Tampilkan pesan jika tidak ada hasil
          <p>Tidak ada postingan yang ditemukan.</p> 
        )}
      </MainFeed>
      
      {/* === KOLOM KANAN (GUTTER) === */}
      {/* 9. Kirim fungsi handler sebagai prop ke Sidebar */}
      <RightSidebarKategori onSearchSubmit={handleSearchSubmit} />
    </PageWrapper>
  );
};

export default Kategori;