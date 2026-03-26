'use client';

import styled, { css } from 'styled-components';
import { getHistoryToneLabel } from '../model/helpers';
import type { HistoryTone, RepairHistoryItem } from '../model/types';

interface RepairHistoryPanelProps {
  items: RepairHistoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const RepairHistoryPanel = ({ items, selectedId, onSelect }: RepairHistoryPanelProps) => {
  return (
    <Panel>
      <PanelHeader>
        <div>
          <PanelTitle>수리 이력</PanelTitle>
        </div>
        <MetaPill>최근 {items.length}건</MetaPill>
      </PanelHeader>

      <HistoryList>
        {items.map((item) => {
          const selected = item.id === selectedId;

          return (
            <HistoryItem key={item.id}>
              <HistoryCard 
                type="button" 
                $selected={selected} 
                onClick={() => onSelect(item.id)}
              >
                {/* ✨ 카드 상단: 제목 + 상태 + 시간 배치 */}
                <TopLine>
                  <TitleGroup>
                    <StatusPill $tone={item.tone}>{getHistoryToneLabel(item.tone)}</StatusPill>
                    <HistoryTitle>{item.title}</HistoryTitle>
                  </TitleGroup>
                  <TimeText>{item.time}</TimeText>
                </TopLine>

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
        })}
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

const TopLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HistoryTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  word-break: keep-all;
`;

const TimeText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7f95c0;
  flex-shrink: 0;
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