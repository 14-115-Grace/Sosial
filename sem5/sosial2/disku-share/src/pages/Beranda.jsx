// src/pages/Beranda.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../services/posts';
import PostCard from '../components/post/PostCard';
import Loading from '../components/common/Loading';
import CreatePostBox from '../components/post/CreatePostBox'; // <-- 1. IMPOR

// --- Styled Components ---
const BerandaWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
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
// ... (Hapus style CreatePostBox, Avatar, dll. dari sini) ...

// --- Main Component ---
const Beranda = () => {
  const { user } = useAuth();
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

  // Handler ini dipicu oleh <CreatePostBox>
  const handlePostCreated = () => {
    fetchPosts(); // Cukup fetch ulang post-nya
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== deletedPostId)
    );
  };

  return (
    <BerandaWrapper>
      {/* --- Sapaan (sesuai Beranda.png) --- */}
      <PageHeader>Halo, {user?.user_metadata?.name || 'Adit'}!</PageHeader>
      <p style={{marginTop: "-1.5rem", marginBottom: "2rem", fontSize: "1.1rem"}}>
        Saatnya memulai diskusi baru dan berbagi wawasan!
      </p>

      {/* --- 2. PANGGIL KOMPONEN BARU --- */}
      <CreatePostBox onPostCreated={handlePostCreated} />

      {/* --- Timeline (sesuai Beranda.png) --- */}
      <SubHeader>Linimasa Terbaru</SubHeader>
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
    </BerandaWrapper>
  );
};

export default Beranda;