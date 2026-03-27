import styled from 'styled-components';
import type { WorkOrderRow } from '../model/types';

interface WorkOrderPanelProps {
  rows: WorkOrderRow[];
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

const Meta = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #7b889c;
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
  white-space: nowrap;
`;

const PrimaryCell = styled(Td)`
  text-align: left;
  color: #223b61;
`;

export default function WorkOrderPanel({ rows, selectedId, onSelect }: WorkOrderPanelProps) {
  return (
    <Panel>
      <Head>
        <Title>작업 오더</Title>
        <Meta>W/O {rows.length}건</Meta>
      </Head>

      <Body>
        <Table>
          <thead>
            <tr>
              <Th style={{ width: '28%' }}>W/O</Th>
              <Th style={{ width: '14%' }}>시작</Th>
              <Th style={{ width: '14%' }}>종료</Th>
              <Th style={{ width: '12%' }}>계획</Th>
              <Th style={{ width: '10%' }}>투입</Th>
              <Th style={{ width: '10%' }}>완료</Th>
              <Th style={{ width: '12%' }}>불량</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <RowButton
                key={row.id}
                $selected={row.id === selectedId}
                onClick={() => {
                  onSelect(row.id);
                }}
              >
                <PrimaryCell>{row.workOrder}</PrimaryCell>
                <Td>{row.start}</Td>
                <Td>{row.end}</Td>
                <Td>{row.plan}</Td>
                <Td>{row.input}</Td>
                <Td>{row.completed}</Td>
                <Td>{row.defect}</Td>
              </RowButton>
            ))}
          </tbody>
        </Table>
      </Body>
    </Panel>
  );
}
