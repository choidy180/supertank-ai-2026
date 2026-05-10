"use client";

import { createElement, useEffect, useMemo, useState } from "react";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { IoAlertCircle } from "react-icons/io5";
import { MdRefresh } from "react-icons/md";
import { Bar, Doughnut } from "react-chartjs-2";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";

import { useThemeStore } from "@/store/useThemeStore";

type ThemeMode = "light" | "dark";

type InsightThemeStyle = {
  colorScheme: ThemeMode;
  background: string;
  backgroundGlow: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  surfaceGlass: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  shadow: string;
  shadowHover: string;
  focus: string;
  chartGrid: string;
  chartPalette: string[];
  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const INSIGHT_THEME_STYLES: Record<ThemeMode, InsightThemeStyle> = {
  light: {
    colorScheme: "light",
    background: "#f7f8fa",
    backgroundGlow: "transparent",
    surface: "#ffffff",
    surfaceMuted: "#f8fafc",
    surfaceHover: "#f1f5f9",
    surfaceGlass: "#ffffff",
    border: "#e5e7eb",
    borderStrong: "#cbd5e1",
    textPrimary: "#111827",
    textSecondary: "#475569",
    textTertiary: "#94a3b8",
    accent: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.08)",
    onAccent: "#ffffff",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.08)",
    warning: "#f59e0b",
    warningSoft: "rgba(245, 158, 11, 0.10)",
    error: "#ef4444",
    errorSoft: "rgba(239, 68, 68, 0.08)",
    shadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
    shadowHover: "0 8px 24px rgba(15, 23, 42, 0.08)",
    focus: "rgba(37, 99, 235, 0.20)",
    chartGrid: "rgba(100, 116, 139, 0.16)",
    chartPalette: ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#64748b"],
    scrollbarThumb: "rgba(148, 163, 184, 0.42)",
    scrollbarThumbHover: "rgba(100, 116, 139, 0.54)",
  },
  dark: {
    colorScheme: "dark",
    background: "#141414",
    backgroundGlow: "transparent",
    surface: "#181818",
    surfaceMuted: "#1d1d1d",
    surfaceHover: "#222222",
    surfaceGlass: "#181818",
    border: "#2a2a2a",
    borderStrong: "#3a3a3a",
    textPrimary: "#f5f5f5",
    textSecondary: "#d4d4d4",
    textTertiary: "#8a8a8a",
    accent: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.16)",
    onAccent: "#ffffff",
    success: "#16a34a",
    successSoft: "rgba(22, 163, 74, 0.16)",
    warning: "#f59e0b",
    warningSoft: "rgba(245, 158, 11, 0.16)",
    error: "#ef4444",
    errorSoft: "rgba(239, 68, 68, 0.16)",
    shadow: "0 1px 2px rgba(0, 0, 0, 0.28)",
    shadowHover: "0 8px 24px rgba(0, 0, 0, 0.34)",
    focus: "rgba(37, 99, 235, 0.28)",
    chartGrid: "#2a2a2a",
    chartPalette: ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#737373"],
    scrollbarThumb: "#3a3a3a",
    scrollbarThumbHover: "#525252",
  },
};

const getInsightTheme = (isDark: boolean) =>
  isDark ? INSIGHT_THEME_STYLES.dark : INSIGHT_THEME_STYLES.light;

const createInsightThemeVars = (theme: InsightThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --color-background: ${theme.background};
  --color-background-glow: ${theme.backgroundGlow};

  --color-surface: ${theme.surface};
  --color-surface-muted: ${theme.surfaceMuted};
  --color-surface-hover: ${theme.surfaceHover};
  --color-surface-glass: ${theme.surfaceGlass};

  --color-border: ${theme.border};
  --color-border-strong: ${theme.borderStrong};

  --color-text-primary: ${theme.textPrimary};
  --color-text-secondary: ${theme.textSecondary};
  --color-text-tertiary: ${theme.textTertiary};

  --color-accent: ${theme.accent};
  --color-accent-soft: ${theme.accentSoft};
  --color-on-accent: ${theme.onAccent};

  --color-success: ${theme.success};
  --color-success-soft: ${theme.successSoft};

  --color-warning: ${theme.warning};
  --color-warning-soft: ${theme.warningSoft};

  --color-error: ${theme.error};
  --color-error-soft: ${theme.errorSoft};

  --color-shadow: ${theme.shadow};
  --color-shadow-hover: ${theme.shadowHover};
  --color-focus: ${theme.focus};

  --chart-grid: ${theme.chartGrid};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};

  --primary-400: ${theme.accent};
  --secondary-900: ${theme.surfaceMuted};
