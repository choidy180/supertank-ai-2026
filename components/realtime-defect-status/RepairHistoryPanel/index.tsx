'use client';

import { useEffect, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { getHistoryToneLabel } from '../model/helpers';
import type { HistoryTone, RepairHistoryItem } from '../model/types';

// API 응답 타입 정의
interface ApiRepairLog {
  id: number;
  event_uuid: string;
  device_id: string;
  user_id: number;
  defect_type_id: number;
  resolution_report_stt: string;
  repair_time_hours: number;
  created_at: string;
  completed_at: string | null;
  filename: string | null;
  worker_name: string;
  repair_duration_min: string | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    totalCount: number;
    logs: ApiRepairLog[];
    summary: {
      completedCount: number;
      pendingCount: number;
    };
  };
}

interface RepairHistoryPanelProps {
  selectedId: string;
  onSelect: (id: string) => void;
  // ✨ 테마 프롭스 추가
  isDark: boolean;
}

const RepairHistoryPanel = ({ selectedId, onSelect, isDark }: RepairHistoryPanelProps) => {
  const [items, setItems] = useState<RepairHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchRepairHistory = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const apiUrl = `http://192.168.10.175:24828/api/DX_API006002?startDate=${formattedToday}&endDate=${formattedToday}&completed=true`;

    try {
      let response;
      try {
        response = await fetch(apiUrl, { method: 'GET' });
      } catch (networkError) {
        console.warn('[API 연결 실패] 서버가 닫혀있거나 네트워크 오류입니다:', networkError);
        setIsError(true);
        setItems([]);
        return; 
      }

      if (!response.ok) {
        console.warn(`[API 상태 에러] ${response.status}: ${apiUrl}`);
        setIsError(true);
        setItems([]);
        return; 
      }

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        const mappedItems: RepairHistoryItem[] = result.data.logs.map((log) => {
          const isCompleted = log.completed_at !== null;
          const dateObj = new Date(log.created_at);
          const formattedTime = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

          return {
            id: log.event_uuid,
            title: `단말기(${log.device_id}) 결함 보고`,
            tone: (isCompleted ? 'normal' : 'processing') as HistoryTone,
            time: formattedTime,
            worker: log.worker_name,
            action: isCompleted ? '조치 완료' : '처리 대기/진행 중',
            detail: log.resolution_report_stt || '입력된 상세 조치 내역이 없습니다.',
          };
        });

        setItems(mappedItems);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.warn('수리 이력 데이터를 처리하는데 실패했습니다:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepairHistory();
  }, [fetchRepairHistory]);

  const isDataEmpty = items.length === 0 || isError;

  return (
    <Panel $isDark={isDark}>
      <PanelHeader>
        <div>
          <PanelTitle $isDark={isDark}>수리 이력</PanelTitle>
        </div>
        <MetaPill $isDark={isDark}>최근 {items.length}건</MetaPill>
      </PanelHeader>

      <HistoryList $isDark={isDark}>
        {isLoading ? (
          <LoadingMessage $isDark={isDark}>데이터를 불러오는 중입니다...</LoadingMessage>
        ) : isDataEmpty ? (
          <EmptyContainer $isDark={isDark}>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyTitle $isDark={isDark}>금일 수리이력이 존재하지 않습니다.</EmptyTitle>
            {isError && <EmptyCaption $isDark={isDark}>서버 통신 중 문제가 발생했습니다.</EmptyCaption>}
          </EmptyContainer>
        ) : (
          items.map((item) => {
            const selected = item.id === selectedId;

            return (
              <HistoryItem key={item.id}>
                <HistoryCard 
                  type="button" 
                  $selected={selected} 
                  $isDark={isDark}
                  onClick={() => onSelect(item.id)}
                >
                  <HeaderGroup>
                    <StatusPill $tone={item.tone} $isDark={isDark}>{getHistoryToneLabel(item.tone)}</StatusPill>
                    <HistoryTitle $isDark={isDark}>{item.title}</HistoryTitle>
                    <TimeText $isDark={isDark}>{item.time}</TimeText>
                  </HeaderGroup>

                  <InfoGroup>
                    <MetaLine $isDark={isDark}>작업자: <span>{item.worker}</span></MetaLine>
                    <MetaLine $isDark={isDark}>조치: <span>{item.action}</span></MetaLine>
                  </InfoGroup>

                  <DetailLine $isDark={isDark}>{item.detail}</DetailLine>
                </HistoryCard>
              </HistoryItem>
            );
          })
        )}
      </HistoryList>
    </Panel>
  );
};

// --- Styled Components ---

