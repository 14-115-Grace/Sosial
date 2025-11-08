// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getPostById } from '../services/posts.js'; 
import { getCommentsForPost } from '../services/comments.js';
import PostCard from '../components/post/PostCard.jsx'; 
import Loading from '../components/common/Loading.jsx';
import CreateCommentBox from '../components/post/CreateCommentBox.jsx';
import CommentCard from '../components/comment/CommentCard.jsx'; //ini dipakai buat nampilin komentar

// Wrapper utama halaman detail post
const PageWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

// Tombol balik ke halaman sebelumnya
const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
`;

// Header komentar
const CommentsHeader = styled.h3`
  font-size: 1.2rem;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const PostDetail = () => {
  const { postId } = useParams(); // Ambil ID post dari URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth(); // Data user yang login

  useEffect(() => {
    // Fetch data post + komentar sekaligus
    const fetchData = async () => {
      setLoading(true);

      const postData = await getPostById(postId); // Ambil post berdasarkan ID
      
      if (postData) {
        setPost(postData);

        // Ambil semua komentar untuk post ini
        const commentData = await getCommentsForPost(postId);
        setComments(commentData);
      }

      setLoading(false);
    };

    fetchData();
  }, [postId]); // Re-fetch kalau ID post berubah

  // Fungsi buat nambah komentar baru ke state tanpa reload
  const handleCommentCreated = (newCommentData, originalContent) => {

    // Format komentar baru biar match sama struktur data dari DB
    const newComment = {
      id: newCommentData.id,
      created_at: newCommentData.created_at,
      content: originalContent,
      like_count: 0,
      users: { 
        name: profile.name,
        handle: profile.handle,
        avatar_url: profile.avatar_url,
        id: profile.id 
      }
    };

    // Tambahin ke list komentar yang udah ada
    setComments(currentComments => [...currentComments, newComment]);
    
    // Update jumlah komentar di post
    setPost(currentPost => ({
      ...currentPost,
      comment_count: (currentPost.comment_count || 0) + 1
    }));
  };

  // Kalau masih loading, tampilin spinner
  if (loading) {
    return <Loading />;
  }

  // Kalau post nggak ketemu
  if (!post) {
    return (
      <PageWrapper>
        <BackLink to="/home">← Kembali</BackLink>
        <h2>Postingan tidak ditemukan</h2>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Tombol balik */}
      <BackLink to="/home">← Kembali</BackLink>
      
      {/* Komponen utama post */}
      <PostCard post={post} /> 

      {/* Box buat nulis komentar */}
      <CreateCommentBox 
        postId={post.id} 
        onCommentCreated={handleCommentCreated} 
      />

      {/* Header komentar + list komentar */}
      <CommentsHeader>Komentar ({comments.length})</CommentsHeader>

      {comments.length > 0 ? (
        comments.map(comment => (
          <CommentCard 
            key={comment.id} 
            comment={comment} 
          />
        ))
      ) : (
        <p>Belum ada komentar.</p>
      )}
    </PageWrapper>
  );
};

export default PostDetail;