`;

const GlobalStylesBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createInsightThemeVars(getInsightTheme($isDark))}
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }

  html,
  body {
    min-height: 100%;
    margin: 0;
    padding: 0;
    background: var(--color-background);
    color: var(--color-text-primary);
    font-family:
      'Pretendard Variable',
      'Pretendard',
      -apple-system,
      BlinkMacSystemFont,
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow-x: hidden;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  canvas {
    max-width: 100%;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    border: 2px solid transparent;
    background: var(--scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  ::selection {
    background: var(--color-accent-soft);
    color: var(--color-text-primary);
  }
`;

function GlobalStyles() {
  const isDark = useThemeStore((state) => state.isDark);

  return createElement(GlobalStylesBase, {
    $isDark: isDark,
  });
}

const legendGapPlugin = {
  id: "legendGap",
  beforeInit(chart: any, _args: any, opts: { gap?: number } = {}) {
    const fit = chart.legend && chart.legend.fit;

    if (!fit) {
      return;
    }

    chart.legend.fit = function fitWithGap() {
      fit.bind(chart.legend)();
      chart.legend.height += opts.gap ?? 16;
    };
  },
};

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels,
  legendGapPlugin,
);

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const getDatasetTotal = (chartData: any) => {
  const data = chartData?.datasets?.[0]?.data;

  if (!Array.isArray(data)) {
    return 0;
  }

  return data.reduce(
    (sum: number, value: number) => sum + Number(value || 0),
    0,
  );
};

const getDatasetMax = (chartData: any) => {
  const data = chartData?.datasets?.[0]?.data;

  if (!Array.isArray(data) || data.length === 0) {
    return 0;
  }

  return Math.max(...data.map((value: number) => Number(value || 0)));
};

