'use client';

import styled, { css } from 'styled-components';
import { getStatusDescription, getStatusLabel } from '../model/helpers';
import { ActionHistoryItem, FilterType } from '../model/types';

interface ActionHistoryPanelProps {
  items: ActionHistoryItem[];
  filter: FilterType;
  selectedId: string | null;
  selectedItem: ActionHistoryItem | null;
  onSelect: (id: string) => void;
  onChangeFilter: (filter: FilterType) => void;
}

const ActionHistoryPanel = ({ items, filter, selectedId, selectedItem, onSelect, onChangeFilter }: ActionHistoryPanelProps) => {
  return (
    <Panel>
      <Header>
        <TitleGroup>
          <Title>무작업 조치 이력</Title>
        </TitleGroup>
        <Badge>선택 설비 {selectedItem?.equipment ?? '-'}</Badge>
      </Header>

      {selectedItem && (
        <FocusCard>
          <FocusTop>
            <FocusTitle>
              {selectedItem.equipment} · {selectedItem.code} · {selectedItem.title}
            </FocusTitle>
            <StatusBadge $status={selectedItem.status}>{getStatusLabel(selectedItem.status)}</StatusBadge>
          </FocusTop>
          <FocusSummary>{selectedItem.summary}</FocusSummary>
          <FocusMeta>
            {selectedItem.area} · {selectedItem.owner} · {getStatusDescription(selectedItem.status)}
          </FocusMeta>
        </FocusCard>
      )}

      <FilterRow>
        <FilterGroup>
          <FilterButton type="button" $active={filter === 'all'} onClick={() => onChangeFilter('all')}>
            전체
          </FilterButton>
          <FilterButton type="button" $active={filter === 'incident'} onClick={() => onChangeFilter('incident')}>
            발생
          </FilterButton>
          <FilterButton type="button" $active={filter === 'processing'} onClick={() => onChangeFilter('processing')}>
            조치중
          </FilterButton>
          <FilterButton type="button" $active={filter === 'done'} onClick={() => onChangeFilter('done')}>
            완료
          </FilterButton>
        </FilterGroup>

        <CountPill>{filter === 'all' ? '전체 이력' : `${getStatusLabel(filter)} 이력`} {items.length}건</CountPill>
      </FilterRow>

      <TableFrame>
        <TableHead>
          <span>시간</span>
          <span>설비</span>
          <span>코드</span>
          <span>상태</span>
        </TableHead>

        <TableScroll>
          {items.length === 0 ? (
            <EmptyState>
              선택한 조건에 맞는 조치 이력이 없습니다.
              <br />
              필터를 바꿔 다른 상태를 확인해보세요.
            </EmptyState>
          ) : (
            <TableList>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  type="button"
                  $active={item.id === selectedId}
                  onClick={() => onSelect(item.id)}
                >
                  <CellText>{item.time}</CellText>
                  <CellText>{item.equipment}</CellText>
                  <CellText>{item.code}</CellText>
                  <StatusBadge $status={item.status}>{getStatusLabel(item.status)}</StatusBadge>
                </TableRow>
              ))}
            </TableList>
          )}
        </TableScroll>
      </TableFrame>
    </Panel>
  );
};

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const Panel = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 16px;
  padding: 22px;
  border-radius: 28px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(9, 21, 43, 0.95) 0%, rgba(7, 16, 34, 0.95) 100%);
  box-shadow:
    var(--shadow-panel),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-strong);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 8px 20px;
  border-radius: 999px;
  border: 1px solid rgba(39, 209, 126, 0.22);
  background: rgba(39, 209, 126, 0.08);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const FocusCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border-radius: 22px;
  border: 1px solid rgba(118, 151, 212, 0.14);
  background: rgba(16, 31, 60, 0.84);
`;

const FocusTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const FocusTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-strong);
`;

const FocusSummary = styled.div`
  font-size: 20px;
  line-height: 1.7;
  color: #dff9fb;
`;

const FocusMeta = styled.div`
  font-size: 18px;
  color: #c7ecee;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  min-height: 36px;
  padding: 4px 20px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(79, 144, 255, 0.32)' : 'rgba(118, 151, 212, 0.16)')};
  background: ${({ $active }) => ($active ? 'rgba(79, 144, 255, 0.12)' : 'rgba(16, 30, 58, 0.78)')};
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CountPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 8px 24px;
  border-radius: 999px;
  border: 1px solid rgba(118, 151, 212, 0.18);
  background: rgba(14, 27, 53, 0.78);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const TableFrame = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  overflow: hidden;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  gap: 12px;
  padding: 0 14px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  margin-left: 20px;
  margin-top: 20px;
`;

const TableScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const TableList = styled.div`
  display: grid;
  gap: 10px;
`;

const TableRow = styled.button<{ $active: boolean }>`
  ${buttonReset};
  width: 100%;
  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(79, 144, 255, 0.3)' : 'rgba(118, 151, 212, 0.12)')};
  background: ${({ $active }) => ($active ? 'rgba(18, 39, 73, 0.92)' : 'rgba(15, 29, 57, 0.74)')};
  text-align: left;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CellText = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #dff9fb;
  margin-left: 20px;
`;

const StatusBadge = styled.div<{ $status: ActionHistoryItem['status'] }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 6px 20px;
  border-radius: 999px;
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case 'incident':
          return 'rgba(244, 95, 116, 0.24)';
        case 'processing':
          return 'rgba(79, 144, 255, 0.24)';
        case 'done':
          return 'rgba(39, 209, 126, 0.24)';
        default:
          return 'rgba(118, 151, 212, 0.18)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'incident':
          return 'rgba(244, 95, 116, 0.1)';
        case 'processing':
          return 'rgba(79, 144, 255, 0.1)';
        case 'done':
          return 'rgba(39, 209, 126, 0.1)';
        default:
          return 'rgba(16, 30, 58, 0.72)';
      }
    }};
  color:
    ${({ $status }) => {
      switch ($status) {
        case 'incident':
          return 'var(--red)';
        case 'processing':
          return 'var(--blue)';
        case 'done':
          return 'var(--green)';
        default:
          return 'var(--text-primary)';
      }
    }};
  font-size: 20px;
  font-weight: 700;
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 20px;
  border-radius: 18px;
  border: 1px dashed rgba(118, 151, 212, 0.16);
  background: rgba(15, 29, 57, 0.54);
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

export default ActionHistoryPanel;
