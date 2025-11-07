// src/components/post/CreateCommentBox.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { createComment } from '../../services/comments'; // <-- Panggil service komen

// Kita bisa pakai styling yang mirip dengan CreatePostBox
const CreateCommentWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  margin-top: 1rem; // Pisahkan dari post utama
  display: flex;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #eee;
  margin-right: 1rem;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Buat inputnya sedikit beda biar jelas
const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid #ddd; 
  border-radius: 4px;
  font-size: 1rem; 
  font-family: inherit;
  resize: none;
  min-height: 60px;
  padding: 0.75rem;

  &::placeholder { color: #aaa; }
  &:focus { 
    outline: 2px solid ${({ theme }) => theme.colors.primary}; 
    border-color: transparent;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 1rem;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

/**
 * Komponen ini butuh 'postId' untuk tahu komen ini milik post mana,
 * dan 'onCommentCreated' untuk memberi tahu parent (PostDetail)
 * agar me-refresh daftar komentarnya.
 */
const CreateCommentBox = ({ postId, onCommentCreated }) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (content.trim() === '') return;

    // newCommentData adalah { id: "...", created_at: "..." }
    const newCommentData = await createComment(postId, content); 
    
    if (newCommentData) { 
      const originalContent = content; // Simpan teks sebelum dikosongkan
      setContent(''); // Kosongkan input
      
      if (onCommentCreated) {
        // Kirim data baru DAN teks asli ke parent
        onCommentCreated(newCommentData, originalContent); 
      }
    } else {
      alert("Gagal mengirim komentar. Silakan coba lagi.");
    }
  };
    
  return (
    <CreateCommentWrapper>
      <Avatar src={profile?.avatar_url || 'default-avatar-url.png'} />
      <InputArea>
        <Textarea
          placeholder="Tulis balasanmu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button 
          onClick={handleSubmit}
          disabled={content.trim() === ''}
        >
          Kirim Balasan
        </Button>
      </InputArea>
    </CreateCommentWrapper>
  );
};

export default CreateCommentBox;