export default function InsightPage() {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = useMemo(() => getInsightTheme(isDark), [isDark]);

  const [processes, setProcesses] = useState<any>(null);
  const [facilities, setFacilities] = useState<any>(null);
  const [processesTrend, setProcessesTrend] = useState<any>(null);
  const [facilitiesTrend, setFacilitiesTrend] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "66%",
      layout: {
        padding: {
          top: 4,
          right: 4,
          bottom: 4,
          left: 4,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "right" as const,
          align: "center" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            color: theme.textSecondary,
            font: {
              size: 13,
              weight: 700,
            },
            padding: 14,
            boxWidth: 9,
            boxHeight: 9,
          },
        },
        legendGap: {
          gap: 18,
        },
        datalabels: {
          color: "#ffffff",
          font: {
            weight: 700,
            size: 13,
          },
          padding: 8,
          anchor: "center",
          align: "center",
          formatter: (value: number, ctx: any) => {
            const arr: number[] = ctx.chart.data.datasets[0].data;
            const sum = arr.reduce((a: number, b: number) => a + b, 0);

            return sum > 0 ? `${Math.round((value * 100) / sum)}%` : "0%";
          },
        },
        tooltip: {
          backgroundColor: theme.surface,
          titleColor: theme.textPrimary,
          bodyColor: theme.textPrimary,
          borderColor: theme.border,
          borderWidth: 1,
          titleFont: {
            size: 13,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          padding: 12,
          cornerRadius: 14,
          boxPadding: 6,
        },
      },
    }),
    [theme],
  );

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top" as const,
          align: "end" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            color: theme.textSecondary,
            font: {
              size: 13,
              weight: 700,
            },
            padding: 12,
            boxWidth: 9,
            boxHeight: 9,
          },
        },
        datalabels: {
          display: false,
        },
        tooltip: {
          backgroundColor: theme.surface,
          titleColor: theme.textPrimary,
          bodyColor: theme.textPrimary,
          borderColor: theme.border,
          borderWidth: 1,
          titleFont: {
            size: 13,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          padding: 12,
          cornerRadius: 14,
          boxPadding: 6,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: theme.chartGrid,
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: theme.textTertiary,
            font: {
              size: 12,
              weight: 700,
            },
            padding: 8,
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: theme.textTertiary,
            font: {
              size: 12,
              weight: 700,
            },
            padding: 8,
          },
        },
      },
    }),
    [theme],
  );

  const fetchAll = async () => {
    setIsFetching(true);

    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          console.error(`[API 상태 에러] ${res.status}: ${url}`);
          return { success: false };
        }

        return await res.json();
      } catch (err) {
        console.error("[API 연결 실패]", url, err);
        return { success: false };
      }
    };

    try {
      const [j1, j2, j3, j4] = await Promise.all([
        safeFetch(
          "http://192.168.10.174:5654/db/tql/get_alarm_count_equip.tql?from=2025-10-27T00:00:00&to=2025-11-24T23:59:59&limit=5",
        ),
        safeFetch(
          "http://192.168.10.174:5654/db/tql/get_alarm_count.tql?from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&limit=5",
        ),
        safeFetch(
          "http://192.168.10.174:5654/db/tql/get_alarm_trend_equip.tql?eqpid=EQS1A0016&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60",
        ),
        safeFetch(
          "http://192.168.10.174:5654/db/tql/get_alarm_trend.tql?eqpid=EQS1A0016&tagname=M606&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60",
        ),
      ]);

      setProcesses(j1);
      setFacilities(j2);
      setProcessesTrend(j3);
      setFacilitiesTrend(j4);
    } finally {
      setIsFetching(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doughnutDataProcess = useMemo(() => {
    if (processes?.success === true && processes.data.rows?.length > 0) {
      const labels = processes.data.rows.map((r: any) => r[0]);
      const values = processes.data.rows.map((r: any) => r[r.length - 1]);

      return {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: theme.chartPalette,
            borderColor: theme.surface,
            borderWidth: 3,
            hoverBorderWidth: 3,
          },
        ],
      };
    }

    return {
      labels: ["A 설비", "B 설비", "C 설비", "D 설비", "E 설비"],
      datasets: [
        {
          data: [23, 29, 12, 21, 15],
          backgroundColor: theme.chartPalette,
          borderColor: theme.surface,
          borderWidth: 3,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [processes, theme.chartPalette, theme.surface]);

  const doughnutDataAlarm = useMemo(() => {
    if (facilities?.success === true && facilities.data.rows?.length > 0) {
      const labels = facilities.data.rows.map((r: any) => r[0]);
      const values = facilities.data.rows.map((r: any) => r[r.length - 1]);

      return {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: theme.chartPalette,
            borderColor: theme.surface,
            borderWidth: 3,
            hoverBorderWidth: 3,
          },
        ],
      };
    }

    return {
      labels: ["로터볼트", "스테이터볼트", "사이드볼트", "기타", "알 수 없음"],
      datasets: [
        {
          data: [40, 30, 20, 5, 5],
          backgroundColor: theme.chartPalette,
          borderColor: theme.surface,
          borderWidth: 3,
          hoverBorderWidth: 3,
        },
      ],
    };
  }, [facilities, theme.chartPalette, theme.surface]);

  const barDataProcess = useMemo(() => {
    if (
      processesTrend?.success === true &&
      processesTrend.data.rows?.length > 0
    ) {
      const labels = processesTrend.data.rows.map(([datetime]: any) =>
        datetime.split(" ")[1].slice(0, 5),
      );
      const values = processesTrend.data.rows.map(([_, val]: any) => val);

      return {
        labels,
        datasets: [
          {
            label: "SideBolt 체결 누락",
            data: values,
            backgroundColor: theme.accent,
            borderRadius: 999,
            borderSkipped: false,
            maxBarThickness: 36,
          },
        ],
      };
    }

    return {
      labels: ["월", "화", "수", "목", "금", "토", "일"],
      datasets: [
        {
          label: "공정불량 발생 건수",
          data: [15, 22, 13, 24, 35, 18, 12],
          backgroundColor: theme.accent,
          borderRadius: 999,
          borderSkipped: false,
          maxBarThickness: 34,
        },
      ],
    };
  }, [processesTrend, theme.accent]);

  const barDataAlarmTrend = useMemo(() => {
    if (
      facilitiesTrend?.success === true &&
      facilitiesTrend.data.rows?.length > 0
    ) {
      const rows = facilitiesTrend.data.rows;
      const labels = rows.map((r: any) => r[0].split(" ")[1].slice(0, 5));
      const values = rows.map((r: any) => r[1]);

      return {
        labels,
        datasets: [
          {
            label: "설비알람 발생 건수",
            data: values,
            backgroundColor: theme.success,
            borderRadius: 999,
            borderSkipped: false,
            maxBarThickness: 36,
          },
        ],
      };
    }

    return {
      labels: ["09:00", "11:00", "13:00", "15:00", "17:00"],
      datasets: [
        {
          label: "설비알람 Trend",
          data: [5, 12, 8, 14, 9],
          backgroundColor: theme.success,
          borderRadius: 999,
          borderSkipped: false,
          maxBarThickness: 40,
        },
      ],
    };
  }, [facilitiesTrend, theme.success]);

  const summaryCards = useMemo(
    () => [
      {
        label: "공정불량 합계",
        value: getDatasetTotal(doughnutDataProcess).toLocaleString("ko-KR"),
        caption: "TOP 5 기준",
        tone: "accent" as const,
      },
      {
        label: "설비알람 합계",
        value: getDatasetTotal(doughnutDataAlarm).toLocaleString("ko-KR"),
        caption: "TOP 5 기준",
        tone: "success" as const,
      },
      {
        label: "공정불량 Peak",
        value: getDatasetMax(barDataProcess).toLocaleString("ko-KR"),
        caption: "Trend 최대값",
        tone: "warning" as const,
      },
      {
        label: "알람 Trend Peak",
        value: getDatasetMax(barDataAlarmTrend).toLocaleString("ko-KR"),
        caption: "Trend 최대값",
        tone: "error" as const,
      },
    ],
    [barDataAlarmTrend, barDataProcess, doughnutDataAlarm, doughnutDataProcess],
  );

  const validSourceCount = useMemo(() => {
    return [processes, facilities, processesTrend, facilitiesTrend].filter(
      (item) => item?.success === true,
    ).length;
  }, [facilities, facilitiesTrend, processes, processesTrend]);

  return (
    <>
      <GlobalStyles />

      <Page>
        <Main>
          <DashboardHeader>
            <HeaderCopy>
              <Eyebrow>Insight Dashboard</Eyebrow>
              <PageTitle>불량 · 알람 인사이트</PageTitle>
              <PageDescription>
                공정불량과 설비알람의 상위 항목과 추이를 한 화면에서 가볍게
                확인합니다.
              </PageDescription>
            </HeaderCopy>

            <HeaderActions>
              <StatusPill $isLoading={isFetching}>
                <StatusDot $isLoading={isFetching} />
                {hasFetched
                  ? `데이터 소스 ${validSourceCount}/4 정상`
                  : "데이터 불러오는 중"}
              </StatusPill>

              <RefreshButton
                type="button"
                aria-label="인사이트 데이터 새로고침"
                disabled={isFetching}
                onClick={() => void fetchAll()}
              >
                <MdRefresh />
                <span>{isFetching ? "동기화 중" : "새로고침"}</span>
              </RefreshButton>
            </HeaderActions>
          </DashboardHeader>

          <SummaryGrid>
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} $tone={card.tone}>
                <SummaryMeta>
                  <SummaryLabel>{card.label}</SummaryLabel>
                  <SummaryCaption>{card.caption}</SummaryCaption>
                </SummaryMeta>
                <SummaryValue>{card.value}</SummaryValue>
              </SummaryCard>
            ))}
          </SummaryGrid>

          <ChartGrid>
            <Panel>
              <PanelHeading>
                <PanelTitle>공정불량 TOP 5</PanelTitle>
                <PanelSubtitle>설비별 발생 비중</PanelSubtitle>
              </PanelHeading>

              <ChartBox>
                <Doughnut
                  data={doughnutDataProcess}
                  options={doughnutOptions as any}
                />
              </ChartBox>
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>공정불량 Trend</PanelTitle>
                <PanelSubtitle>기간 내 발생 추이</PanelSubtitle>
              </PanelHeading>

              <ChartBox>
                <Bar data={barDataProcess} options={barOptions as any} />
              </ChartBox>
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>설비알람 TOP 5</PanelTitle>
                <PanelSubtitle>알람 유형별 비중</PanelSubtitle>
              </PanelHeading>

              <ChartBox>
                <Doughnut
                  data={doughnutDataAlarm}
                  options={doughnutOptions as any}
                />
              </ChartBox>
            </Panel>

            <Panel>
              <PanelHeading>
                <PanelTitle>설비알람 Trend</PanelTitle>
                <PanelSubtitle>시간대별 알람 흐름</PanelSubtitle>
              </PanelHeading>

              <ChartBox>
                <Bar data={barDataAlarmTrend} options={barOptions as any} />
              </ChartBox>
            </Panel>
          </ChartGrid>
        </Main>

        {hasFetched && (
          <AlertStack>
            {!processes?.success && <AlertBox msg="공정불량 TOP5" />}
            {!facilities?.success && <AlertBox msg="설비알람 TOP5" />}
            {!processesTrend?.success && <AlertBox msg="공정불량 Trend" />}
            {!facilitiesTrend?.success && <AlertBox msg="설비알람 Trend" />}
          </AlertStack>
        )}
      </Page>
    </>
  );
}

