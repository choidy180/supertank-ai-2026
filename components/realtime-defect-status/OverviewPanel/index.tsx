'use client';

import styled from 'styled-components';
import DefectTypePanel from '../DefectTypePanel';
import RepairTimePanel from '../RepairTimePanel';
import SummaryCards from '../SummaryCards';
import type { DefectTypeStat, RepairTimeStat, SummaryCard } from '../model/types';

interface OverviewPanelProps {
  summaryCards: SummaryCard[];
  defectTypeStats: DefectTypeStat[];
  repairTimeStats: RepairTimeStat[];
  totalDefectValue: number;
  maxRepairHour: number;
  largestDefectLabel: string;
}

const OverviewPanel = ({
  summaryCards,
  defectTypeStats,
  repairTimeStats,
  totalDefectValue,
  maxRepairHour,
  largestDefectLabel
}: OverviewPanelProps) => {
  return (
    <Panel>
      <PanelHeader>
        <MetaPill>실시간 운영 보드</MetaPill>
      </PanelHeader>

      <SummaryCards items={summaryCards} />

      <ChartGrid>
        <DefectTypePanel items={defectTypeStats} total={totalDefectValue} topLabel={largestDefectLabel} />
        <RepairTimePanel items={repairTimeStats} maxValue={maxRepairHour} />
      </ChartGrid>
    </Panel>
  );
};

const Panel = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 18px;
  padding: 24px;
  border-radius: 30px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, rgba(7, 16, 34, 0.96) 0%, rgba(4, 10, 22, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 28px 72px rgba(0, 0, 0, 0.34);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const PanelCaption = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(79, 143, 255, 0.22);
  background: rgba(79, 143, 255, 0.1);
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
`;

const ChartGrid = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(360px, 0.92fr) minmax(0, 1.08fr);
  gap: 18px;
  overflow: hidden;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow: auto;
  }
`;

export default OverviewPanel;
