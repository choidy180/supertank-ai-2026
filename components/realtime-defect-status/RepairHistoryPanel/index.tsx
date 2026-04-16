'use client';

import { useEffect, useState } from 'react';
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
}

const RepairHistoryPanel = ({ selectedId, onSelect }: RepairHistoryPanelProps) => {
  const [items, setItems] = useState<RepairHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepairHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://192.168.10.175:24828/api/DX_API006002', {
          method: 'GET',
        });
        
        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
          // API 데이터를 UI 모델(RepairHistoryItem)에 맞게 변환
          const mappedItems: RepairHistoryItem[] = result.data.logs.map((log) => {
            const isCompleted = log.completed_at !== null;
            
            // 날짜 포맷팅 (YYYY-MM-DD HH:MM)
            const dateObj = new Date(log.created_at);
            const formattedTime = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            return {
              id: log.event_uuid, // UUID를 고유 식별자로 사용
              title: `단말기(${log.device_id}) 결함 보고`, // 적절한 제목 생성
              tone: (isCompleted ? 'normal' : 'processing') as HistoryTone,
              time: formattedTime,
              worker: log.worker_name,
              action: isCompleted ? '조치 완료' : '처리 대기/진행 중',
              detail: log.resolution_report_stt || '입력된 상세 조치 내역이 없습니다.',
            };
          });

          setItems(mappedItems);
        }
      } catch (error) {
        console.error('수리 이력 데이터를 불러오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairHistory();
  }, []);

  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>수리 이력</PanelTitle>
        </div>
        <MetaPill>최근 {items.length}건</MetaPill>
      </PanelHeader>

      <HistoryList>
        {isLoading ? (
          <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>
        ) : items.length === 0 ? (
          <LoadingMessage>수리 이력이 없습니다.</LoadingMessage>
        ) : (
          items.map((item) => {
            const selected = item.id === selectedId;

            return (
              <HistoryItem key={item.id}>
                <HistoryCard 
                  type="button" 
                  $selected={selected} 
                  onClick={() => onSelect(item.id)}
                >
                  {/* ✨ 카드 상단: 상태 버튼, 제목, 시간을 세로로 배치 */}
                  <HeaderGroup>
                    <StatusPill $tone={item.tone}>{getHistoryToneLabel(item.tone)}</StatusPill>
                    <HistoryTitle>{item.title}</HistoryTitle>
                    <TimeText>{item.time}</TimeText>
                  </HeaderGroup>

                  {/* ✨ 중간 정보 라인 */}
                  <InfoGroup>
                    <MetaLine>작업자: <span>{item.worker}</span></MetaLine>
                    <MetaLine>조치: <span>{item.action}</span></MetaLine>
                  </InfoGroup>

                  {/* ✨ 상세 내용 */}
                  <DetailLine>{item.detail}</DetailLine>
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

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 22px;
  border-radius: 28px;
  border: 1px solid rgba(133, 154, 194, 0.16);
  background: linear-gradient(180deg, rgba(13, 24, 46, 0.94) 0%, rgba(10, 18, 36, 0.94) 100%);
  box-shadow: 0 24px 68px rgba(0, 0, 0, 0.32);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(74, 140, 255, 0.12);
  border: 1px solid rgba(74, 140, 255, 0.24);
  font-size: 13px;
  font-weight: 700;
  color: #60a5fa;
`;

const HistoryList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 6px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(133, 154, 194, 0.2); border-radius: 999px; }
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #7f95c0;
  font-size: 15px;
  font-weight: 600;
`;

const HistoryItem = styled.div`
  width: 100%;
`;

const HistoryCard = styled.button<{ $selected: boolean }>`
  appearance: none;
  border: none;
  outline: none;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  /* ✨ 배경 및 테두리 설정 */
  background: ${({ $selected }) => ($selected ? 'rgba(24, 45, 87, 0.92)' : 'rgba(18, 32, 60, 0.76)')};
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(74, 140, 255, 0.4)' : 'rgba(133, 154, 194, 0.12)')};
  
  &:hover {
    transform: translateY(-2px);
    background: ${({ $selected }) => ($selected ? 'rgba(24, 45, 87, 0.92)' : 'rgba(24, 42, 77, 0.85)')};
    border-color: rgba(133, 154, 194, 0.3);
  }
`;

const HeaderGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  gap: 10px; /* 요소들 사이의 세로 간격 */
  margin-bottom: 16px;
`;

const HistoryTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  word-break: keep-all; /* 단어 단위로 줄바꿈되도록 유지 */
  line-height: 1.4; /* 세로 배열 시 읽기 편하도록 줄간격 추가 */
`;

const TimeText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #7f95c0;
`;


const InfoGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const MetaLine = styled.div`
  font-size: 13px;
  color: #9ab0da;
  span { color: #f5f7ff; font-weight: 600; }
`;

const DetailLine = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #c4d4f2;
  word-break: keep-all;
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 12px;
`;

const StatusPill = styled.div<{ $tone: HistoryTone }>`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;

  ${({ $tone }) => {
    if ($tone === 'incident') return css` color: #ff6b86; border: 1px solid rgba(255, 107, 134, 0.3); background: rgba(255, 107, 134, 0.12); `;
    if ($tone === 'processing') return css` color: #ffba55; border: 1px solid rgba(255, 186, 85, 0.3); background: rgba(255, 186, 85, 0.12); `;
    return css` color: #2fd698; border: 1px solid rgba(47, 214, 152, 0.3); background: rgba(47, 214, 152, 0.12); `;
  }};
`;

export default RepairHistoryPanel;