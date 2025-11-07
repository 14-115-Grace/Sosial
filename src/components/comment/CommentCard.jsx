// src/components/comment/CommentCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { likeComment, unlikeComment } from '../../services/comments'; // Impor service like komen

// --- Helper Functions ---
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// --- Styled Components (Mirip PostCard) ---
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
  cursor: pointer; // (Nanti bisa link ke profil)
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AuthorName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer; // (Nanti bisa link ke profil)
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
  margin-left: calc(45px + 1rem); // Sejajarkan dengan teks di atas
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  margin-left: calc(45px + 1rem); // Sejajarkan
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

  &:hover {
    opacity: 0.7;
  }
`;

// --- Main Component ---
const CommentCard = ({ comment }) => {
  const { user } = useAuth();
  
  // Ambil data dari objek 'comment'
  const {
    id: commentId,
    content,
    created_at,
    users: author, // 'users' kita alias jadi 'author'
    like_count,
    // TODO: Kita butuh 'is_liked_by_me' dari SQL
  } = comment;

  // State lokal untuk like
  const [isLiked, setIsLiked] = useState(false); // Ganti ini jika SQL sudah ada 'is_liked_by_me'
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

  return (
    <Card>
      <CardHeader>
        <Avatar src={author?.avatar_url || 'default-avatar-url.png'} alt="avatar" />
        <AuthorInfo>
          <AuthorName>{author?.name || 'User'}</AuthorName>
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
        
        {/* Tombol Hapus & Edit (jika itu komen kita) */}
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