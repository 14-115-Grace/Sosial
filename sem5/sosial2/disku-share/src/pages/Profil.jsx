// src/pages/Profil.jsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Services
import { getUserProfile } from '../services/auth'; //
import { getPostsByUserId } from '../services/posts'; // (File yg barusan kita edit)
import { getLikedPosts } from '../services/posts'; //
import { followUser, unfollowUser } from '../services/follows'; //

// Import Komponen
import PostCard from '../components/post/PostCard';
import Loading from '../components/common/Loading';

// --- Styled Components (Sesuai Figma Profile.png) ---

const Banner = styled.div`
  height: 200px;
  background-color: #eee;
  /* Warna merah/pink/abu-abu dari header Profile.png */
  background: linear-gradient(to right, #B92B27, #1565C0); /* Ganti pake banner_url */
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
`;

const ProfileHeader = styled.div`
  padding: 0 2rem;
  margin-top: -60px; /* Bikin avatar nembus banner */
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 60px; /* Kasih space buat avatar */
`;

const ProfileButton = styled.button`
  background-color: ${props => (props.primary ? props.theme.colors.primary : '#FFF')};
  color: ${props => (props.primary ? '#FFF' : '#000')};
  border: ${props => (props.primary ? 'none' : '1px solid #ccc')};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;

  &:hover { opacity: 0.9; }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.background}; /* Border putih */
  background: #fff;
`;

const ProfileInfo = styled.div`
  margin-top: 0.5rem;
  h2 {
    font-size: 1.8rem;
    margin: 0;
  }
  span {
    color: #555;
    font-size: 1rem;
  }
  p {
    margin-top: 1rem;
    line-height: 1.6;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-top: 2rem;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #777;
  
  /* Styling buat tab yang aktif */
  ${props => props.active && css`
    color: ${props.theme.colors.primary};
    border-bottom: 3px solid ${props.theme.colors.primary};
  `}
`;

// --- Komponen Utama ---
const Profil = () => {
  const { username } = useParams(); // Tangkep ':username' dari URL
  const { user: currentUser } = useAuth(); // Info user yg lagi login
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('postingan'); //
  const [loading, setLoading] = useState(true);
  
  // TODO: Kita butuh 'is_following' dari BE
  const [isFollowing, setIsFollowing] = useState(false);

  // --- Data Fetching Utama ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      
      // 1. Ambil data profil
      // TODO: getUserProfile() dari auth.js nerima 'userId'
      // Tapi kita punyanya 'username'. Kita perlu service baru: getUserByHandle(username)
      // Untuk sekarang, kita anggep 'username' itu adalah 'userId'
      const profileData = await getUserProfile(username); //
      
      if (!profileData) {
        navigate('/404'); // Kalo profil gak ketemu
        return;
      }
      setProfile(profileData);

      // 2. Ambil data postingan (default tab)
      const postData = await getPostsByUserId(profileData.id);
      setPosts(postData);

      setLoading(false);
    };

    fetchProfileData();
  }, [username, navigate]); // Jalanin ulang kalo :username ganti

  // --- Data Fetching buat Tab ---
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    
    if (tab === 'postingan') { //
      const postData = await getPostsByUserId(profile.id);
      setPosts(postData);
    } else if (tab === 'disukai') { //
      const likedData = await getLikedPosts(profile.id); //
      setPosts(likedData);
    }
    
    setLoading(false);
  };
  
  // --- Aksi Tombol ---
  const handleFollow = async () => {
    if (isFollowing) {
      await unfollowUser(profile.id); //
      setIsFollowing(false);
    } else {
      await followUser(profile.id); //
      setIsFollowing(true);
    }
  };
  
  const handleEditProfile = () => {
    navigate('/pengaturan/akun'); // (Nanti kita bikin halaman ini)
  };

  if (!profile) {
    return <Loading />; // Tampilan loading awal
  }

  // Cek apakah ini profil kita sendiri
  const isMyProfile = currentUser?.id === profile.id;

  return (
    <div>
      <Banner bgImage={profile.banner_url} />
      
      <ProfileHeader>
        <HeaderActions>
          {isMyProfile ? (
            <ProfileButton onClick={handleEditProfile}>Edit Profil</ProfileButton>
          ) : (
            <ProfileButton primary={!isFollowing} onClick={handleFollow}>
              {isFollowing ? 'Mengikuti' : 'Ikuti'}
            </ProfileButton>
          )}
        </HeaderActions>
        
        <Avatar src={profile.avatar_url || 'default-avatar-url.png'} />
        
        <ProfileInfo>
          <h2>{profile.name}</h2>
          <span>@{profile.handle}</span>
          <p>{profile.bio || 'Belum ada bio.'}</p>
        </ProfileInfo>
        
        <Stats>
          <span><strong>{profile.following_count}</strong> Mengikuti</span>
          <span><strong>{profile.follower_count}</strong> Pengikut</span>
        </Stats>
      </ProfileHeader>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'postingan'} 
          onClick={() => handleTabChange('postingan')}
        >
          Postingan
        </TabButton>
        <TabButton 
          active={activeTab === 'disukai'} 
          onClick={() => handleTabChange('disukai')}
        >
          Disukai
        </TabButton>
      </TabContainer>
      
      <div>
        {loading ? (
          <Loading />
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profil;