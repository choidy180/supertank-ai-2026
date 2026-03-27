'use client';

import styled, { css } from 'styled-components';
import { getHistoryToneColor } from '../model/helpers';
import { HistoryItem } from '../model/types';

interface TimecheckHistoryPanelProps {
  items: HistoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

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
  padding: 18px 20px 16px;
  border-radius: 22px;
  border: 1px solid rgba(112, 146, 220, 0.16);
  background:
    linear-gradient(180deg, rgba(8, 20, 46, 0.96) 0%, rgba(5, 14, 31, 0.96) 100%);
  box-shadow:
    0 18px 52px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const HeaderIcon = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid var(--monitor-blue);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 2px;
    width: 2px;
    height: 5px;
    border-radius: 999px;
    background: var(--monitor-blue);
  }

  &::after {
    content: '';
    position: absolute;
    left: 7px;
    top: 7px;
    width: 5px;
    height: 2px;
    border-radius: 999px;
    background: var(--monitor-blue);
    transform-origin: left center;
    transform: rotate(35deg);
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--monitor-white);
`;

const Table = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 8px;
`;

const Head = styled.div`
  display: grid;
  grid-template-columns: 76px 1.2fr 1fr 0.8fr;
  gap: 12px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--monitor-text-muted);
`;

const Scroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const List = styled.div`
  display: grid;
  gap: 8px;
`;

const Row = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: grid;
  grid-template-columns: 76px 1.2fr 1fr 0.8fr;
  gap: 12px;
  align-items: center;
  padding: 12px 10px;
  border-radius: 14px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(98, 163, 255, 0.26)' : 'rgba(112, 146, 220, 0.08)')};
  background: ${({ $active }) => ($active ? 'rgba(14, 35, 78, 0.72)' : 'rgba(11, 24, 52, 0.42)')};
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const Cell = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--monitor-text);
`;

const Result = styled.div<{ $tone: 'green' | 'blue' | 'amber' }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $tone }) => getHistoryToneColor($tone)};
`;

export default function TimecheckHistoryPanel({
  items,
  selectedId,
  onSelect
}: TimecheckHistoryPanelProps) {
  return (
    <Panel>
      <Header>
        <HeaderIcon />
        <Title>타임체크 이력 (최근)</Title>
      </Header>

      <Table>

        <Scroll>
          <List>
            {items.map((item) => (
              <Row
                key={item.id}
                type="button"
                $active={item.id === selectedId}
                onClick={() => onSelect(item.id)}
              >
                <Cell>{item.time}</Cell>
                <Cell>{item.equipment}</Cell>
                <Cell>{item.inspector}</Cell>
                <Result $tone={item.tone}>{item.result}</Result>
              </Row>
            ))}
          </List>
        </Scroll>
      </Table>
    </Panel>
  );
}
