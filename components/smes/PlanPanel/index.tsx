import React, { useState } from 'react';
import styled from 'styled-components';
import type { ProductInfo } from '../model/types';

// 💡 메뉴 타입을 밖으로 빼서 export 해주면 부모 컴포넌트에서도 가져다 쓸 수 있습니다.
export type SideMenuType = '사출조건표' | '설비점검표' | '타임체크시트' | '작업지도서' | '사출조건변동이력';

interface PlanPanelProps {
  product: ProductInfo;
  onSelectMenu: (menu: SideMenuType) => void; // 부모에게 선택된 메뉴를 알리는 함수
}

/* =========================================
   기존 패널 스타일
========================================= */
const Panel = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  border: 1px solid #b8c2ce;
  border-radius: 10px;
  background: var(--panel-bg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 0 12px;
  background: var(--panel-head-bg);
  border-bottom: 1px solid #c6ced8;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #2b384b;
`;

const DateMeta = styled.div`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -.4px;
  color: #4c525c;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto auto;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #d0d7e0;
`;

const Control = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #c7d0db;
  background: #ffffff;
`;

const ControlLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #68778d;
`;

const ControlValue = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #1f2d40;
`;

const ControlIcon = styled.div`
  font-size: 16px;
  color: #55657c;
`;

const ActionButton = styled.button<{ $tone?: 'red' | 'green' }>`
  appearance: none;
  min-width: 72px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${({ $tone = 'red' }) => ($tone === 'green' ? '#4fba62' : '#b71f25')};
  background: ${({ $tone = 'red' }) => ($tone === 'green' ? 'linear-gradient(180deg, #49c26a 0%, #2ea24e 100%)' : 'linear-gradient(180deg, #e4232b 0%, #c1161d 100%)')};
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
`;

const SearchMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid #d0d7e0;
  font-size: 16px;
  font-weight: 700;
  color: #62738a;
`;

const PaginationPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #dbe6f6;
  color: #5a6b84;
`;

const ProductSection = styled.div`
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 100px;
  gap: 10px;
  padding: 12px;
  min-height: 0;
`;

const TinyLabelCard = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #c7d0db;
  background: linear-gradient(180deg, #f2f5f9 0%, #e8edf3 100%);
`;

const TinyLabel = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #34455d;
`;

const TinySub = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7a889b;
`;

const ProductCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #c7d0db;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5fa 100%);
`;

const ProductTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const ProductTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  color: #162537;
`;

const ProductBadge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #bfd1ef;
  background: #edf4ff;
  color: #5576af;
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
`;

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 16px;
  font-weight: 700;
  color: #56677f;
  word-spacing: -1px;
`;

const MiniStatus = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid #d6deea;
  background: #f4f7fb;
  color: #6d7c90;
  font-size: 14px;
  font-weight: 800;
`;

const VerticalState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid #b8d0f4;
  background: linear-gradient(180deg, #edf5ff 0%, #dbe7f9 100%);
  color: #314968;
  font-size: 16px;
  font-weight: 700;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.04em;
  min-width: 100px;
`;

const SideTag = styled.div`
  position: absolute;
  top: 28px;
  right: -1px;
  width: 34px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #b4c5de;
  border-right: 0;
  border-radius: 10px 0 0 10px;
  background: linear-gradient(180deg, #edf4ff 0%, #dbe6f4 100%);
  color: #191a1b;
  font-size: 16px;
  font-weight: 900;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: filter 0.2s ease;

  &:hover {
    filter: brightness(0.95);
  }
`;

/* =========================================
   모달 전용 스타일
========================================= */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  width: 360px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #0f172a;
  }
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
`;

/* =========================================
   메인 컴포넌트
========================================= */
export default function PlanPanel({ product, onSelectMenu }: PlanPanelProps) {
  // 모달 닫힘/열림 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 닫기
  const closeModal = () => setIsModalOpen(false);

  // 메뉴 선택 처리 함수
  const handleMenuClick = (menu: SideMenuType) => {
    onSelectMenu(menu); // 부모 컴포넌트의 상태 변경
    closeModal(); // 모달 닫기
  };

  return (
    <>
      <Panel>
        <Head>
          <Title>계획</Title>
          <DateMeta>적용 기간 2026-02-10 ~ 2026-02-11</DateMeta>
        </Head>

        <Controls>
          <Control>
            <ControlLabel>시작일</ControlLabel>
            <ControlValue>2026-02-10</ControlValue>
            <ControlIcon>◴</ControlIcon>
          </Control>
          <Control>
            <ControlLabel>종료일</ControlLabel>
            <ControlValue>2026-02-11</ControlValue>
            <ControlIcon>◴</ControlIcon>
          </Control>
          <ActionButton>조회</ActionButton>
          <ActionButton>인쇄</ActionButton>
          <ActionButton $tone="green">조치완료</ActionButton>
        </Controls>

        <SearchMeta>
          <span>검색 요약 &nbsp; | &nbsp; 기간 내 작업 오더 및 이력 갱신</span>
          <PaginationPill>5 / 8 건</PaginationPill>
        </SearchMeta>

        <ProductSection>
          <TinyLabelCard>
            <TinyLabel>P/No</TinyLabel>
            <TinySub>선택 품번</TinySub>
          </TinyLabelCard>

          <ProductCard>
            <ProductTop>
              <ProductTitle>{product.pNo}</ProductTitle>
              <ProductBadge>{product.equipment}</ProductBadge>
            </ProductTop>

            <ProductMeta>
              <span>설비 20호기</span>
              <span>시작 {product.startDate}</span>
              <span>종료 {product.endDate}</span>
              <span>계획 {product.planQty}</span>
              <MiniStatus>{product.statusNote}</MiniStatus>
            </ProductMeta>
          </ProductCard>

          <VerticalState>{product.phaseLabel}</VerticalState>
        </ProductSection>

        {/* 💡 클릭 시 모달 열기 */}
        <SideTag onClick={() => setIsModalOpen(true)}>사출 품목</SideTag>
      </Panel>

      {/* 💡 모달 렌더링 영역 */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>사출 품목 메뉴</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            <MenuList>
              <MenuItem onClick={() => handleMenuClick('사출조건표')}>1. 사출조건표</MenuItem>
              <MenuItem onClick={() => handleMenuClick('설비점검표')}>2. 설비점검표</MenuItem>
              <MenuItem onClick={() => handleMenuClick('타임체크시트')}>3. 타임체크시트</MenuItem>
              <MenuItem onClick={() => handleMenuClick('작업지도서')}>4. 작업지도서</MenuItem>
              <MenuItem onClick={() => handleMenuClick('사출조건변동이력')}>5. 사출조건변동이력</MenuItem>
            </MenuList>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
}