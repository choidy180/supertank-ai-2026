import styled from 'styled-components';

import DonutChart from '../charts/DonutChart';
import { getToneColor } from '../model/helpers';
import type { DefectTypeStat } from '../model/types';

interface DefectTypePanelProps {
  items: DefectTypeStat[];
  total: number;
  topLabel: string;
}

const DefectTypePanel = ({ items, total, topLabel }: DefectTypePanelProps) => {
  return (
    <PanelCard>
      <PanelHeader>
        <div>
          <PanelTitle>불량 유형별 통계</PanelTitle>
        </div>
        <MetaPill>최다 유형 · {topLabel}</MetaPill>
      </PanelHeader>

      <Content>
        {/* ✨ 그래프가 위로 올라가고 눈에 띄도록 배치 변경 */}
        <DonutChart items={items} total={total} />

        {/* ✨ 범례 속성을 아래로 내림 */}
        <LegendList>
          {items.map((item) => (
            <LegendItem key={item.id}>
              <LegendLeft>
                <LegendDot style={{ background: getToneColor(item.tone) }} />
                <LegendLabel>{item.label}</LegendLabel>
              </LegendLeft>
              <LegendValue>{item.value}%</LegendValue>
            </LegendItem>
          ))}
        </LegendList>
      </Content>
    </PanelCard>
  );
};

const PanelCard = styled.section`
  /* ✨ grid 대신 flex로 변경하여 내부 요소를 세로로 배치 */
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  padding: 22px; /* 패딩을 약간 늘려 여유 공간 확보 */
  border-radius: 26px; /* 둥글기 증가 */
  /* ✨ 다크 테마용 테두리 색상으로 변경 (라이트 모드 변수 교체) */
  border: 1px solid rgba(133, 154, 194, 0.16);
  /* ✨ 더 어두운 그라데이션으로 변경하여 차트 색상 강조 */
  background: linear-gradient(180deg, rgba(13, 24, 46, 0.94) 0%, rgba(10, 18, 36, 0.94) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 20px 60px rgba(0, 0, 0, 0.32); /* 그림자 강화 */
  backdrop-filter: blur(16px); /* 블러 효과 추가로 입체감 부여 */
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  /* ✨ 크기 대폭 증대 및 흰색으로 고정 */
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  /* ✨ 다크 테마용 파란색 색상으로 변경 */
  border: 1px solid rgba(74, 140, 255, 0.36);
  background: rgba(74, 140, 255, 0.12);
  /* ✨ 밝은 흰색으로 변경 */
  font-size: 12px;
  font-weight: 700;
  color: #f5f7ff; 
  white-space: nowrap;
`;

const Content = styled.div`
  /* ✨ 참조 이미지처럼 세로 배치 고정 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 중앙 정렬 */
  justify-content: flex-start;
  /* ✨ 차트와 범례 사이의 넓은 간격 확보 (참조 이미지 스타일) */
  gap: 20px; 
  min-height: 0;
  width: 100%; /* 너비 꽉 채우기 */
`;

const LegendList = styled.div`
  display: grid;
  gap: 12px;
  width: 100%; /* 범례 목록의 너비를 최대로 설정 */
  max-width: 600px; /* 범례가 너무 넓어지는 것을 방지 (참조 이미지 스타일) */
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px; /* 내부 간격 넓힘 */
  min-height: 52px; /* 높이 증가 */
  padding: 0 16px;
  border-radius: 18px; /* 둥글기 증가 */
  /* ✨ 다크 테마용 배경 및 테두리 색상으로 변경 */
  background: rgba(15, 28, 53, 0.76);
  border: 1px solid rgba(133, 154, 194, 0.12);
`;

const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  /* ✨currentColor를 상속받도록 svg 속성 추가 */
  box-shadow: 0 0 12px currentColor;
  svg {
    stroke: currentColor; 
  }
`;

const LegendLabel = styled.div`
  /* ✨ 크기 증대 및 밝은 흰색으로 변경 */
  font-size: 18px;
  font-weight: 600;
  color: #f5f7ff;
  margin-left: 8px;
`;

const LegendValue = styled.div`
  /* ✨ 크기 증대 및 완전한 흰색으로 변경 */
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
`;

export default DefectTypePanel;