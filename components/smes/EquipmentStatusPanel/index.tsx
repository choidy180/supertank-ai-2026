import styled from 'styled-components';
import type { StatusTile } from '../model/types';

interface EquipmentStatusPanelProps {
  tiles: StatusTile[];
}

const Panel = styled.section`
  min-height: 160px;
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
  gap: 16px; /* 12px -> 16px */
  min-height: 48px; /* 34px -> 48px (글자가 커진 만큼 높이 확보) */
  padding: 0 16px;
  background: var(--panel-head-bg);
  border-bottom: 1px solid #c6ced8;
`;

const Title = styled.div`
  font-size: 20px; /* 15px -> 20px */
  font-weight: 800;
  color: #2b384b;
`;

const Meta = styled.div`
  font-size: 16px; /* 11px -> 16px */
  font-weight: 700;
  color: #748299;
`;

const Grid = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px; /* 10px -> 16px */
  padding: 16px; /* 10px -> 16px */
`;

const Tile = styled.div`
  min-height: 126px; /* 84px -> 110px (내부 텍스트 크기 증가 반영) */
  display: grid;
  gap: 12px; /* 8px -> 12px */
  padding: 16px 20px; /* 12px 14px -> 16px 20px */
  border-radius: 8px;
  border: 1px solid rgba(74, 114, 162, 0.55);
  background: var(--dark-card);
  box-shadow:
    inset 0 0 0 1px rgba(11, 35, 61, 0.72),
    inset 0 0 30px rgba(32, 90, 174, 0.07);
`;

const TileLabel = styled.div`
  font-size: 18px; /* 13px -> 18px */
  font-weight: 900;
  color: #7e99bc;
  letter-spacing: 0.04em;
`;

const TileValue = styled.div<{ $accent: 'yellow' | 'white' | 'red' | 'green' | 'blue' }>`
  font-size: 30px; /* 22px -> 30px (메인 수치 강조) */
  line-height: 1;
  font-weight: 900;
  color:
    ${({ $accent }) => {
      switch ($accent) {
        case 'yellow':
          return 'var(--yellow)';
        case 'green':
          return '#59ff88';
        case 'red':
          return '#ff5c64';
        case 'blue':
          return '#64beff';
        default:
          return '#ffffff';
      }
    }};
`;

const TileNote = styled.div`
  font-size: 16px; /* 11px -> 16px */
  font-weight: 700;
  color: #6f86a7;
`;

export default function EquipmentStatusPanel({ tiles }: EquipmentStatusPanelProps) {
  return (
    <Panel>
      <Head>
        <Title>설비 상태</Title>
        <Meta>실시간 상태 모니터</Meta>
      </Head>

      <Grid>
        {tiles.map((tile) => (
          <Tile key={tile.id}>
            <TileLabel>{tile.label}</TileLabel>
            <TileValue $accent={tile.accent}>{tile.value}</TileValue>
            <TileNote>{tile.note}</TileNote>
          </Tile>
        ))}
      </Grid>
    </Panel>
  );
}