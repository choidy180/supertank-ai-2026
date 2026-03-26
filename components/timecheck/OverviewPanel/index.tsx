import type { FC } from 'react';

import { CIRCLE_RADIUS } from '../model/constants';
import {
  Panel,
  PanelCaption,
  PanelTitle,
  PanelTitleGroup,
  PanelTop
} from '../shared/styles';
import {
  QuickStatCard,
  QuickStatGrid,
  QuickStatLabel,
  QuickStatValue,
  RingCenter,
  RingInner,
  RingLabel,
  RingNumber,
  RingSvg,
  RingTrack,
  RingValue,
  RingValueText,
  RingWrap
} from './styles';

interface OverviewPanelProps {
  completionRate: number;
  selectedTimeSlotLabel: string;
  lineCount: number;
}

const OverviewPanel: FC<OverviewPanelProps> = ({
  completionRate,
  selectedTimeSlotLabel,
  lineCount
}) => {
  return (
    <Panel>
      <PanelTop>
        <PanelTitleGroup>
          <PanelTitle>순회 점검 완료율</PanelTitle>
          <PanelCaption>
            생산 라인 전체 공정 상태를 가중치 기반으로 반영한 완료 지표
          </PanelCaption>
        </PanelTitleGroup>
      </PanelTop>

      <RingWrap>
        <RingInner>
          <RingSvg viewBox="0 0 216 216">
            <RingTrack
              cx="108"
              cy="108"
              r={CIRCLE_RADIUS}
            />
            <RingValue
              cx="108"
              cy="108"
              r={CIRCLE_RADIUS}
              $percent={completionRate}
            />
          </RingSvg>

          <RingCenter>
            <RingValueText>
              <RingNumber>{completionRate}%</RingNumber>
              <RingLabel>현재 공정 상태 기준 완료율</RingLabel>
            </RingValueText>
          </RingCenter>
        </RingInner>
      </RingWrap>

      <QuickStatGrid>
        <QuickStatCard>
          <QuickStatLabel>선택 시간대</QuickStatLabel>
          <QuickStatValue>{selectedTimeSlotLabel}</QuickStatValue>
        </QuickStatCard>

        <QuickStatCard>
          <QuickStatLabel>활성 라인</QuickStatLabel>
          <QuickStatValue>{lineCount}개</QuickStatValue>
        </QuickStatCard>
      </QuickStatGrid>
    </Panel>
  );
};

export default OverviewPanel;
