import { FaCheckCircle, FaRegClock } from 'react-icons/fa';

import { formatDateLabel, formatDuration } from '@/model/action-history/helpers';
import type { DateSummaryRow, DurationSummaryRow } from '@/model/action-history/types';
import {
  BucketFill,
  BucketMeta,
  BucketTop,
  BucketTrack,
  DurationBucket,
  DurationBucketList,
  MiniDownloadButton,
  SummaryCaption,
  SummaryIcon,
  SummaryPanel,
  SummaryPanelHeader,
  SummaryTable,
  SummaryTableWrapper,
  SummaryTitle,
  SummaryTitleGroup,
} from '@/styles/action-history/styles';

interface SummaryPanelsProps {
  dateSummaryRows: DateSummaryRow[];
  durationSummaryRows: DurationSummaryRow[];
  totalCount: number;
  onDownloadDateSummary: () => void;
  onDownloadDurationSummary: () => void;
}

const SummaryPanels = ({
  dateSummaryRows,
  durationSummaryRows,
  totalCount,
  onDownloadDateSummary,
  onDownloadDurationSummary,
}: SummaryPanelsProps) => {
  return (
    <>
      <SummaryPanel>
        <SummaryPanelHeader>
          <SummaryTitleGroup>
            <SummaryIcon>
              <FaRegClock size={15} />
            </SummaryIcon>
            <div>
              <SummaryTitle>날짜별 Summary</SummaryTitle>
              <SummaryCaption>선택 기간의 일자별 조치 현황</SummaryCaption>
            </div>
          </SummaryTitleGroup>

          <MiniDownloadButton type="button" onClick={onDownloadDateSummary}>
            다운로드
          </MiniDownloadButton>
        </SummaryPanelHeader>

        <SummaryTableWrapper>
          <SummaryTable>
            <thead>
              <tr>
                <th>날짜</th>
                <th>전체</th>
                <th>발생</th>
                <th>완료</th>
                <th>N/A</th>
                <th>평균</th>
              </tr>
            </thead>
            <tbody>
              {dateSummaryRows.length === 0 ? (
                <tr>
                  <td colSpan={6}>표시할 Summary가 없습니다.</td>
                </tr>
              ) : (
                dateSummaryRows.map((row) => (
                  <tr key={row.date}>
                    <td>{formatDateLabel(row.date)}</td>
                    <td>{row.total}</td>
                    <td>{row.occurred}</td>
                    <td>{row.completed}</td>
                    <td>{row.na}</td>
                    <td>{formatDuration(row.averageMinutes)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </SummaryTable>
        </SummaryTableWrapper>
      </SummaryPanel>

      <SummaryPanel>
        <SummaryPanelHeader>
          <SummaryTitleGroup>
            <SummaryIcon>
              <FaCheckCircle size={15} />
            </SummaryIcon>
            <div>
              <SummaryTitle>조치시간 Summary</SummaryTitle>
              <SummaryCaption>처리 소요시간 구간별 분포</SummaryCaption>
            </div>
          </SummaryTitleGroup>

          <MiniDownloadButton type="button" onClick={onDownloadDurationSummary}>
            다운로드
          </MiniDownloadButton>
        </SummaryPanelHeader>

        <DurationBucketList>
          {durationSummaryRows.map((row) => (
            <DurationBucket key={row.label}>
              <BucketTop>
                <strong>{row.label}</strong>
                <span>{row.total}건</span>
              </BucketTop>
              <BucketMeta>
                발생 {row.occurred} · 완료 {row.completed} · N/A {row.na}
              </BucketMeta>
              <BucketTrack>
                <BucketFill $percent={totalCount > 0 ? Math.round((row.total / totalCount) * 100) : 0} />
              </BucketTrack>
            </DurationBucket>
          ))}
        </DurationBucketList>
      </SummaryPanel>
    </>
  );
};

export default SummaryPanels;
