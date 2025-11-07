// src/components/layout/RightSidebarKategori.jsx
import React from 'react';
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

const RightSidebarKategori = () => {
  return (
    <Gutter>
      <SearchBar placeholder="Cari Postingan..." />
      <CategoryList />
    </Gutter>
  );
};

export default RightSidebarKategori;