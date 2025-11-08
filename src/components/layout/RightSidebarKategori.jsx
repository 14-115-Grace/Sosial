// src/components/layout/RightSidebarKategori.jsx
import React, { useState } from 'react'; // <-- Import useState
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

// Terima prop baru bernama 'onSearchSubmit'
const RightSidebarKategori = ({ onSearchSubmit }) => {
  // Buat state LOKAL untuk menyimpan teks input
  const [searchText, setSearchText] = useState('');

  // Buat fungsi untuk menangani penekanan tombol
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
        value={searchText} // Hubungkan 'value' ke state
        onChange={(e) => setSearchText(e.target.value)} // Update state saat diketik
        onKeyDown={handleKeyDown} // Panggil fungsi saat tombol ditekan
      />
      <CategoryList />
    </Gutter>
  );
};

export default RightSidebarKategori;
