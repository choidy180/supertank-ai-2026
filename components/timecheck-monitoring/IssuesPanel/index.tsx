'use client';

import styled from 'styled-components';

import { IssueItem } from '../model/types';

interface IssuesPanelProps {
  items: IssueItem[];
}

type IssueTone = 'red' | 'amber';

type ToneVars = {
  color: string;
  border: string;
  background: string;
  label: string;
};

const ISSUE_TONE_VARS: Record<IssueTone, ToneVars> = {
  red: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
    label: '긴급',
  },
  amber: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
    label: '주의',
  },
};

export default function IssuesPanel({ items }: IssuesPanelProps) {
  return (
    <Panel>
      <Header>
        <AlertIcon>!</AlertIcon>
        <Title>주요 이슈 사항 ({items.length}건)</Title>
      </Header>

      {items.length === 0 ? (
        <EmptyState>현재 등록된 주요 이슈가 없습니다.</EmptyState>
      ) : (
        <List>
          {items.map((item) => (
            <Item key={item.id} $tone={item.tone}>
              <ItemTop>
                <ItemTitle>{item.title}</ItemTitle>

                <ToneBadge $tone={item.tone}>
                  <ToneDot $tone={item.tone} />
                  {ISSUE_TONE_VARS[item.tone].label}
                </ToneBadge>
              </ItemTop>

              <ItemMeta $tone={item.tone}>
                {item.time} 발생 · {item.detail}
              </ItemMeta>
            </Item>
          ))}
        </List>
      )}
    </Panel>
  );
}

const Panel = styled.section`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  min-height: 0;
  padding: 18px 18px 16px;
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

const AlertIcon = styled.span`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  border: 1px solid var(--color-error);
  border-radius: 999px;
  background: var(--color-error-soft);
  color: var(--color-error);
  font-size: 17px;
  font-weight: 900;
  line-height: 1;
`;

const Title = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

const List = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
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

const Item = styled.div<{ $tone: IssueTone }>`
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => ISSUE_TONE_VARS[$tone].border};
    background: var(--color-surface-hover);
  }
`;

const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

const ItemTitle = styled.div`
  min-width: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.45;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

const ToneBadge = styled.div<{ $tone: IssueTone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => ISSUE_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => ISSUE_TONE_VARS[$tone].background};
  color: ${({ $tone }) => ISSUE_TONE_VARS[$tone].color};
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
`;

const ToneDot = styled.span<{ $tone: IssueTone }>`
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => ISSUE_TONE_VARS[$tone].color};
`;

const ItemMeta = styled.div<{ $tone: IssueTone }>`
  color: ${({ $tone }) => ISSUE_TONE_VARS[$tone].color};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.45;
  word-break: keep-all;
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
  font-size: 16px;
  line-height: 1.7;
  word-break: keep-all;
`;