// src/components/common/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllCategories } from '../../services/categories'; //
import { Link } from 'react-router-dom';

const KategoriWrapper = styled.div`
  background-color: #FBF7E9; // Warna beige/kuning muda dari Figma
  border: 1px solid #EBE5D1;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const CategoryItem = styled(Link)`
  display: block;
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 1rem;
  margin: -0.5rem -1rem; // Trik biar hover-nya full-width
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background-color: #F1EAD8;
  }
`;

const CategoryList = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKategori = async () => {
      setLoading(true);
      const data = await getAllCategories(); //
      setKategori(data);
      setLoading(false);
    };
    fetchKategori();
  }, []);

  if (loading) {
    return <KategoriWrapper>Loading kategori...</KategoriWrapper>;
  }

  return (
    <KategoriWrapper>
      <Title>Jelajahi Kategori</Title>
      {kategori.map((kat) => (
        <CategoryItem to={`/kategori/${kat.name}`} key={kat.id}>
          {kat.name}
        </CategoryItem>
      ))}
    </KategoriWrapper>
  );
};

export default CategoryList;