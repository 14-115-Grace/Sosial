// src/components/layout/RightSidebarKategori.jsx
import React, { useState } from 'react'; // <-- 1. Import useState
import styled from 'styled-components';
import CategoryList from '../common/CategoryList';

const Gutter = styled.aside`
  width: 300px;
  margin-left: 2rem;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  font-size: 1rem;
  background: #fff;
`;

// 2. Terima prop baru bernama 'onSearchSubmit'
const RightSidebarKategori = ({ onSearchSubmit }) => {
  // 3. Buat state LOKAL untuk menyimpan teks input
  const [searchText, setSearchText] = useState('');

  // 4. Buat fungsi untuk menangani penekanan tombol
  const handleKeyDown = (e) => {
    // Jika tombol yang ditekan adalah 'Enter'
    if (e.key === 'Enter') {
      // Panggil fungsi 'onSearchSubmit' dari parent
      // dan kirimkan teks pencariannya
      onSearchSubmit(searchText);
    }
  };

  return (
    <Gutter>
      <SearchBar 
        placeholder="Cari Postingan..." 
        value={searchText} // 5. Hubungkan 'value' ke state
        onChange={(e) => setSearchText(e.target.value)} // 6. Update state saat diketik
        onKeyDown={handleKeyDown} // 7. Panggil fungsi saat tombol ditekan
      />
      <CategoryList />
    </Gutter>
  );
};

export default RightSidebarKategori;