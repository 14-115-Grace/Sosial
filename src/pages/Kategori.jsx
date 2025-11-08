import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPosts, searchPosts } from '../services/posts.js'; 
import PostCard from '../components/post/PostCard.jsx';
import Loading from '../components/common/Loading.jsx';
import RightSidebarKategori from '../components/layout/RightSidebarKategori.jsx';
import CreatePostBox from '../components/post/CreatePostBox.jsx';

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

const Kategori = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuery, setActiveQuery] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    let data;
    
    if (activeQuery) {
      data = await searchPosts(activeQuery);
    } else {
      data = await getPosts(1, 20);
    }
    
    setPosts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    // Panggil fetchPosts saat komponen dimuat
    fetchPosts();
  }, [activeQuery]); 

  const handlePostCreated = () => {
    if (activeQuery) {
      // Jika kita sedang mencari, reset pencarian
      setActiveQuery(''); 
    } else {
      // panggil fetchPosts() secara manual untuk refresh list
      fetchPosts();
    }
  };
  
  const handlePostDeleted = (deletedPostId) => {
    setPosts(currentPosts => 
      currentPosts.filter(post => post.id !== deletedPostId)
    );
  };

  const handleSearchSubmit = (query) => {
    setActiveQuery(query);
  };

  return (
    <PageWrapper>
      <MainFeed>
        <PageHeader>Jelajahi Kategori</PageHeader>
        <p style={{marginTop: "-1.5rem", marginBottom: "2rem", fontSize: "1.1rem"}}>
          Temukan topik hangat yang sedang dibicarakan komunitas.
        </p>

        <CreatePostBox onPostCreated={handlePostCreated} />
        
        <SubHeader>
          {activeQuery ? `Hasil untuk "${activeQuery}"` : 'Postingan Terkini'}
        </SubHeader>
        
        {loading ? (
          <Loading />
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDeleteSuccess={handlePostDeleted}
            />
          ))
        ) : (
          <p>Tidak ada postingan yang ditemukan.</p> 
        )}
      </MainFeed>
      
      <RightSidebarKategori onSearchSubmit={handleSearchSubmit} />
    </PageWrapper>
  );
};

export default Kategori;
