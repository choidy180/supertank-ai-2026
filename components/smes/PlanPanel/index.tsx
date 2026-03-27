import styled from 'styled-components';
import type { ProductInfo } from '../model/types';

interface PlanPanelProps {
  product: ProductInfo;
}

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
  color: #6680a7;
  font-size: 12px;
  font-weight: 900;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 0.08em;
`;

export default function PlanPanel({ product }: PlanPanelProps) {
  return (
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

      <SideTag>사출 품목</SideTag>
    </Panel>
  );
}
