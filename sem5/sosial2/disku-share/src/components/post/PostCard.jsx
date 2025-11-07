// src/components/post/PostCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { likePost, unlikePost } from '../../services/likes'; //
import { deletePost } from '../../services/posts'; //

// --- Helper Functions ---
function formatTimestamp(timestamp) {
  // Bikin logic buat format "5m", "1h", "3d"
  // Untuk sekarang, kita buat simpel:
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

// --- Styled Components ---
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
  margin-left: auto; // Pindahin ke kanan
`;

const CardBody = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap; // Biar newline tetep keliatan
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
  
  /* Ganti warna kalo di-like */
  color: ${props => props.liked ? props.theme.colors.primary : '#555'};
  font-weight: ${props => props.liked ? '700' : '400'};

  &:hover {
    opacity: 0.7;
  }
`;

// --- Main Component ---
const PostCard = ({ post, onDeleteSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Struktur data dari getPosts()
  const {
    id: postId,
    content,
    created_at,
    users: author, // 'users' kita alias jadi 'author'
    like_count,
    comment_count,
  } = post;

  // State lokal buat instant feedback
  // TODO: Kita butuh info 'is_liked_by_me' dari BE,
  // untuk sekarang kita anggap false
  const [isLiked, setIsLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(like_count);

  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Biar klik-nya gak ke card
    
    if (isLiked) {
      await unlikePost(postId); //
      setCurrentLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      await likePost(postId); //
      setCurrentLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    // Arahin ke detail post, tapi fokus ke input komen
    navigate(`/post/${postId}?focus_comment=true`);
  };

  const navigateToDetail = () => {
    // Navigasi ke halaman detail
    navigate(`/post/${postId}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm('Yakin mau hapus post ini, G?')) {
      await deletePost(postId); //
      if (onDeleteSuccess) {
        onDeleteSuccess(postId); // Kirim sinyal ke Beranda.jsx
      }
    }
  };

  return (
    <Card onClick={navigateToDetail}>
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
        <FooterButton onClick={handleCommentClick}>
          <span>💬</span>
          <span>{comment_count}</span>
        </FooterButton>
        <FooterButton liked={isLiked} onClick={handleLikeClick}>
          <span>❤️</span>
          <span>{currentLikes}</span>
        </FooterButton>
        
        {/* Tombol Hapus & Edit cuma muncul kalo itu post kita */}
        {author?.id === user?.id && (
          <>
            <FooterButton onClick={handleDeleteClick} style={{color: '#888', marginLeft: 'auto'}}>
              <span>🗑️ Hapus</span>
            </FooterButton>
            {/* <FooterButton onClick={...} style={{color: '#888'}}>
              <span>✏️ Edit</span>
            </FooterButton> */}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;