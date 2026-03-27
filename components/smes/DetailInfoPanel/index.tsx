import styled from 'styled-components';
import type { DetailSection } from '../model/types';

interface DetailInfoPanelProps {
  sections: DetailSection[];
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
  gap: 14px;
  min-height: 36px;
  padding: 0 14px;
  background: var(--panel-head-bg);
  border-bottom: 1px solid #c6ced8;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: #2b384b;
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tab = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(205, 160, 68, 0.42)' : 'transparent')};
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#1f2e42' : '#68778c')};
  min-height: 28px;
  padding: 0 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

const Body = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 10px;
`;

const TableWrap = styled.div`
  border: 1px solid #c6d0db;
  border-radius: 8px;
  background: #f8fafc;
  overflow: hidden;
`;

const SectionCard = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #c6d0db;
  }
`;

const SectionTitle = styled.div`
  min-height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: #c7d2e1;
  color: #24354c;
  font-size: 13px;
  font-weight: 900;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #f2f5f9;
`;

const Th = styled.th`
  height: 28px;
  padding: 6px 8px;
  border-right: 1px solid #d4dce5;
  border-bottom: 1px solid #d4dce5;
  background: #eef2f7;
  color: #41546e;
  font-size: 12px;
  font-weight: 800;
  text-align: center;

  &:last-child {
    border-right: 0;
  }
`;

const TdBase = styled.td`
  height: 28px;
  padding: 6px 8px;
  border-right: 1px solid #d4dce5;
  border-bottom: 1px solid #d4dce5;
  background: #ffffff;
  color: #1f2c3e;
  font-size: 12px;
  font-weight: 700;
  text-align: center;

  &:last-child {
    border-right: 0;
  }

  &:nth-child(1) {
    background: #f3f6fa;
  }
`;

const BlueCell = styled(TdBase)`
  color: #4868c7;
`;

function shouldUseBlue(sectionTitle: string, value: string, index: number) {
  return sectionTitle.includes('TEMPERATURE') && index === 0 || value.endsWith('%') || value.includes('40 S') || value.includes('150');
}

export default function DetailInfoPanel({ sections }: DetailInfoPanelProps) {
  return (
    <Panel>
      <Head>
        <Title>상세 정보</Title>

        <Tabs>
          <Tab $active>사출조건표</Tab>
          <Tab>변경이력</Tab>
          <Tab>품질분석</Tab>
        </Tabs>
      </Head>

      <Body>
        <TableWrap>
          {sections.map((section) => (
            <SectionCard key={section.id}>
              <SectionTitle>{section.title}</SectionTitle>
              <Table>
                <thead>
                  <tr>
                    {section.columns.map((column, columnIndex) => (
                      <Th key={`${section.id}-${columnIndex}`}>{column}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, rowIndex) => (
                    <tr key={`${section.id}-row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => {
                        const CellComponent = shouldUseBlue(section.title, cell, cellIndex) ? BlueCell : TdBase;
                        return <CellComponent key={`${section.id}-${rowIndex}-${cellIndex}`}>{cell}</CellComponent>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </SectionCard>
          ))}
        </TableWrap>
      </Body>
    </Panel>
  );
}
