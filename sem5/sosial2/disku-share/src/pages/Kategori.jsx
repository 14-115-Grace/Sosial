// src/pages/Kategori.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPosts } from '../services/posts';
import PostCard from '../components/post/PostCard';
import Loading from '../components/common/Loading';
import RightSidebarKategori from '../components/layout/RightSidebarKategori';
import CreatePostBox from '../components/post/CreatePostBox'; // <-- 1. IMPOR

// --- Styled Components ---
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

// --- Main Component ---
const Kategori = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getPosts(1, 20);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh feed
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== deletedPostId)
    );
  };

  return (
    <PageWrapper>
      {/* === KOLOM TENGAH (FEED) === */}
      <MainFeed>
        <PageHeader>Jelajahi Kategori</PageHeader>
        <p style={{marginTop: "-1.5rem", marginBottom: "2rem", fontSize: "1.1rem"}}>
          Temukan topik hangat yang sedang dibicarakan komunitas.
        </p>

        {/* --- 2. PANGGIL KOMPONEN BARU --- */}
        <CreatePostBox onPostCreated={handlePostCreated} />
        
        {/* --- Timeline (sesuai Kategori.png) --- */}
        <SubHeader>Postingan Terkini</SubHeader>
        {loading ? (
          <Loading />
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDeleteSuccess={handlePostDeleted}
            />
          ))
        )}
      </MainFeed>
      
      {/* === KOLOM KANAN (GUTTER) === */}
      <RightSidebarKategori />
    </PageWrapper>
  );
};

export default Kategori;