'use client';

import { useMemo } from 'react';

import { useThemeStore } from '@/store/useThemeStore';
import { createCsvContent, getCompletionRate, getRowsWithGroupMeta } from '@/model/drum-tub-report-clean-refactor/helpers';
import { activityLogs, approvalSteps, reportMeta, reportRows, sectionAnchors, summaryCards } from '@/model/drum-tub-report-clean-refactor/data';
import { MainGrid, PageShell, ThemeScope } from '@/styles/drum-tub-report-clean-refactor/styles';
import ReportTopBar from '@/components/drum-tub-report-clean-refactor/ReportTopBar';
import ReportSummaryStrip from '@/components/drum-tub-report-clean-refactor/ReportSummaryStrip';
import ReportLeftRail from '@/components/drum-tub-report-clean-refactor/ReportLeftRail';
import ReportDocument from '@/components/drum-tub-report-clean-refactor/ReportDocument';
import ReportRightRail from '@/components/drum-tub-report-clean-refactor/ReportRightRail';





const DrumTubInspectionReportPage = () => {
  const isDark = useThemeStore((state) => state.isDark);

  const rowsWithMeta = useMemo(() => getRowsWithGroupMeta(reportRows), []);
  const completionRate = useMemo(() => getCompletionRate(reportRows), []);

  const handlePrint = () => {
    window.print();
  };

  const handleCsvDownload = () => {
    const csv = createCsvContent(reportRows);
    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `drum-tub-inspection-${reportMeta.date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeScope $isDark={isDark}>
      <PageShell>
        <ReportTopBar
          reportMeta={reportMeta}
          onPrint={handlePrint}
          onCsvDownload={handleCsvDownload}
        />

        <ReportSummaryStrip items={summaryCards} />

        <MainGrid>
          <ReportLeftRail
            reportMeta={reportMeta}
            completionRate={completionRate}
            sectionAnchors={sectionAnchors}
          />

          <ReportDocument
            reportMeta={reportMeta}
            approvalSteps={approvalSteps}
            rows={rowsWithMeta}
          />

          <ReportRightRail
            approvalSteps={approvalSteps}
            activityLogs={activityLogs}
            onPrint={handlePrint}
            onCsvDownload={handleCsvDownload}
          />
        </MainGrid>
      </PageShell>
    </ThemeScope>
  );
};

export default DrumTubInspectionReportPage;
