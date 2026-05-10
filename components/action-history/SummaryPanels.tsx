import type { ReactNode } from 'react';
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
  SummaryEmptyBadge,
  SummaryEmptyContent,
  SummaryEmptyDescription,
  SummaryEmptyEyebrow,
  SummaryEmptyIconFrame,
  SummaryEmptyState,
  SummaryEmptyTitle,
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

const SummaryEmpty = ({
  icon,
  eyebrow,
  title,
  description,
  badgeLabel,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  badgeLabel: string;
}) => {
  return (
    <SummaryEmptyState role="status" aria-live="polite">
      <SummaryEmptyIconFrame aria-hidden="true">{icon}</SummaryEmptyIconFrame>

      <SummaryEmptyContent>
        <SummaryEmptyEyebrow>{eyebrow}</SummaryEmptyEyebrow>
        <SummaryEmptyTitle>{title}</SummaryEmptyTitle>
        <SummaryEmptyDescription>{description}</SummaryEmptyDescription>
      </SummaryEmptyContent>

      <SummaryEmptyBadge>{badgeLabel}</SummaryEmptyBadge>
    </SummaryEmptyState>
  );
};

const SummaryPanels = ({
  dateSummaryRows,
  durationSummaryRows,
  totalCount,
  onDownloadDateSummary,
  onDownloadDurationSummary,
}: SummaryPanelsProps) => {
  const hasDateSummaryData = dateSummaryRows.some((row) => row.total > 0);
  const hasDurationSummaryData = durationSummaryRows.some((row) => row.total > 0);

  const handleDownloadDateSummary = () => {
    if (!hasDateSummaryData) {
      return;
    }

    onDownloadDateSummary();
  };

  const handleDownloadDurationSummary = () => {
    if (!hasDurationSummaryData) {
      return;
    }

    onDownloadDurationSummary();
  };

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

          <MiniDownloadButton
            type="button"
            disabled={!hasDateSummaryData}
            aria-disabled={!hasDateSummaryData}
            onClick={handleDownloadDateSummary}
          >
            다운로드
          </MiniDownloadButton>
        </SummaryPanelHeader>

        {hasDateSummaryData ? (
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
                {dateSummaryRows.map((row) => (
                  <tr key={row.date}>
                    <td>{formatDateLabel(row.date)}</td>
                    <td>{row.total}</td>
                    <td>{row.occurred}</td>
                    <td>{row.completed}</td>
                    <td>{row.na}</td>
                    <td>{formatDuration(row.averageMinutes)}</td>
                  </tr>
                ))}
              </tbody>
            </SummaryTable>
          </SummaryTableWrapper>
        ) : (
          <SummaryEmpty
            icon={<FaRegClock size={18} />}
            eyebrow="No Summary"
            title="표시할 Summary가 없습니다."
            description="현재 조회 조건에 집계할 일자별 조치 이력이 없습니다. 기간을 넓히거나 검색어를 조정하면 Summary가 자동으로 생성됩니다."
            badgeLabel="데이터 수신 대기"
          />
        )}
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

          <MiniDownloadButton
            type="button"
            disabled={!hasDurationSummaryData}
            aria-disabled={!hasDurationSummaryData}
            onClick={handleDownloadDurationSummary}
          >
            다운로드
          </MiniDownloadButton>
        </SummaryPanelHeader>

        {hasDurationSummaryData ? (
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
                  <BucketFill
                    $percent={
                      totalCount > 0 ? Math.round((row.total / totalCount) * 100) : 0
                    }
                  />
                </BucketTrack>
              </DurationBucket>
            ))}
          </DurationBucketList>
        ) : (
          <SummaryEmpty
            icon={<FaCheckCircle size={18} />}
            eyebrow="No Distribution"
            title="조치시간 분포가 없습니다."
            description="완료 또는 발생 이력이 쌓이면 처리 소요시간 구간별 분포가 이 영역에 정리됩니다."
            badgeLabel="분포 데이터 대기"
          />
        )}
      </SummaryPanel>
    </>
  );
};

export default SummaryPanels;