// ✨ Linter 에러 방지를 위한 톤 분기 함수 외부 분리
const getToneStyle = (tone: HistoryTone, isDark: boolean) => {
  if (tone === 'incident') {
    return css`
      color: ${isDark ? '#ff453a' : '#ff3b30'};
      border: 1px solid ${isDark ? 'rgba(255, 69, 58, 0.3)' : 'rgba(255, 59, 48, 0.2)'};
      background: ${isDark ? 'rgba(255, 69, 58, 0.12)' : 'rgba(255, 59, 48, 0.08)'};
    `;
  }
  if (tone === 'processing') {
    return css`
      color: ${isDark ? '#ff9f0a' : '#ff9500'};
      border: 1px solid ${isDark ? 'rgba(255, 159, 10, 0.3)' : 'rgba(255, 149, 0, 0.2)'};
      background: ${isDark ? 'rgba(255, 159, 10, 0.12)' : 'rgba(255, 149, 0, 0.08)'};
    `;
  }
  // normal (green)
  return css`
    color: ${isDark ? '#30d158' : '#34c759'};
    border: 1px solid ${isDark ? 'rgba(48, 209, 88, 0.3)' : 'rgba(52, 199, 89, 0.2)'};
    background: ${isDark ? 'rgba(48, 209, 88, 0.12)' : 'rgba(52, 199, 89, 0.08)'};
  `;
};

// OverviewPanel과 동일한 패널 스타일 유지
const Panel = styled.section<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 24px;
  border-radius: 28px;
  
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};
  background: ${({ $isDark }) => ($isDark ? 'linear-gradient(180deg, #1c1c1e 0%, #151516 100%)' : '#ffffff')};
  box-shadow: ${({ $isDark }) => ($isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)')};
  
  overflow: hidden;
  transition: all 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h2<{ $isDark: boolean }>`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
  letter-spacing: -0.03em;
  transition: color 0.3s ease;
`;

const MetaPill = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  
  background: ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)')};
  color: ${({ $isDark }) => ($isDark ? '#5ac8fa' : '#007aff')};
  transition: all 0.3s ease;
`;

const HistoryList = styled.div<{ $isDark: boolean }>`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { 
    background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)')}; 
    border-radius: 999px; 
  }
`;

const EmptyContainer = styled.div<{ $isDark: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  
  /* 애플 스타일의 깔끔한 블러 효과 */
  background: ${({ $isDark }) => ($isDark ? 'rgba(28, 28, 30, 0.45)' : 'rgba(245, 245, 247, 0.6)')};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px dashed ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')};
  min-height: 200px; 
  transition: all 0.3s ease;
`;

const EmptyIcon = styled.div`
  font-size: 42px;
  margin-bottom: 16px;
  opacity: 0.9;
`;

const EmptyTitle = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#e5e5ea' : '#1d1d1f')};
  letter-spacing: -0.02em;
`;

const EmptyCaption = styled.div<{ $isDark: boolean }>`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isDark }) => ($isDark ? '#ff453a' : '#ff3b30')};
`;

const LoadingMessage = styled.div<{ $isDark: boolean }>`
  padding: 40px 0;
  text-align: center;
  color: ${({ $isDark }) => ($isDark ? '#86868b' : '#86868b')};
  font-size: 15px;
  font-weight: 600;
`;

const HistoryItem = styled.div`
  width: 100%;
`;

const HistoryCard = styled.button<{ $selected: boolean; $isDark: boolean }>`
  appearance: none;
  border: none;
  outline: none;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 테마와 선택 여부에 따른 디자인 분기 */
  background: ${({ $selected, $isDark }) => {
    if ($selected) return $isDark ? 'rgba(10, 132, 255, 0.08)' : '#ffffff';
    return $isDark ? 'rgba(255, 255, 255, 0.03)' : '#f5f5f7';
  }};
  
  border: 1px solid ${({ $selected, $isDark }) => {
    if ($selected) return $isDark ? '#0a84ff' : '#007aff';
    return 'transparent';
  }};

  box-shadow: ${({ $selected, $isDark }) => {
    if ($selected && !$isDark) return '0 4px 12px rgba(0, 0, 0, 0.06)';
    return 'none';
  }};
  
  &:hover {
    transform: translateY(-2px);
    background: ${({ $selected, $isDark }) => {
      if ($selected) return $isDark ? 'rgba(10, 132, 255, 0.12)' : '#ffffff';
      return $isDark ? 'rgba(255, 255, 255, 0.06)' : '#ebebed';
    }};
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
`;

const HistoryTitle = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
  word-break: keep-all;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const TimeText = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $isDark }) => ($isDark ? '#86868b' : '#86868b')};
`;

const InfoGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const MetaLine = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${({ $isDark }) => ($isDark ? '#a1a1a6' : '#515154')};
  span { 
    color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')}; 
    font-weight: 600; 
  }
`;

const DetailLine = styled.div<{ $isDark: boolean }>`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $isDark }) => ($isDark ? '#d1d1d6' : '#333336')};
  word-break: keep-all;
  background: ${({ $isDark }) => ($isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)')};
  padding: 12px 14px;
  border-radius: 12px;
`;

const StatusPill = styled.div<{ $tone: HistoryTone; $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;

  ${({ $tone, $isDark }) => getToneStyle($tone, $isDark)}
`;

export default RepairHistoryPanel;