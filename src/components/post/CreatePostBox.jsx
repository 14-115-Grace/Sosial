// src/components/post/CreatePostBox.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../services/posts'; 

// ... (Semua 'styled.' components biarkan apa adanya) ...
const CreatePostWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
`;
const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #eee;
  margin-right: 1rem;
`;
const PostInputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const PostTextarea = styled.textarea`
  width: 100%;
  border: none;
  font-size: 1.1rem;
  font-family: inherit;
  resize: none;
  min-height: 60px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder { color: #aaa; }
  &:focus { outline: none; }
`;
const PostButton = styled.button`
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
// ---

// --- ⬇️ INI ADALAH PERBAIKANNYA ⬇️ ---

/**
 * Helper function untuk mencari tagar dari teks.
 * Cth: "Halo #pagi #dunia" akan menjadi ["pagi", "dunia"]
 */
const extractHashtags = (text) => {
  const regex = /#(\w+)/g; // Cari #diikuti_kata
  let matches;
  const tags = new Set(); // Pakai 'Set' agar tag unik (tidak dobel)
  
  while ((matches = regex.exec(text)) !== null) {
    // Ambil grup ke-1 (kata tanpa #)
    tags.add(matches[1]); 
  }
  return Array.from(tags); // Kembalikan sebagai array
};

const CreatePostBox = ({ onPostCreated }) => {
  const { profile } = useAuth(); 
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = async () => {
    if (newPostContent.trim() === '') return;

    // 1. Ekstrak tagar dari teks
    const categoryNames = extractHashtags(newPostContent); 
    // Jika teksnya "#eskrim", categoryNames akan menjadi ["eskrim"]
    
    // 2. Panggil service createPost dengan tagar yang ditemukan
    const newPostData = await createPost(newPostContent, categoryNames); 
    
    if (newPostData) {
      setNewPostContent(''); // Kosongin input
      if (onPostCreated) {
        onPostCreated(); // Kirim sinyal ke parent!
      }
    }
  };

  return (
    <CreatePostWrapper>
      <Avatar src={profile?.avatar_url || 'default-avatar-url.png'} /> 
      <PostInputArea>
        <PostTextarea
          placeholder="Apa yang ada di pikiranmu, G?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <PostButton 
          onClick={handleCreatePost}
          disabled={newPostContent.trim() === ''}
        >
          Kirim
        </PostButton>
      </PostInputArea>
    </CreatePostWrapper>
  );
};

export default CreatePostBox;