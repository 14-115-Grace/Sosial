// src/pages/HalamanTentang.jsx
import React from 'react';
import styled from 'styled-components';
import teamImage from '../assets/team-image.jpg'; 

// --- Styled Components ---

const PageHeader = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ContentLayout = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
`;

const LeftColumn = styled.div`
  flex: 2;
  background: linear-gradient(#FFF3E0, #F9DDDD); /* Background Gradasi */
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 2.5rem;
  line-height: 1.7;
`;

const RightColumn = styled.div`
  flex: 1;
  position: sticky;
  top: 2rem;
`;

// --- Komponen Kolom Kiri ---
const TextBlock = styled.p`
  margin-bottom: 1.5rem;
`;
const HighlightList = styled.ul`
  list-style: none;
  margin-bottom: 2rem;
`;
const HighlightItem = styled.li`
  margin-bottom: 0.75rem;
  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
const StyledImage = styled.img`
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  object-fit: cover;
  max-height: 300px;
`;
const Caption = styled.p`
  font-size: 0.9rem;
  color: #777;
  text-align: center;
  margin-bottom: 2rem;
`;
const KontakTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;
const KontakLink = styled.a`
  display: inline-block;
  margin-right: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  &:hover { text-decoration: underline; }
`;

// --- Komponen Kolom Kanan (Form) ---
const ContactCard = styled.div`
  background: linear-gradient(#FFF3E0, #F9DDDD);
  border: 1px solid #EBE5D1;
  border-radius: 8px;
  padding: 1.5rem;
`;
const FormTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;
const FormText = styled.p`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;
const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 1rem;
`;
const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: #FFFFFF;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
`;
const Button = styled.button`
  width: auto;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
`;
const FormDisclaimer = styled.span`
  font-size: 0.8rem;
  color: #777;
`;

// --- Komponen Utama ---
const HalamanTentang = () => {
  return (
    <>
      <PageHeader>Tentang Kami</PageHeader>
      
      <ContentLayout>
        {/* === KOLOM KIRI === */}
        <LeftColumn>
          <TextBlock>
            DiskuShare adalah forum diskusi yang dibuat untuk siapa pun yang ingin
            berbagi ide, bertanya, atau sekadar berdialog dengan santai namun tetap
            berkualitas.
          </TextBlock>
          <TextBlock>
            DiskuShare adalah ruang terbuka bagi semua untuk berbagi dan
            berdiskusi dengan nyaman. Disini, kamu bisa ngobrolin berbagai topik —
            mulai dari pelajaran, teknologi, hobi, sampai isu terkini. Setiap suara
            berarti, dan setiap pendapat layak didengar dengan sikap
            saling menghargai.
          </TextBlock>
          
          <HighlightList>
            <HighlightItem><strong>Terbuka</strong> — Semua pendapat layak dipertimbangkan.</HighlightItem>
            <HighlightItem><strong>Informatif</strong> — Setiap diskusi membawa pengetahuan baru.</HighlightItem>
            <HighlightItem><strong>Kolaboratif</strong> — Belajar dan tumbuh bersama komunitas.</HighlightItem>
          </HighlightList>
          
          <div>
            <StyledImage src={teamImage} alt="Diskusi tim" />
            <Caption>Tempat bertemu ide inspirasi.</Caption>
          </div>

          <KontakTitle>Kontak Cepat</KontakTitle>
          <TextBlock>
            Email: aditya.123140093@student.itera.ac.id <br />
            Telp: +6295330769174
          </TextBlock>
          <div>
            <KontakLink href="#">Instagram</KontakLink>
            <KontakLink href="#">Twitter</KontakLink>
            <KontakLink href="#">LinkedIn</KontakLink>
          </div>
        </LeftColumn>
        
        {/* === KOLOM KANAN === */}
        <RightColumn>
          <ContactCard>
            <FormTitle>Hubungi Kami</FormTitle>
            <FormText>
              Ada pertanyaan, masukan, atau ide kerja sama?
              Silakan kirim pesan melalui formulir di bawah ini.
            </FormText>
            
            <FormText>
              <strong>Alamat</strong><br />
              Jl. Terusan Ryacudu, Way Huwi, Kec. Jati Agung,
              Kab. Lampung Selatan, Lampung.
            </FormText>
            
            <FormText>
              <strong>Maps</strong><br />
              <a href="https://maps.app.goo.gl/iimGXw6vub5dnor7?g_st=aw" target="_blank" rel="noopener noreferrer">
                Buka di Google Maps
              </a>
            </FormText>
            
            <form>
              <FormLabel htmlFor="nama">Nama</FormLabel>
              <Input type="text" id="nama" placeholder="Nama lengkap" />
              
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input type="email" id="email" placeholder="nama@email.com" />
              
              <FormLabel htmlFor="pesan">Pesan</FormLabel>
              <Textarea id="pesan" placeholder="Tulis pesanmu di sini..." />
              
              <div>
                <Button type="submit">Kirim Pesan</Button>
                <FormDisclaimer>Kami akan membalas 1-3 hari kerja.</FormDisclaimer>
              </div>
            </form>
          </ContactCard>
        </RightColumn>
      </ContentLayout>
    </>
  );
};

export default HalamanTentang;