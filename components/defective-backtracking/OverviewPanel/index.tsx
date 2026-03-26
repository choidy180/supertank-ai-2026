"use client"; // 이 줄이 파일 맨 위에 없다면 꼭 추가해 주세요.

import { useState, useEffect } from 'react'; // ✨ useEffect, useState 추가
import DefectTypePanel from '../DefectTypePanel';
import RepairTimePanel from '../RepairTimePanel';
import SummaryCards from '../SummaryCards';
import type { DefectTypeStat, RepairTimeStat, SummaryCardData } from '../model/types';
import { formatClock } from '../model/helpers';
import {
  Caption,
  HeaderRow,
  LiveDot,
  MetaGroup,
  MetaPill,
  OverviewRoot,
  SectionStack,
  Title,
  TitleGroup
} from './styles';

interface OverviewPanelProps {
  summaryCards: SummaryCardData[];
  defectTypeStats: DefectTypeStat[];
  repairTimeStats: RepairTimeStat[];
  totalDefectValue: number;
  maxRepairHour: number;
  now: Date;
}

const OverviewPanel = ({
  summaryCards,
  defectTypeStats,
  repairTimeStats,
  totalDefectValue,
  maxRepairHour,
  now
}: OverviewPanelProps) => {
  // ✨ 하이드레이션 에러 방지를 위한 마운트 상태 추가
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // 브라우저 렌더링이 시작되면 true로 변경
  }, []);

  return (
    <OverviewRoot>
      <HeaderRow>
        <TitleGroup>
          <Title>실시간 불량 현황</Title>
        </TitleGroup>

        <MetaGroup>
          <MetaPill $tone="navy">
            <LiveDot /> 실시간 동기화 
            {/* ✨ 마운트되기 전에는 빈 공간을 보여주고, 마운트 된 후에만 시간을 출력 */}
            {mounted ? ` ${formatClock(now)}` : ' --:--:--'}
          </MetaPill>
          <MetaPill>불량 집계 {totalDefectValue}%</MetaPill>
        </MetaGroup>
      </HeaderRow>

      <SectionStack>
        <SummaryCards items={summaryCards} />
        <DefectTypePanel items={defectTypeStats} totalValue={totalDefectValue} />
        <RepairTimePanel items={repairTimeStats} maxHour={maxRepairHour} />
      </SectionStack>
    </OverviewRoot>
  );
};

export default OverviewPanel;