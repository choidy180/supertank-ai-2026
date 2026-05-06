'use client';

import styled, { css } from 'styled-components';

import { HistoryItem } from '../model/types';

interface TimecheckHistoryPanelProps {
  items: HistoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

type HistoryTone = 'green' | 'blue' | 'amber';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const HISTORY_TONE_VARS: Record<HistoryTone, ToneVars> = {
  green: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
  blue: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
  amber: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
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
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  min-height: 0;
  padding: 18px 20px 16px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const HeaderIcon = styled.span`
  position: relative;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  border: 2px solid var(--color-accent);
  border-radius: 999px;

  &::before {
    position: absolute;
    top: 2px;
    left: 7px;
    width: 2px;
    height: 5px;
    border-radius: 999px;
    background: var(--color-accent);
    content: '';
  }

  &::after {
    position: absolute;
    top: 7px;
    left: 7px;
    width: 5px;
    height: 2px;
    border-radius: 999px;
    background: var(--color-accent);
    content: '';
    transform: rotate(35deg);
    transform-origin: left center;
  }
`;

const Title = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

const Table = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
  min-height: 0;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 76px 1.2fr 1fr 0.8fr;
  gap: 12px;
  padding: 0 10px;
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.35;

  @media (max-width: 768px) {
    grid-template-columns: 64px minmax(84px, 1fr) minmax(72px, 0.8fr) 64px;
    gap: 8px;
    padding: 0 8px;
  }
`;

const Scroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;

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

const List = styled.div`
  display: grid;
  gap: 8px;
`;

const Row = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: grid;
  grid-template-columns: 76px 1.2fr 1fr 0.8fr;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 10px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 14px;
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
    grid-template-columns: 64px minmax(84px, 1fr) minmax(72px, 0.8fr) 64px;
    gap: 8px;
    padding: 12px 8px;
  }
`;

const Cell = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Result = styled.div<{ $tone: HistoryTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => HISTORY_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => HISTORY_TONE_VARS[$tone].background};
  color: ${({ $tone }) => HISTORY_TONE_VARS[$tone].color};
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;

  @media (max-width: 768px) {
    min-height: 26px;
    padding: 0 8px;
    font-size: 13px;
  }
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 24px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 16px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 15px;
  line-height: 1.7;
  word-break: keep-all;
`;

export default function TimecheckHistoryPanel({
  items,
  selectedId,
  onSelect,
}: TimecheckHistoryPanelProps) {
  return (
    <Panel>
      <Header>
        <HeaderIcon />
        <Title>타임체크 이력 (최근)</Title>
      </Header>

      <Table>
        <Head>
          <span>시간</span>
          <span>설비</span>
          <span>점검자</span>
          <span>결과</span>
        </Head>

        <Scroll>
          {items.length === 0 ? (
            <EmptyState>최근 타임체크 이력이 없습니다.</EmptyState>
          ) : (
            <List>
              {items.map((item) => (
                <Row
                  key={item.id}
                  type="button"
                  $active={item.id === selectedId}
                  aria-pressed={item.id === selectedId}
                  onClick={() => onSelect(item.id)}
                >
                  <Cell>{item.time}</Cell>
                  <Cell>{item.equipment}</Cell>
                  <Cell>{item.inspector}</Cell>
                  <Result $tone={item.tone}>{item.result}</Result>
                </Row>
              ))}
            </List>
          )}
        </Scroll>
      </Table>
    </Panel>
  );
}