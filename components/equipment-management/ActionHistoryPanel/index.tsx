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

type ActionStatus = ActionHistoryItem['status'];

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const STATUS_TONE_VARS: Record<ActionStatus, ToneVars> = {
  incident: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
  processing: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
  done: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
};

const ActionHistoryPanel = ({
  items,
  filter,
  selectedId,
  selectedItem,
  onSelect,
  onChangeFilter,
}: ActionHistoryPanelProps) => {
  const countLabel =
    filter === 'all' ? '전체 이력' : `${getStatusLabel(filter)} 이력`;

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
              {selectedItem.equipment} · {selectedItem.code} ·{' '}
              {selectedItem.title}
            </FocusTitle>

            <StatusBadge $status={selectedItem.status}>
              {getStatusLabel(selectedItem.status)}
            </StatusBadge>
          </FocusTop>

          <FocusSummary>{selectedItem.summary}</FocusSummary>

          <FocusMeta>
            {selectedItem.area} · {selectedItem.owner} ·{' '}
            {getStatusDescription(selectedItem.status)}
          </FocusMeta>
        </FocusCard>
      )}

      <FilterRow>
        <FilterGroup>
          <FilterButton
            type="button"
            $active={filter === 'all'}
            aria-pressed={filter === 'all'}
            onClick={() => onChangeFilter('all')}
          >
            전체
          </FilterButton>

          <FilterButton
            type="button"
            $active={filter === 'incident'}
            aria-pressed={filter === 'incident'}
            onClick={() => onChangeFilter('incident')}
          >
            발생
          </FilterButton>

          <FilterButton
            type="button"
            $active={filter === 'processing'}
            aria-pressed={filter === 'processing'}
            onClick={() => onChangeFilter('processing')}
          >
            조치중
          </FilterButton>

          <FilterButton
            type="button"
            $active={filter === 'done'}
            aria-pressed={filter === 'done'}
            onClick={() => onChangeFilter('done')}
          >
            완료
          </FilterButton>
        </FilterGroup>

        <CountPill>
          {countLabel} {items.length}건
        </CountPill>
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
              <EmptyStateInner>
                선택한 조건에 맞는 조치 이력이 없습니다.
                <br />
                필터를 바꿔 다른 상태를 확인해보세요.
              </EmptyStateInner>
            </EmptyState>
          ) : (
            <TableList>
              {items.map((item) => (
                <TableRow
                  key={item.id}
                  type="button"
                  $active={item.id === selectedId}
                  aria-pressed={item.id === selectedId}
                  onClick={() => onSelect(item.id)}
                >
                  <CellText>{item.time}</CellText>
                  <CellText>{item.equipment}</CellText>
                  <CellText>{item.code}</CellText>

                  <StatusBadge $status={item.status}>
                    {getStatusLabel(item.status)}
                  </StatusBadge>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  padding: 22px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(30px, 2.5vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 18px;
  border: 1px solid var(--color-success);
  border-radius: 999px;
  background: var(--color-success-soft);
  color: var(--color-success);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const FocusCard = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
`;

const FocusTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FocusTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

const FocusSummary = styled.div`
  color: var(--color-text-secondary);
  font-size: 20px;
  line-height: 1.65;
  word-break: keep-all;
`;

const FocusMeta = styled.div`
  color: var(--color-text-tertiary);
  font-size: 18px;
  line-height: 1.45;
  word-break: keep-all;
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

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 4px 18px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: ${({ $active }) =>
    $active ? 'var(--color-accent)' : 'var(--color-text-secondary)'};
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease,
    color 150ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
    color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-text-primary)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const CountPill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 20px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const TableFrame = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  flex: 1;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  gap: 12px;
  padding: 0 14px;
  color: var(--color-text-tertiary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;

  @media (max-width: 768px) {
    grid-template-columns: 76px minmax(82px, 1fr) 76px minmax(78px, auto);
    gap: 8px;
    padding: 0 10px;
    font-size: 14px;
  }
`;

const TableScroll = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding-right: 4px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const TableList = styled.div`
  display: grid;
  gap: 10px;
`;

const TableRow = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 18px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  text-align: left;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease,
    color 150ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 76px minmax(82px, 1fr) 76px minmax(78px, auto);
    gap: 8px;
    padding: 12px 10px;
  }
`;

const CellText = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StatusBadge = styled.div<{ $status: ActionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 32px;
  padding: 4px 16px;
  border: 1px solid ${({ $status }) => STATUS_TONE_VARS[$status].border};
  border-radius: 999px;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].background};
  color: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  flex: 1;
  min-height: 320px;
  padding: 24px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 18px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  text-align: center;
`;

const EmptyStateInner = styled.div`
  font-size: 16px;
  line-height: 1.8;
  word-break: keep-all;
`;

export default ActionHistoryPanel;