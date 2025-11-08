// src/pages/Profil.jsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
// --- 1. IMPORT FUNGSI BARU ---
// Fitur follow/following dipisah ke service tersendiri.
// Fungsi checkIfFollowing ditambahkan untuk mengecek apakah user yang sedang dilihat sudah diikuti atau belum.
import { followUser, unfollowUser, getFollowingList, getFollowersList, checkIfFollowing } from '../services/follows.js';
// (Impor service lain)
import { getUserProfile, getUserByHandle } from '../services/auth.js';
import { getPostsByUserId } from '../services/posts.js';
import { getLikedPosts } from '../services/posts.js';
import PostCard from '../components/post/PostCard.jsx';
import Loading from '../components/common/Loading.jsx';
import UserListModal from '../components/common/UserListModal.jsx';

// --- Styled Components ---
// Bagian ini mengatur tampilan profil agar tampil seperti "mengambang" (floating layout) mirip Twitter.
const Banner = styled.div`
  height: 250px;
  background-color: #eee;
  background: linear-gradient(to right, #B92B27, #1565C0);
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center -320px;
`;

const ProfileHeader = styled.div`
  padding: 0 2rem;
  position: relative;
  padding-top: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: -45px;
  right: 2rem;
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
  &:hover { opacity: 0.9; }
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.background};
  background: #fff;
  margin-top: -75px;
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

const StatItem = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
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
  
  ${props => props.active && css`
    color: ${props.theme.colors.primary};
    border-bottom: 3px solid ${props.theme.colors.primary};
  `}
`;
// --- Styled Components selesai ---


// --- Komponen Utama ---
const Profil = () => {
  const { username } = useParams(); 
  // Mengambil data user & profile dari context Auth
  // contextProfile sekarang dipakai agar update avatar/banner langsung muncul.
  const { user: currentUser, profile: contextProfile } = useAuth();
  const navigate = useNavigate();

  // State untuk menyimpan data profil, postingan, tab aktif, dll.
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('postingan');
  const [loading, setLoading] = useState(true);
  
  // State untuk menyimpan status follow
  const [isFollowing, setIsFollowing] = useState(false); 
  
  // State modal "Mengikuti" / "Pengikut"
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    userIdToFetch: null,
    fetchType: null,
  });

  // Mengecek apakah profil yang dibuka adalah milik user sendiri
  const isMyProfile = contextProfile?.handle === username;

  // useEffect utama untuk memuat data profil
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      let profileData; 

      if (isMyProfile) {
        // Kalau user buka profilnya sendiri, ambil dari context biar update instan
        profileData = contextProfile; 
      } else {
        // Kalau buka profil orang lain, ambil dari server
        profileData = await getUserByHandle(username);
      }
      
      if (!profileData) {
        navigate('/404');
        return;
      }
      
      setProfile(profileData);
      
      // --- Cek status follow hanya jika ini bukan profil kita sendiri ---
      if (profileData && !isMyProfile) {
        // Panggil fungsi baru checkIfFollowing (dari services/follows.js)
        const followingStatus = await checkIfFollowing(profileData.id);
        setIsFollowing(followingStatus);
      }
      // --- Selesai ---

      // Ambil postingan user
      const postData = await getPostsByUserId(profileData.id);
      setPosts(postData);
      setLoading(false);
    };

    fetchProfileData();
  }, [username, navigate, isMyProfile, contextProfile]);

  // Fungsi untuk ganti tab antara "Postingan" dan "Disukai"
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    if (!profile) return; 
    if (tab === 'postingan') {
      const postData = await getPostsByUserId(profile.id);
      setPosts(postData);
    } else if (tab === 'disukai') {
      const likedData = await getLikedPosts(profile.id);
      setPosts(likedData);
    }
    setLoading(false);
  };
  
  // --- Handle tombol Follow/Unfollow ---
  // Sekarang dilengkapi try...catch agar error (misal karena RLS gagal) bisa ditangkap.
  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      if (isFollowing) {
        // --- Unfollow ---
        await unfollowUser(profile.id);
        setIsFollowing(false);
      } else {
        // --- Follow ---
        await followUser(profile.id);
        setIsFollowing(true);
      }
    } catch (err) {
      // Kalau gagal (misalnya karena rule Supabase), tampilkan pesan error yang jelas.
      alert("Gagal melakukan aksi: " + err.message);
    }
  };
  // --- Selesai handleFollow ---
  
  const handleEditProfile = () => {
    // Tombol edit profil, diarahkan ke halaman pengaturan akun
    navigate('/pengaturan/akun');
  };

  // Kalau profil belum dimuat, tampilkan loader
  if (!profile) {
    return <Loading />;
  }

  // --- Fungsi untuk membuka/menutup modal Pengikut/Mengikuti ---
  const openModal = (type) => {
    if (type === 'following') {
      setModalState({
        isOpen: true,
        title: 'Mengikuti',
        userIdToFetch: profile.id,
        fetchType: 'following',
      });
    } else if (type === 'followers') {
      setModalState({
        isOpen: true,
        title: 'Pengikut',
        userIdToFetch: profile.id,
        fetchType: 'followers',
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', userIdToFetch: null, fetchType: null });
  };

  // --- Bagian JSX ---
  // Layout profil dibuat mirip Twitter: banner di atas, avatar "mengambang", lalu info profil dan tombol follow/edit.
  return (
    <div>
      <Banner bgImage={profile.banner_url} /> 
      
      <ProfileHeader>
        <HeaderActions>
          {isMyProfile ? (
            // Kalau user buka profilnya sendiri
            <ProfileButton onClick={handleEditProfile}>Edit Profil</ProfileButton>
          ) : (
            // Kalau buka profil orang lain, tampilkan tombol "Ikuti / Mengikuti"
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
          {/* Klik untuk buka modal daftar "Mengikuti" */}
          <StatItem onClick={() => openModal('following')}>
            <strong>{profile.following_count}</strong> Mengikuti
          </StatItem>
          {/* Klik untuk buka modal daftar "Pengikut" */}
          <StatItem onClick={() => openModal('followers')}>
            <strong>{profile.follower_count}</strong> Pengikut
          </StatItem>
        </Stats>
      </ProfileHeader>
      
      {/* Tab navigasi antara Postingan dan Disukai */}
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
      
      {/* Daftar postingan */}
      <div>
        {loading ? (
          <Loading />
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Modal daftar pengikut / mengikuti */}
      {modalState.isOpen && (
        <UserListModal
          title={modalState.title}
          userIdToFetch={modalState.userIdToFetch}
          fetchType={modalState.fetchType}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Profil;
