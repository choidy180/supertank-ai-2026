import styled from 'styled-components';
import type { DowntimeHistoryRow } from '../model/types';

interface DowntimeHistoryPanelProps {
  rows: DowntimeHistoryRow[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const Panel = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border: 1px solid #b8c2ce;
  border-radius: 10px;
  background: var(--panel-bg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 34px;
  padding: 0 12px;
  background: var(--panel-head-bg);
  border-bottom: 1px solid #c6ced8;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: #2b384b;
`;

const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Meta = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #7b889c;
`;

const DetailButton = styled.button`
  appearance: none;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #b8c8df;
  background: #edf5ff;
  color: #5374a6;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;
`;

const Body = styled.div`
  min-height: 0;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  z-index: 1;
  height: 32px;
  padding: 6px 8px;
  background: #edf2f7;
  border-bottom: 1px solid #d2dae4;
  color: #6d7b8f;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
`;

const RowButton = styled.tr<{ $selected: boolean }>`
  cursor: pointer;
  background: ${({ $selected }) => ($selected ? '#cfe3fb' : '#ffffff')};

  &:nth-child(even) {
    background: ${({ $selected }) => ($selected ? '#cfe3fb' : '#f9fbfd')};
  }
`;

const Td = styled.td`
  height: 36px;
  padding: 8px 8px;
  border-bottom: 1px solid #d8dfe8;
  color: #1e2d41;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
`;

const PrimaryCell = styled(Td)`
  text-align: left;
  color: #223b61;
`;

const Grade = styled.div<{ $tone: '정보' | '주의' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  min-width: 42px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid ${({ $tone }) => ($tone === '주의' ? '#d3c16f' : '#a6c4e8')};
  background: ${({ $tone }) => ($tone === '주의' ? '#f6f1d2' : '#eaf3ff')};
  color: ${({ $tone }) => ($tone === '주의' ? '#6e651e' : '#4d6b97')};
  font-size: 11px;
  font-weight: 900;
`;

export default function DowntimeHistoryPanel({ rows, selectedId, onSelect }: DowntimeHistoryPanelProps) {
  return (
    <Panel>
      <Head>
        <Title>무작업 / 비가동 이력</Title>
        <HeadActions>
          <Meta>미조치 1건</Meta>
          <DetailButton>선택 상세</DetailButton>
        </HeadActions>
      </Head>

      <Body>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: '26%' }}>사유</Th>
              <Th style={{ width: '16%' }}>시작시간</Th>
              <Th style={{ width: '16%' }}>종료시간</Th>
              <Th style={{ width: '12%' }}>정지(분)</Th>
              <Th style={{ width: '14%' }}>작업자</Th>
              <Th style={{ width: '16%' }}>등급</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <RowButton key={row.id} $selected={row.id === selectedId} onClick={() => onSelect(row.id)}>
                <PrimaryCell>{row.reason}</PrimaryCell>
                <Td>{row.startTime}</Td>
                <Td>{row.endTime}</Td>
                <Td>{row.stopSeconds}</Td>
                <Td>{row.worker}</Td>
                <Td>
                  <Grade $tone={row.grade}>{row.grade}</Grade>
                </Td>
              </RowButton>
            ))}
          </tbody>
        </Table>
      </Body>
    </Panel>
  );
}