function AlertBox({ msg }: { msg: string }) {
  return (
    <AlertToast role="alert">
      <IoAlertCircle />
      <span>
        현재 <b>{msg}</b> 데이터가 유효하지 않습니다.
      </span>
    </AlertToast>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Page = styled.div`
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-primary);
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: clamp(14px, 1.4vw, 22px);
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: clamp(18px, 2.2vw, 34px);

  @media (max-width: 900px) {
    overflow-y: auto;
    overscroll-behavior: contain;
  }
`;

const DashboardHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  min-width: 0;

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(30px, 2.8vw, 36px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.055em;
`;

const PageDescription = styled.p`
  max-width: 760px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: clamp(14px, 1.05vw, 16px);
  font-weight: 600;
  line-height: 1.2;
  word-break: keep-all;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  flex: 0 0 auto;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }
`;

const StatusPill = styled.div<{ $isLoading: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

const StatusDot = styled.span<{ $isLoading: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ $isLoading }) =>
    $isLoading ? "var(--color-warning)" : "var(--color-success)"};
  box-shadow: 0 0 0 4px
    ${({ $isLoading }) =>
      $isLoading ? "var(--color-warning-soft)" : "var(--color-success-soft)"};
`;

const RefreshButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 15px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;

  svg {
    width: 18px;
    height: 18px;
    color: var(--color-accent);
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: var(--color-border-strong);
    background: var(--color-surface);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.72;

    svg {
      animation: ${spin} 900ms linear infinite;
    }
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const SummaryGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(10px, 1vw, 16px);
  min-width: 0;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryCard = styled.article<{
  $tone: "accent" | "success" | "warning" | "error";
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
  min-height: 78px;
  padding: 16px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: 0 12px 34px rgba(15, 23, 42, 0.045);

  &::before {
    width: 8px;
    height: 36px;
    flex: 0 0 auto;
    order: -1;
    border-radius: 999px;
    background: ${({ $tone }) => `var(--color-${$tone})`};
    content: "";
  }
`;

const SummaryMeta = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const SummaryLabel = styled.div`
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SummaryCaption = styled.div`
  overflow: hidden;
  color: var(--color-text-tertiary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SummaryValue = styled.div`
  flex: 0 0 auto;
  color: var(--color-text-primary);
  font-size: clamp(24px, 2.3vw, 34px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.055em;
`;

const ChartGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.4vw, 22px);
  min-height: 0;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    overflow: visible;
  }
`;

const Panel = styled.section`
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: clamp(18px, 1.6vw, 26px);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    box-shadow: var(--color-shadow-hover);
  }

  @media (max-width: 900px) {
    min-height: 380px;
  }
`;

const PanelHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
`;

const PanelTitle = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(18px, 1.45vw, 23px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.045em;
  word-break: keep-all;
`;

const PanelSubtitle = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  flex: 0 0 auto;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-tertiary);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const ChartBox = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const AlertStack = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(460px, calc(100vw - 48px));

  @media (max-width: 768px) {
    right: 16px;
    bottom: 16px;
    left: 16px;
    max-width: none;
  }
`;

const AlertToast = styled.div`
  display: inline-flex;
  align-items: center;
  width: auto;
  padding: 12px 16px;
  border: 1px solid var(--color-error);
  border-radius: 16px;
  background: var(--color-error-soft);
  color: var(--color-error);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  word-break: keep-all;
  box-shadow: var(--color-shadow);

  svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    margin-right: 8px;
  }

  b {
    font-weight: 700;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
