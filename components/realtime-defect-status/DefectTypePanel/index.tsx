'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import DonutChart from '../charts/DonutChart';
import { getToneColor } from '../model/helpers';

// --- API 및 로컬 상태 타입 정의 ---
interface ApiSummaryType {
  id: number;
  name: string;
  count: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    summary_type: ApiSummaryType[];
  };
}

interface DefectItem {
  id: string;
  label: string;
  value: number; 
  count: number; 
  tone: string;
}

interface DefectTypePanelProps {
  isDark: boolean;
}

const DefectTypePanel = ({ isDark }: DefectTypePanelProps) => {
  const [items, setItems] = useState<DefectItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [topLabel, setTopLabel] = useState<string>('-');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDefectTypes = async () => {
      try {
        setIsLoading(true);

        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const apiUrl = `http://192.168.10.175:24828/api/DX_API006002?startDate=${formattedToday}&endDate=${formattedToday}`;
        
        let response;
        try {
          response = await fetch(apiUrl, { method: 'GET' });
        } catch (networkError) {
          console.warn('[Defect Type API 연결 실패]', networkError);
          return; 
        }

        if (!response.ok) {
          console.warn(`[Defect Type API 상태 에러] ${response.status}`);
          return; 
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data?.summary_type) {
          const rawSummaryTypes = result.data.summary_type;
          const groupedMap = new Map<string, ApiSummaryType>();
          
          rawSummaryTypes.forEach((item) => {
            if (groupedMap.has(item.name)) {
              groupedMap.get(item.name)!.count += item.count;
            } else {
              groupedMap.set(item.name, { ...item });
            }
          });

          const summaryTypes = Array.from(groupedMap.values());
          const totalCount = summaryTypes.reduce((acc, curr) => acc + curr.count, 0);

          let maxItemName = '-';
          if (summaryTypes.length > 0) {
            const maxItem = summaryTypes.reduce((prev, current) => 
              (prev.count > current.count) ? prev : current
            );
            maxItemName = maxItem.name;
          }

          const tones = ['incident', 'processing', 'done', 'info', 'normal'];

          const mappedItems: DefectItem[] = summaryTypes
            .map((item, index) => ({
              id: String(item.id),
              label: item.name,
              count: item.count,
              value: totalCount === 0 ? 0 : Math.round((item.count / totalCount) * 100),
              tone: tones[index % tones.length], 
            }))
            .sort((a, b) => b.count - a.count); 

          setTotal(totalCount);
          setTopLabel(maxItemName);
          setItems(mappedItems);
        }
      } catch (error) {
        console.warn('불량 유형 통계를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefectTypes();
  }, []);

  return (
    <PanelCard $isDark={isDark}>
      <PanelHeader>
        <div>
          <PanelTitle $isDark={isDark}>불량 유형별 통계</PanelTitle>
        </div>
        <MetaPill $isDark={isDark}>최다 유형 · {topLabel}</MetaPill>
      </PanelHeader>

      <Content>
        {isLoading ? (
          <LoadingMessage $isDark={isDark}>데이터를 불러오는 중입니다...</LoadingMessage>
        ) : items.length === 0 || total === 0 ? (
          // ✨ 텍스트 대신 깔끔하고 예쁜 빈 상태(Empty State) 디자인 적용
          <EmptyChartContainer $isDark={isDark}>
            <EmptyDonutGraphic $isDark={isDark} />
            <EmptyTextMain $isDark={isDark}>집계된 데이터 없음</EmptyTextMain>
            <EmptyTextSub $isDark={isDark}>금일 발생한 불량 유형 데이터가 없습니다.</EmptyTextSub>
          </EmptyChartContainer>
        ) : (
          <>
            <DonutChart items={items as any} total={total} isDark={isDark} />

            <LegendList>
              {items.map((item) => (
                <LegendItem key={item.id} $isDark={isDark}>
                  <LegendLeft>
                    <LegendDot style={{ background: getToneColor(item.tone as any) }} />
                    <LegendLabel $isDark={isDark}>{item.label}</LegendLabel>
                  </LegendLeft>
                  <LegendValue $isDark={isDark}>{item.value}%</LegendValue>
                </LegendItem>
              ))}
            </LegendList>
          </>
        )}
      </Content>
    </PanelCard>
  );
};

// --- Styled Components ---

const PanelCard = styled.section<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  padding: 24px; 
  border-radius: 24px; 
  
  background-color: ${({ $isDark }) => ($isDark ? '#1c1c1e' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.03), 0 1px 4px rgba(0, 0, 0, 0.02)'};
  transition: all 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const PanelTitle = styled.h3<{ $isDark: boolean }>`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
`;

const MetaPill = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  background: ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)')};
  color: ${({ $isDark }) => ($isDark ? '#5ac8fa' : '#007aff')};
`;

const Content = styled.div`
  flex: 1; /* ✨ 핵심 1: 부모(PanelCard)의 남은 세로 공간을 100% 꽉 채우도록 변경 */
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: flex-start;
  gap: 24px; 
  min-height: 0;
  width: 100%; 
`;

const LoadingMessage = styled.div<{ $isDark: boolean }>`
  padding: 40px 0;
  color: ${({ $isDark }) => ($isDark ? '#86868b' : '#86868b')};
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;

/* ✨ 새롭게 추가된 데이터 없음(Empty State) 디자인 컴포넌트들 */

const EmptyChartContainer = styled.div<{ $isDark: boolean }>`
  flex: 1; /* ✨ 핵심 2: Content 영역 전체를 차지하도록 변경 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* ✨ 핵심 3: 내용물을 상하좌우 완벽한 중앙으로 정렬 */
  width: 100%;
  min-height: 250px; /* 300px에서 조금 줄여서 유연하게 반응하도록 수정 */
  border-radius: 20px;
  background-color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.02)' : '#fcfcfc')};
  border: 1px dashed ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')};
`;

/* CSS만으로 도넛 차트의 빈 윤곽선을 모방한 예쁜 그래픽 */
const EmptyDonutGraphic = styled.div<{ $isDark: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 14px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)')};
  margin-bottom: 20px;
`;

const EmptyTextMain = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#e5e5ea' : '#1d1d1f')};
  margin-bottom: 8px;
`;

const EmptyTextSub = styled.div<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${({ $isDark }) => ($isDark ? '#8e8e93' : '#86868b')};
  font-weight: 500;
`;

/* 기존 범례 관련 스타일 컴포넌트 유지 */

const LegendList = styled.div`
  display: grid;
  gap: 8px;
  width: 100%; 
`;

const LegendItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px; 
  min-height: 48px; 
  padding: 0 16px;
  border-radius: 14px; 
  
  background-color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.04)' : '#f5f5f7')};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : '#ebebed')};
  }
`;

const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const LegendDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;

const LegendLabel = styled.div<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#e5e5ea' : '#1d1d1f')};
`;

const LegendValue = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
`;

export default DefectTypePanel;