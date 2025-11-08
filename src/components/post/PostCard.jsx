// src/components/post/PostCard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx'; // Hook untuk ambil data user login
import { likePost, unlikePost } from '../../services/likes.js'; // Fungsi untuk like/unlike post
import { deletePost } from '../../services/posts.js'; // Fungsi untuk hapus post

// Format timestamp agar tampil dengan tanggal & bulan singkat (misal: 8 Nov)
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

// Komponen-komponen bergaya untuk struktur kartu postingan
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

const PostCard = ({ post, onDeleteSuccess }) => {
  const { user } = useAuth(); // Ambil data user yang sedang login
  const navigate = useNavigate(); // Untuk navigasi antar halaman

  // Destructuring data dari post
  const {
    id: postId,
    content,
    created_at,
    users: author,
    like_count,
    comment_count,
  } = post;

  // State untuk menyimpan status "like" dan jumlah like saat ini
  const [isLiked, setIsLiked] = useState(post.is_liked_by_me);
  const [currentLikes, setCurrentLikes] = useState(like_count);

  // Fungsi saat tombol "like" diklik
  const handleLikeClick = async (e) => {
    e.stopPropagation(); // Mencegah klik ikut membuka halaman post
    if (isLiked) {
      await unlikePost(postId); // Hapus like
      setCurrentLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      await likePost(postId); // Tambahkan like
      setCurrentLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  // Fungsi saat tombol komentar diklik → menuju halaman detail post dengan fokus komentar
  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${postId}?focus_comment=true`);
  };

  // Klik di area kartu membuka halaman detail post
  const navigateToDetail = () => {
    navigate(`/post/${postId}`);
  };
  
  // Tambahan fungsi navigasi profil
  const navigateToProfile = (e) => {
    e.stopPropagation(); // Supaya tidak ikut trigger buka post
    navigate(`/profil/${author.handle}`); // Pindah ke halaman profil user
  };

  // Fungsi hapus post jika user adalah pemiliknya
  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm('Yakin mau hapus post ini, G?')) {
      await deletePost(postId);
      if (onDeleteSuccess) {
        onDeleteSuccess(postId); // Panggil callback untuk hapus dari list post
      }
    }
  };

  return (
    <Card onClick={navigateToDetail}>
      <CardHeader>
        {/* Klik avatar akan membuka profil penulis */}
        <Avatar 
          src={author?.avatar_url || 'default-avatar-url.png'} 
          alt=
