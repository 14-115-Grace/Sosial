// src/pages/Populer.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPosts } from '../services/posts'; //
import PostCard from '../components/post/PostCard';
import Loading from '../components/common/Loading';
import RightSidebar from '../components/layout/RightSidebar'; // <-- IMPOR GUTTER

// --- Styled Components ---
const PageWrapper = styled.div`
  display: flex;
`;

const MainFeed = styled.div`
  flex: 1; // Bikin feed ngambil sisa ruang
  max-width: 700px; // (Sama kayak Beranda)
`;

const PageHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

// --- Main Component ---
const Populer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Kita perlu 'getPopularPosts()'
  // Untuk sekarang, kita pake getPosts() aja
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // Nanti ganti ini pake service yg bener
      const data = await getPosts(1, 20); 
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Handler kalo post dihapus
  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== deletedPostId)
    );
  };

  return (
    <PageWrapper>
      {/* === KOLOM TENGAH (FEED) === */}
      <MainFeed>
        <PageHeader>Populer</PageHeader>
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
      <RightSidebar />
    </PageWrapper>
  );
};

export default Populer;