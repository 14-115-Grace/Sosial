// src/components/common/TrendingBox.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getTrendingTags } from '../../services/categories'; 
import { Link } from 'react-router-dom';

// --- STYLING ---

const TrendWrapper = styled.div`
  background: linear-gradient(#FFF3E0, #F9DDDD);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// --- ⬇️ INI ADALAH PERBAIKANNYA ⬇️ ---
const TrendGrid = styled.div`
  display: flex;
  flex-direction: column; /* Bikin 1 kolom (turun ke bawah) */
  gap: 1rem; /* Jarak antar item */
`;
// --- ⬆️ SELESAI ⬆️ ---

const TrendItem = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  /* (Hapus 'text-overflow' agar tidak terpotong) */

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Tag = styled.span`
  font-weight: 700;
  display: block;
  white-space: nowrap;
`;

const Count = styled.span`
  font-size: 0.9rem;
  color: #777;
`;

// --- HELPER FUNCTION ---
function formatCount(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
}

// --- KOMPONEN UTAMA ---
const TrendingBox = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      // Kita ambil 5 tren teratas saja
      const data = await getTrendingTags(5);
      setTrends(data);
      setLoading(false);
    };
    fetchTrends();
  }, []);

  if (loading) {
    return (
      <TrendWrapper>
        <Title>Tren Hari Ini</Title>
        <p>Loading...</p>
      </TrendWrapper>
    );
  }

  return (
    <TrendWrapper>
      <Title>Tren Hari Ini</Title>
      <TrendGrid>
        {trends.map((trend) => (
          <TrendItem to={`/kategori/${trend.category_name}`} key={trend.category_id}>
            <Tag>#{trend.category_name}</Tag>
            <Count>{formatCount(trend.post_count)}</Count> 
          </TrendItem>
        ))}
      </TrendGrid>
    </TrendWrapper>
  );
};

export default TrendingBox;