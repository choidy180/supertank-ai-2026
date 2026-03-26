import type { FC } from 'react';

import { countStatus } from '../model/helpers';
import type { ProductionLine } from '../model/types';
import {
  PanelCaption,
  PanelTitle,
  PanelTitleGroup
} from '../shared/styles';
import {
  LineHeaderActions,
  LineHeaderRow,
  LineLabelButton,
  LineName,
  LineRow,
  LinesArea,
  LineShift,
  LineSummary,
  MiniPill,
  NodeButton,
  NodeLabel,
  NodeRail,
  NodeSlot,
  NodeTrack,
  SummaryPill
} from './styles';

interface ProductionLinesPanelProps {
  lines: ProductionLine[];
  selectedLineId: string;
  selectedCheckpointId: string;
  selectedTimeSlotLabel: string;
  onSelectLine: (lineId: string) => void;
  onSelectCheckpoint: (lineId: string, checkpointId: string) => void;
}

const ProductionLinesPanel: FC<ProductionLinesPanelProps> = ({
  lines,
  selectedLineId,
  selectedCheckpointId,
  selectedTimeSlotLabel,
  onSelectLine,
  onSelectCheckpoint
}) => {
  const selectedLine = lines.find((line) => line.id === selectedLineId) ?? lines[0];

  return (
    <>
      <LineHeaderRow>
        <PanelTitleGroup>
          <PanelTitle>생산 라인 현황</PanelTitle>
          <PanelCaption>
            라인 또는 스텝을 클릭해서 상세 상태를 확인하고, 하단 액션 버튼으로 상태를 직접 변경할 수 있습니다.
          </PanelCaption>
        </PanelTitleGroup>

        <LineHeaderActions>
          <MiniPill $tone="neutral">선택 시간대 · {selectedTimeSlotLabel}</MiniPill>
          <MiniPill $tone="neutral">선택 라인 · {selectedLine?.name}</MiniPill>
        </LineHeaderActions>
      </LineHeaderRow>

      <LinesArea>
        {lines.map((line) => (
          <LineRow
            key={line.id}
            $selected={line.id === selectedLine?.id}
          >
            <LineLabelButton
              type="button"
              onClick={() => onSelectLine(line.id)}
            >
              <LineName>{line.name}</LineName>
              <LineShift>{line.shift}</LineShift>
            </LineLabelButton>

            <NodeRail>
              <NodeTrack />

              {line.checkpoints.map((checkpoint) => {
                const isSelected = checkpoint.id === selectedCheckpointId;

                return (
                  <NodeSlot key={checkpoint.id}>
                    <NodeButton
                      type="button"
                      $status={checkpoint.status}
                      $selected={isSelected}
                      onClick={() => onSelectCheckpoint(line.id, checkpoint.id)}
                    >
                      {checkpoint.code}
                    </NodeButton>

                    <NodeLabel $selected={isSelected}>{checkpoint.label}</NodeLabel>
                  </NodeSlot>
                );
              })}
            </NodeRail>

            <LineSummary>
              <SummaryPill $tone="ok">
                정상 {countStatus(line.checkpoints, 'ok')}
              </SummaryPill>
              <SummaryPill $tone="warning">
                주의 {countStatus(line.checkpoints, 'warning')}
              </SummaryPill>
              <SummaryPill $tone="error">
                중단 {countStatus(line.checkpoints, 'error')}
              </SummaryPill>
            </LineSummary>
          </LineRow>
        ))}
      </LinesArea>
    </>
  );
};

export default ProductionLinesPanel;
