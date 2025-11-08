// src/components/comment/CommentCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
import { useAuth } from '../../context/AuthContext.jsx'; 
import { likeComment, unlikeComment } from '../../services/comments.js';

// --- Helper Functions ---
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// --- Styled Components ---
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1rem;
  padding: 1.5rem;
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
  cursor: pointer;
`;
const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const AuthorName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
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
  margin-left: calc(45px + 1rem); 
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  margin-left: calc(45px + 1rem);
  color: #555;
`;
const FooterButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${props => props.liked ? props.theme.colors.primary : '#555'};
  font-weight: ${props => props.liked ? '700': '400'};
  &:hover { opacity: 0.7; }
`;
// --- Styled Components Selesai ---

const CommentCard = ({ comment }) => {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- 2. INISIALISASI useNavigate

  const {
    id: commentId,
    content,
    created_at,
    users: author, 
    like_count,
  } = comment;

  const [isLiked, setIsLiked] = useState(false); 
  const [currentLikes, setCurrentLikes] = useState(like_count);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiked) {
      await unlikeComment(commentId);
      setCurrentLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      await likeComment(commentId);
      setCurrentLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  // --- FUNGSI NAVIGASI  ---
  const navigateToProfile = (e) => {
    e.stopPropagation(); // Mencegah event bubbling
    navigate(`/profil/${author.handle}`);
  };
  // ---  SELESAI  ---

  return (
    <Card>
      <CardHeader>
        {/* --- onClick  --- */}
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
        <FooterButton liked={isLiked} onClick={handleLikeClick}>
          <span>❤️</span>
          <span>{currentLikes}</span>
        </FooterButton>
        
        {author?.id === user?.id && (
          <>
            {/* <FooterButton style={{color: '#888', marginLeft: 'auto'}}>
              <span>🗑️ Hapus</span>
            </FooterButton> */}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommentCard;
