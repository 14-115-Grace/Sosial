// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPostById } from '../services/posts'; 
import { getCommentsForPost } from '../services/comments';
import PostCard from '../components/post/PostCard'; 
import Loading from '../components/common/Loading';
import CreateCommentBox from '../components/post/CreateCommentBox';
import CommentCard from '../components/comment/CommentCard'; // <-- Import sudah benar

const PageWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 1rem;
  font-weight: 600;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
`;

const CommentsHeader = styled.h3`
  font-size: 1.2rem;
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const PostDetail = () => {
  const { postId } = useParams(); 
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth(); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postData = await getPostById(postId);
      
      if (postData) {
        setPost(postData);
        const commentData = await getCommentsForPost(postId);
        setComments(commentData);
      }
      setLoading(false);
    };

    fetchData();
  }, [postId]);

  const handleCommentCreated = (newCommentData, originalContent) => {
    
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

    setComments(currentComments => [...currentComments, newComment]);
    
    setPost(currentPost => ({
      ...currentPost,
      comment_count: (currentPost.comment_count || 0) + 1
    }));
  };

  if (loading) {
    return <Loading />;
  }

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
      {/* --- ⬇️ INI ADALAH PERBAIKANNYA ⬇️ --- */}
      <BackLink to="/home">← Kembali</BackLink>
      
      <PostCard post={post} /> 

      <CreateCommentBox 
        postId={post.id} 
        onCommentCreated={handleCommentCreated} 
      />

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