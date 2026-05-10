'use client';

import type { ChangeEvent, ComponentProps } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import HeaderSection from '@/components/realtime-defect-status/HeaderSection';
import { useDateFilterStore } from '@/store/useDateFilterStore';
import { useThemeStore } from '@/store/useThemeStore';

import Global from '@/components/action-history/ActionHistoryGlobalStyle';
import ActionHistoryHero from '@/components/action-history/ActionHistoryHero';
import ActionHistoryToolbar from '@/components/action-history/ActionHistoryToolbar';
import DetailModal from '@/components/action-history/DetailModal';
import HistoryListPanel from '@/components/action-history/HistoryListPanel';
import NetworkErrorModal from '@/components/action-history/NetworkErrorModal';
import SummaryPanels from '@/components/action-history/SummaryPanels';
import VideoModal from '@/components/action-history/VideoModal';
import { useActionHistoryLogs } from '@/hooks/action-history/useActionHistoryLogs';
import {
  ACTION_CONTEXT_META,
  DATE_SUMMARY_HEADERS,
  DURATION_SUMMARY_HEADERS,
} from '@/model/action-history/constants';
import {
  buildReportHtml,
  createActionHistoryItemFromLog,
  createCsv,
  createDateSummaryRows,
  createDurationSummaryRows,
  downloadTextFile,
  formatAverageMinutes,
  formatDuration,
  getAverage,
  getContextFromSearchParams,
  isWithinRange,
  sanitizeFilename,
} from '@/model/action-history/helpers';
import type { ActionHistoryContext, ActionHistoryItem } from '@/model/action-history/types';
import { ContentFrame, LeftPanel, MainGrid, PageShell, RightSummaryPanel } from '@/styles/action-history/styles';

