// src/components/post/PostCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { likePost, unlikePost } from '../../services/likes.js'; 
import { deletePost } from '../../services/posts.js';

// Helper Functions
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

// Styled Components
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;
const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #eee;
  margin-right: 1rem;
`;
const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const AuthorName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const AuthorHandle = styled.span`
  color: #888;
  font-size: 0.9rem;
`;
const Timestamp = styled.span`
  color: #888;
  font-size: 0.9rem;
  margin-left: auto;
`;
const CardBody = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  color: #555;
`;
const FooterButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.liked ? props.theme.colors.primary : '#555'};
  font-weight: ${props => props.liked ? '700' : '400'};
  &:hover { opacity: 0.7; }
`;
// Styled Components Selesai

const PostCard = ({ post, onDeleteSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    id: postId,
    content,
    created_at,
    users: author,
    like_count,
    comment_count,
  } = post;

  const [isLiked, setIsLiked] = useState(post.is_liked_by_me);
  const [currentLikes, setCurrentLikes] = useState(like_count);

  const handleLikeClick = async (e) => {
    e.stopPropagation(); 
    if (isLiked) {
      await unlikePost(postId);
      setCurrentLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      await likePost(postId);
      setCurrentLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${postId}?focus_comment=true`);
  };

  const navigateToDetail = () => {
    navigate(`/post/${postId}`);
  };
  
  // TAMBAHAN FUNGSI NAVIGASI
  const navigateToProfile = (e) => {
    e.stopPropagation(); // Mencegah klik agar tidak lari ke 'navigateToDetail'
    navigate(`/profil/${author.handle}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm('Yakin mau hapus post ini, G?')) {
      await deletePost(postId);
      if (onDeleteSuccess) {
        onDeleteSuccess(postId);
      }
    }
  };

  return (
    <Card onClick={navigateToDetail}>
      <CardHeader>
        <Avatar 
          src={author?.avatar_url || 'default-avatar-url.png'} 
          alt="avatar" 
          onClick={navigateToProfile} 
        />
        <AuthorInfo>
          <AuthorName onClick={navigateToProfile}>
            {author?.name || 'User'}
          </AuthorName>
          <AuthorHandle>@{author?.handle || 'userhandle'}</AuthorHandle>
        </AuthorInfo>
        <Timestamp>{formatTimestamp(created_at)}</Timestamp>
      </CardHeader>

      <CardBody>{content}</CardBody>

      <CardFooter>
        <FooterButton onClick={handleCommentClick}>
          <span>💬</span>
          <span>{comment_count}</span>
        </FooterButton>
        <FooterButton liked={isLiked} onClick={handleLikeClick}>
          <span>❤️</span>
          <span>{currentLikes}</span>
        </FooterButton>
        
        {author?.id === user?.id && (
          <>
            <FooterButton onClick={handleDeleteClick} style={{color: '#888', marginLeft: 'auto'}}>
              <span>🗑️ Hapus</span>
            </FooterButton>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
