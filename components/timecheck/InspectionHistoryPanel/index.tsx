import type { FC } from 'react';

import { getLogLevelLabel } from '../model/helpers';
import type {
  InspectionLog,
  LogFilter
} from '../model/types';
import {
  PanelCaption,
  PanelTitle,
  PanelTitleGroup,
  PanelTop
} from '../shared/styles';
import {
  EmptyState,
  FilterChip,
  FilterRow,
  TimelineBadge,
  TimelineCardButton,
  TimelineCardTop,
  TimelineDetail,
  TimelineItem,
  TimelineList,
  TimelineMeta,
  TimelineTime,
  TimelineTitle,
  TimelineWrap,
  TitleGroup // ✨ 새로 추가된 컨테이너
} from './styles';

interface InspectionHistoryPanelProps {
  logs: InspectionLog[];
  filter: LogFilter;
  selectedLineId: string;
  selectedCheckpointId: string;
  onChangeFilter: (filter: LogFilter) => void;
  onFocusLog: (lineId: string, checkpointId: string) => void;
}

const InspectionHistoryPanel: FC<InspectionHistoryPanelProps> = ({
  logs,
  filter,
  selectedLineId,
  selectedCheckpointId,
  onChangeFilter,
  onFocusLog
}) => {
  return (
    <>
      <PanelTop>
        <PanelTitleGroup>
          <PanelTitle>점검 이력</PanelTitle>
          <PanelCaption>
            시간대와 상태 필터를 조합해서 필요한 점검 기록만 빠르게 확인할 수 있습니다.
          </PanelCaption>
        </PanelTitleGroup>
      </PanelTop>

      <FilterRow>
        <FilterChip
          type="button"
          $active={filter === 'all'}
          onClick={() => onChangeFilter('all')}
        >
          전체
        </FilterChip>
        <FilterChip
          type="button"
          $active={filter === 'ok'}
          onClick={() => onChangeFilter('ok')}
        >
          정상
        </FilterChip>
        <FilterChip
          type="button"
          $active={filter === 'warning'}
          onClick={() => onChangeFilter('warning')}
        >
          주의
        </FilterChip>
        <FilterChip
          type="button"
          $active={filter === 'error'}
          onClick={() => onChangeFilter('error')}
        >
          위험
        </FilterChip>
      </FilterRow>

      <TimelineWrap>
        {logs.length === 0 ? (
          <EmptyState>
            현재 선택한 시간대와 필터 조건에 맞는 점검 이력이 없습니다.
            <br />
            시간대를 바꾸거나 자동 시뮬레이션을 켜서 데이터를 생성해보세요.
          </EmptyState>
        ) : (
          <TimelineList>
            {logs.map((log) => {
              const isFocused =
                log.lineId === selectedLineId &&
                log.checkpointId === selectedCheckpointId;

              return (
                <TimelineItem key={log.id}>
                  <TimelineCardButton
                    type="button"
                    $focused={isFocused}
                    onClick={() => onFocusLog(log.lineId, log.checkpointId)}
                  >
                    {/* ✨ 카드 상단: [배지 + 제목] 과 [시간] 을 양끝으로 배치 */}
                    <TimelineCardTop>
                      <TitleGroup>
                        <TimelineBadge $level={log.level}>
                          {getLogLevelLabel(log.level)}
                        </TimelineBadge>
                        <TimelineTitle>{log.title}</TimelineTitle>
                      </TitleGroup>
                      <TimelineTime>{log.time}</TimelineTime>
                    </TimelineCardTop>

                    <TimelineDetail>{log.detail}</TimelineDetail>

                    <TimelineMeta>
                      {log.lineName} · {log.checkpointLabel} · {log.inspector}
                    </TimelineMeta>
                  </TimelineCardButton>
                </TimelineItem>
              );
            })}
          </TimelineList>
        )}
      </TimelineWrap>
    </>
  );
};

export default InspectionHistoryPanel;