export default function ActionHistoryPage() {
  const searchParams = useSearchParams();
  const isDark = useThemeStore((state) => state.isDark);

  const startDate = useDateFilterStore((state) => state.startDate);
  const endDate = useDateFilterStore((state) => state.endDate);
  const getDateRange = useDateFilterStore((state) => state.getDateRange);

  const context = useMemo<ActionHistoryContext>(() => {
    return getContextFromSearchParams(searchParams.get('context'));
  }, [searchParams]);

  const contextMeta = ACTION_CONTEXT_META[context];
  const dateRange = useMemo(() => getDateRange(), [endDate, getDateRange, startDate]);

  const [now, setNow] = useState(() => new Date());
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<ActionHistoryItem | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    allLogs,
    isInitialLoading,
    networkError,
    handleCloseNetworkModal,
    handleRefresh,
    handleRetryNetwork,
  } = useActionHistoryLogs();

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    const shouldLock = Boolean(selectedItem) || isVideoModalOpen || Boolean(networkError);

    if (!shouldLock) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVideoModalOpen, networkError, selectedItem]);

  const closeVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsVideoModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeVideoModal();
        setSelectedItem(null);
        handleCloseNetworkModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCloseNetworkModal]);

  const actionItems = useMemo(() => {
    return allLogs
      .map((log) => createActionHistoryItemFromLog(log, context))
      .filter((item) => isWithinRange(item.occurredAt, dateRange))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [allLogs, context, dateRange]);

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return actionItems;
    }

    return actionItems.filter((item) => {
      const searchableText = [
        item.id,
        item.sourceLog.title,
        item.facilityName,
        item.alarmName,
        item.phenomenon,
        item.actionContent,
        item.status,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [actionItems, keyword]);

  const dateSummaryRows = useMemo(() => createDateSummaryRows(filteredItems), [filteredItems]);
  const durationSummaryRows = useMemo(
    () => createDurationSummaryRows(filteredItems),
    [filteredItems],
  );

  const completedCount = filteredItems.filter((item) => item.status === '완료').length;
  const occurredCount = filteredItems.filter((item) => item.status === '발생').length;
  const videoReadyCount = filteredItems.filter((item) => item.videoReady).length;
  const averageDurationMinutes = getAverage(
    filteredItems
      .map((item) => item.durationMinutes)
      .filter((value): value is number => value !== null),
  );

  const summaryCards = useMemo(
    () => [
      {
        id: 'total-action-history',
        label: '전체 조치 이력',
        title: '전체 조치 이력',
        value: `${filteredItems.length}건`,
        unit: '건',
        description: `${dateRange.startDate} ~ ${dateRange.endDate}`,
        caption: `${dateRange.startDate} ~ ${dateRange.endDate}`,
      },
      {
        id: 'completed-action-history',
        label: '완료',
        title: '완료',
        value: `${completedCount}건`,
        unit: '건',
        description: '상태가 완료인 조치',
        caption: '상태가 완료인 조치',
      },
      {
        id: 'occurred-action-history',
        label: '발생',
        title: '발생',
        value: `${occurredCount}건`,
        unit: '건',
        description: '아직 완료 처리되지 않은 항목',
        caption: '아직 완료 처리되지 않은 항목',
      },
      {
        id: 'average-action-time',
        label: '평균 조치시간',
        title: '평균 조치시간',
        value: formatDuration(averageDurationMinutes),
        unit: '',
        description: `영상 준비 ${videoReadyCount}건`,
        caption: `영상 준비 ${videoReadyCount}건`,
      },
    ],
    [
      averageDurationMinutes,
      completedCount,
      dateRange.endDate,
      dateRange.startDate,
      filteredItems.length,
      occurredCount,
      videoReadyCount,
    ],
  );

  const headerSummaryCards =
    summaryCards as unknown as ComponentProps<typeof HeaderSection>['summaryCards'];

  const handleKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleDownloadDateSummary = () => {
    const csv = createCsv(
      DATE_SUMMARY_HEADERS,
      dateSummaryRows.map((row) => [
        row.date,
        row.total,
        row.occurred,
        row.completed,
        row.na,
        formatAverageMinutes(row.averageMinutes),
      ]),
    );

    downloadTextFile(
      `${contextMeta.filePrefix}_date_summary_${dateRange.startDate}_${dateRange.endDate}.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
  };

  const handleDownloadDurationSummary = () => {
    const csv = createCsv(
      DURATION_SUMMARY_HEADERS,
      durationSummaryRows.map((row) => [
        row.label,
        row.total,
        row.occurred,
        row.completed,
        row.na,
      ]),
    );

    downloadTextFile(
      `${contextMeta.filePrefix}_duration_summary_${dateRange.startDate}_${dateRange.endDate}.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
  };

  const handleDownloadReportPdf = (item: ActionHistoryItem) => {
    const reportWindow = window.open('', '_blank', 'width=960,height=720');

    if (!reportWindow) {
      alert('팝업이 차단되어 PDF 보고서를 열 수 없습니다. 브라우저 팝업 허용 후 다시 시도해주세요.');
      return;
    }

    const generatedAt = new Date();
    const html = buildReportHtml(item, contextMeta, generatedAt);
    const filename = sanitizeFilename(
      `${contextMeta.filePrefix}_${item.id}_${dateRange.startDate}_${dateRange.endDate}.pdf`,
    );

    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();

    reportWindow.setTimeout(() => {
      reportWindow.document.title = filename;
      reportWindow.print();
    }, 260);
  };

  const openVideoModal = (item: ActionHistoryItem) => {
    if (!item.videoReady) {
      return;
    }

    setCurrentVideoTitle(item.videoTitle);
    setCurrentVideoSrc(item.videoSrc);
    setIsVideoModalOpen(true);

    window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 150);
  };

  return (
    <>
      <Global />

      <PageShell>
        <HeaderSection summaryCards={headerSummaryCards} now={now} isDark={isDark} />

        <ContentFrame>
          <ActionHistoryHero context={context} meta={contextMeta} />

          <ActionHistoryToolbar
            keyword={keyword}
            placeholder={contextMeta.searchPlaceholder}
            isLoading={isInitialLoading}
            onKeywordChange={handleKeywordChange}
            onDownloadDateSummary={handleDownloadDateSummary}
            onDownloadDurationSummary={handleDownloadDurationSummary}
            onRefresh={handleRefresh}
          />

          <MainGrid>
            <LeftPanel>
              <HistoryListPanel
                meta={contextMeta}
                items={filteredItems}
                isInitialLoading={isInitialLoading}
                hasLoadedLogs={allLogs.length > 0}
                onSelectItem={setSelectedItem}
                onOpenVideo={openVideoModal}
                onDownloadReport={handleDownloadReportPdf}
              />
            </LeftPanel>

            <RightSummaryPanel>
              <SummaryPanels
                dateSummaryRows={dateSummaryRows}
                durationSummaryRows={durationSummaryRows}
                totalCount={filteredItems.length}
                onDownloadDateSummary={handleDownloadDateSummary}
                onDownloadDurationSummary={handleDownloadDurationSummary}
              />
            </RightSummaryPanel>
          </MainGrid>
        </ContentFrame>
      </PageShell>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          meta={contextMeta}
          onClose={() => setSelectedItem(null)}
          onDownloadReport={handleDownloadReportPdf}
        />
      )}

      {isVideoModalOpen && (
        <VideoModal
          title={currentVideoTitle}
          src={currentVideoSrc}
          videoRef={videoRef}
          onClose={closeVideoModal}
        />
      )}

      {networkError && (
        <NetworkErrorModal
          networkError={networkError}
          onClose={handleCloseNetworkModal}
          onRetry={handleRetryNetwork}
        />
      )}
    </>
  );
}
