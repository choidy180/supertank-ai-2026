import type { FC } from 'react';

import { getStatusLabel } from '../model/helpers';
import type {
  ActiveCheckpointStatus,
  Checkpoint,
  ProductionLine
} from '../model/types';
import {
  ActionButtonGrid,
  ActionDescription,
  ActionPanel,
  ActionTitle,
  DetailCard,
  DetailEyebrow,
  DetailGrid,
  DetailHeader,
  DetailInfo,
  DetailMetric,
  DetailMetricLabel,
  DetailMetricValue,
  DetailNote,
  DetailTitle,
  DetailTitleGroup,
  StatusActionButton,
  StatusBadge
} from './styles';

interface CheckpointDetailCardProps {
  selectedLine: ProductionLine;
  selectedCheckpoint: Checkpoint;
  selectedTimeSlotLabel: string;
  onManualUpdate: (
    lineId: string,
    checkpointId: string,
    status: ActiveCheckpointStatus
  ) => void;
}

const CheckpointDetailCard: FC<CheckpointDetailCardProps> = ({
  selectedLine,
  selectedCheckpoint,
  selectedTimeSlotLabel,
  onManualUpdate
}) => {
  return (
    <DetailCard>
      <DetailInfo>
        <DetailHeader>
          <DetailTitleGroup>
            <DetailEyebrow>selected checkpoint</DetailEyebrow>
            <DetailTitle>
              {selectedLine.name} · {selectedCheckpoint.label}
            </DetailTitle>
          </DetailTitleGroup>

          <StatusBadge $status={selectedCheckpoint.status}>
            {getStatusLabel(selectedCheckpoint.status)}
          </StatusBadge>
        </DetailHeader>

        <DetailGrid>
          <DetailMetric>
            <DetailMetricLabel>담당자</DetailMetricLabel>
            <DetailMetricValue>{selectedCheckpoint.inspector}</DetailMetricValue>
          </DetailMetric>

          <DetailMetric>
            <DetailMetricLabel>마지막 점검</DetailMetricLabel>
            <DetailMetricValue>{selectedCheckpoint.lastChecked}</DetailMetricValue>
          </DetailMetric>

          <DetailMetric>
            <DetailMetricLabel>선택 시간대</DetailMetricLabel>
            <DetailMetricValue>{selectedTimeSlotLabel}</DetailMetricValue>
          </DetailMetric>
        </DetailGrid>

        <DetailNote>{selectedCheckpoint.note}</DetailNote>
      </DetailInfo>

      <ActionPanel>
        <div>
          <ActionTitle>상태 즉시 변경</ActionTitle>
          <ActionDescription>
            현장 운영자가 선택한 스텝 상태를 직접 수정하면, 우측 점검 이력에도 즉시 반영됩니다.
          </ActionDescription>
        </div>

        <ActionButtonGrid>
          <StatusActionButton
            type="button"
            $tone="ok"
            onClick={() =>
              onManualUpdate(
                selectedLine.id,
                selectedCheckpoint.id,
                'ok'
              )
            }
          >
            정상 처리
          </StatusActionButton>

          <StatusActionButton
            type="button"
            $tone="warning"
            onClick={() =>
              onManualUpdate(
                selectedLine.id,
                selectedCheckpoint.id,
                'warning'
              )
            }
          >
            주의 전환
          </StatusActionButton>

          <StatusActionButton
            type="button"
            $tone="error"
            onClick={() =>
              onManualUpdate(
                selectedLine.id,
                selectedCheckpoint.id,
                'error'
              )
            }
          >
            중단 처리
          </StatusActionButton>
        </ActionButtonGrid>
      </ActionPanel>
    </DetailCard>
  );
};

export default CheckpointDetailCard;
