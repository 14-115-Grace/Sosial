// src/components/post/CreatePostBox.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../services/posts'; //

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

// Kita butuh prop 'onPostCreated'
// biar halamannya bisa nge-refresh
const CreatePostBox = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = async () => {
    if (newPostContent.trim() === '') return;

    // Panggil service createPost
    const newPostData = await createPost(newPostContent, []); 
    
    if (newPostData) {
      setNewPostContent(''); // Kosongin input
      if (onPostCreated) {
        onPostCreated(); // Kirim sinyal ke parent!
      }
    }
  };

  return (
    <CreatePostWrapper>
      <Avatar src={user?.user_metadata?.avatar_url || 'default-avatar-url.png'} />
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