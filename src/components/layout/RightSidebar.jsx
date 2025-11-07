// src/components/layout/RightSidebar.jsx
import React from 'react';
import styled from 'styled-components';
import TrendingBox from '../common/TrendingBox';

const Gutter = styled.aside`
  width: 300px;
  margin-left: 2rem;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
`;

// Nanti kita tambahin SearchBar di sini
// const SearchBar = styled.input` ... `;

const RightSidebar = () => {
  return (
    <Gutter>
      {/* <SearchBar placeholder="Cari postingan..." /> */}
      <TrendingBox />
    </Gutter>
  );
};

export default RightSidebar;