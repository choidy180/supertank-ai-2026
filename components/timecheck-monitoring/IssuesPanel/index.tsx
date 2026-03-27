'use client';

import styled from 'styled-components';
import { IssueItem } from '../model/types';

interface IssuesPanelProps {
  items: IssueItem[];
}

const Panel = styled.section`
  min-height: 0;
  padding: 18px 18px 16px;
  border-radius: 22px;
  border: 1px solid rgba(255, 128, 142, 0.14);
  background:
    radial-gradient(circle at 100% 0%, rgba(255, 106, 122, 0.08) 0%, rgba(255, 106, 122, 0) 30%),
    linear-gradient(180deg, rgba(27, 14, 23, 0.96) 0%, rgba(15, 10, 18, 0.96) 100%);
  box-shadow:
    0 18px 52px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const AlertDot = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--monitor-red);
  box-shadow: 0 0 14px rgba(255, 106, 122, 0.46);
  position: relative;
  margin-bottom: 10px;

  &::after {
    content: '!';
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: #fff8f8;
    font-size: 20px;
    font-weight: 900;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--monitor-white);
  margin-bottom: 10px;
`;

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div<{ $tone: 'red' | 'amber' }>`
  display: grid;
  gap: 8px;
  padding: 14px 14px 13px;
  border-radius: 16px;
  border: 1px solid ${({ $tone }) => ($tone === 'red' ? 'rgba(255, 106, 122, 0.22)' : 'rgba(255, 197, 66, 0.2)')};
  background: ${({ $tone }) => ($tone === 'red' ? 'rgba(70, 13, 24, 0.4)' : 'rgba(62, 41, 8, 0.34)')};
`;

const ItemTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff7f8;
`;

const ItemMeta = styled.div<{ $tone: 'red' | 'amber' }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $tone }) => ($tone === 'red' ? '#ffbcc3' : '#ffd886')};
`;

export default function IssuesPanel({ items }: IssuesPanelProps) {
  return (
    <Panel>
      <Header>
        <AlertDot />
        <Title>주요 이슈 사항 ({items.length}건)</Title>
      </Header>

      <List>
        {items.map((item) => (
          <Item key={item.id} $tone={item.tone}>
            <ItemTitle>{item.title}</ItemTitle>
            <ItemMeta $tone={item.tone}>
              {item.time} 발생 · {item.detail}
            </ItemMeta>
          </Item>
        ))}
      </List>
    </Panel>
  );
}
