'use client';

import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

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
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IoAlertCircle } from 'react-icons/io5';
import { MdRefresh, MdSend } from 'react-icons/md';
import { RiRobot2Fill } from 'react-icons/ri';
import { Bar, Doughnut } from 'react-chartjs-2';
import styled, { createGlobalStyle, css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type ThemeMode = 'light' | 'dark';

type InsightThemeStyle = {
  colorScheme: ThemeMode;
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  shadow: string;
  focus: string;
  chartGrid: string;
  chartPalette: string[];
  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const INSIGHT_THEME_STYLES: Record<ThemeMode, InsightThemeStyle> = {
  light: {
    colorScheme: 'light',
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',
    error: '#dc2626',
    errorSoft: 'rgba(220, 38, 38, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
    chartGrid: 'rgba(100, 116, 139, 0.18)',
    chartPalette: ['#2563eb', '#059669', '#7c3aed', '#d97706', '#dc2626'],
    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },
  dark: {
    colorScheme: 'dark',
    background: '#0f172a',
    surface: '#111827',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',
    error: '#fca5a5',
    errorSoft: 'rgba(252, 165, 165, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',
    chartGrid: 'rgba(148, 163, 184, 0.2)',
    chartPalette: ['#93c5fd', '#86efac', '#c4b5fd', '#fcd34d', '#fca5a5'],
    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
  },
};

const getInsightTheme = (isDark: boolean) =>
  isDark ? INSIGHT_THEME_STYLES.dark : INSIGHT_THEME_STYLES.light;

const createInsightThemeVars = (theme: InsightThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --color-background: ${theme.background};
  --color-surface: ${theme.surface};
  --color-surface-muted: ${theme.surfaceMuted};
  --color-surface-hover: ${theme.surfaceHover};

  --color-border: ${theme.border};
  --color-border-strong: ${theme.borderStrong};

  --color-text-primary: ${theme.textPrimary};
  --color-text-secondary: ${theme.textSecondary};
  --color-text-tertiary: ${theme.textTertiary};

  --color-accent: ${theme.accent};
  --color-accent-soft: ${theme.accentSoft};

  --color-success: ${theme.success};
  --color-success-soft: ${theme.successSoft};

  --color-warning: ${theme.warning};
  --color-warning-soft: ${theme.warningSoft};

  --color-error: ${theme.error};
  --color-error-soft: ${theme.errorSoft};

  --color-shadow: ${theme.shadow};
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
    overflow: hidden;
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
    height: auto !important;
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
  id: 'legendGap',
  beforeInit(chart: any, _args: any, opts: { gap?: number } = {}) {
    const fit = chart.legend && chart.legend.fit;

    if (!fit) {
      return;
    }

    chart.legend.fit = function fitWithGap() {
      fit.bind(chart.legend)();
      chart.legend.height += opts.gap ?? 20;
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

type Msg = {
  role: 'user' | 'bot';
  lines: string[];
};

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

export default function InsightPage() {
  const isDark = useThemeStore((state) => state.isDark);
  const theme = useMemo(() => getInsightTheme(isDark), [isDark]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      layout: {
        padding: {
          top: 0,
          bottom: 0,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'right' as const,
          align: 'center' as const,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            color: theme.textPrimary,
            font: {
              size: 20,
              weight: 'bold',
            },
            padding: 24,
            boxWidth: 18,
            boxHeight: 18,
          },
        },
        legendGap: {
          gap: 30,
        },
        datalabels: {
          color: '#ffffff',
          font: {
            weight: 900,
            size: 22,
          },
          padding: 14,
          offset: 8,
          anchor: 'center',
          align: 'center',
          formatter: (value: number, ctx: any) => {
            const arr: number[] = ctx.chart.data.datasets[0].data;
            const sum = arr.reduce((a: number, b: number) => a + b, 0);

            return sum > 0 ? `${Math.round((value * 100) / sum)}%` : '0%';
          },
        },
        tooltip: {
          backgroundColor: theme.surface,
          titleColor: theme.textPrimary,
          bodyColor: theme.textPrimary,
          borderColor: theme.border,
          borderWidth: 1,
          titleFont: {
            size: 18,
            weight: 'bold',
          },
          bodyFont: {
            size: 18,
          },
          padding: 14,
          cornerRadius: 10,
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
          position: 'top' as const,
          align: 'end' as const,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            color: theme.textPrimary,
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 16,
            boxWidth: 18,
            boxHeight: 18,
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
            size: 18,
            weight: 'bold',
          },
          bodyFont: {
            size: 18,
          },
          padding: 14,
          cornerRadius: 10,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: theme.chartGrid,
          },
          ticks: {
            color: theme.textSecondary,
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 10,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: theme.textSecondary,
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 10,
          },
        },
      },
    }),
    [theme],
  );

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'user',
      lines: ['오늘 점검 횟수를 알려줘'],
    },
    {
      role: 'bot',
      lines: [
        '안녕하세요! 오늘 점검 횟수를 알려드릴게요.',
        '점검 횟수: 3회',
        '배출구 별 횟수',
        '1번 배출구 : 1회\n2번 배출구 : 2회',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [processes, setProcesses] = useState<any>(null);
  const [facilities, setFacilities] = useState<any>(null);
  const [processesTrend, setProcessesTrend] = useState<any>(null);
  const [facilitiesTrend, setFacilitiesTrend] = useState<any>(null);

  const fetchAll = async () => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);

        if (!res.ok) {
          console.error(`[API 상태 에러] ${res.status}: ${url}`);
          return { success: false };
        }

        return await res.json();
      } catch (err) {
        console.error('[API 연결 실패]', url, err);
        return { success: false };
      }
    };

    const [j1, j2, j3, j4] = await Promise.all([
      safeFetch(
        'http://192.168.10.174:5654/db/tql/get_alarm_count_equip.tql?from=2025-10-27T00:00:00&to=2025-11-24T23:59:59&limit=5',
      ),
      safeFetch(
        'http://192.168.10.174:5654/db/tql/get_alarm_count.tql?from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&limit=5',
      ),
      safeFetch(
        'http://192.168.10.174:5654/db/tql/get_alarm_trend_equip.tql?eqpid=EQS1A0016&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60',
      ),
      safeFetch(
        'http://192.168.10.174:5654/db/tql/get_alarm_trend.tql?eqpid=EQS1A0016&tagname=M606&from=2025-10-27T00:00:00&to=2025-10-27T23:59:59&interval=60',
      ),
    ]);

    setProcesses(j1);
    setFacilities(j2);
    setProcessesTrend(j3);
    setFacilitiesTrend(j4);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = taRef.current;

    if (!el) {
      return;
    }

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const send = () => {
    if (!input.trim()) {
      return;
    }

    setMsgs((prev) => [...prev, { role: 'user', lines: [input.trim()] }]);
    setInput('');

    setTimeout(() => {
      setMsgs((prev) => [...prev, { role: 'bot', lines: ['확인했습니다.'] }]);
    }, 200);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

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
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels: ['A 설비', 'B 설비', 'C 설비', 'D 설비', 'E 설비'],
      datasets: [
        {
          data: [23, 29, 12, 21, 15],
          backgroundColor: theme.chartPalette,
          borderWidth: 0,
        },
      ],
    };
  }, [processes, theme.chartPalette]);

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
            borderWidth: 0,
          },
        ],
      };
    }

    return {
      labels: ['로터볼트', '스테이터볼트', '사이드볼트', '기타', '알 수 없음'],
      datasets: [
        {
          data: [40, 30, 20, 5, 5],
          backgroundColor: theme.chartPalette,
          borderWidth: 0,
        },
      ],
    };
  }, [facilities, theme.chartPalette]);

  const barDataProcess = useMemo(() => {
    if (processesTrend?.success === true && processesTrend.data.rows?.length > 0) {
      const labels = processesTrend.data.rows.map(([datetime]: any) =>
        datetime.split(' ')[1].slice(0, 5),
      );
      const values = processesTrend.data.rows.map(([_, val]: any) => val);

      return {
        labels,
        datasets: [
          {
            label: 'SideBolt 체결 누락',
            data: values,
            backgroundColor: theme.accent,
            borderRadius: 8,
          },
        ],
      };
    }

    return {
      labels: ['월', '화', '수', '목', '금', '토', '일'],
      datasets: [
        {
          label: '공정불량 발생 건수',
          data: [15, 22, 13, 24, 35, 18, 12],
          backgroundColor: theme.accent,
          borderRadius: 8,
          barThickness: 30,
        },
      ],
    };
  }, [processesTrend, theme.accent]);

  const barDataAlarmTrend = useMemo(() => {
    if (facilitiesTrend?.success === true && facilitiesTrend.data.rows?.length > 0) {
      const rows = facilitiesTrend.data.rows;
      const labels = rows.map((r: any) => r[0].split(' ')[1].slice(0, 5));
      const values = rows.map((r: any) => r[1]);

      return {
        labels,
        datasets: [
          {
            label: '설비알람 발생 건수',
            data: values,
            backgroundColor: theme.success,
            borderRadius: 8,
          },
        ],
      };
    }

    return {
      labels: ['09:00', '11:00', '13:00', '15:00', '17:00'],
      datasets: [
        {
          label: '설비알람 Trend',
          data: [5, 12, 8, 14, 9],
          backgroundColor: theme.success,
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    };
  }, [facilitiesTrend, theme.success]);

  return (
    <>
      <GlobalStyles />

      <Page>
        <Main>
          <LeftCol>
            <Grid2x2>
              <Panel>
                <PanelTitle>공정불량 TOP 5</PanelTitle>

                <ChartBox>
                  <Doughnut
                    data={doughnutDataProcess}
                    options={doughnutOptions as any}
                  />
                </ChartBox>
              </Panel>

              <Panel>
                <PanelTitle>공정불량 Trend</PanelTitle>

                <ChartBox>
                  <Bar data={barDataProcess} options={barOptions as any} />
                </ChartBox>
              </Panel>

              <Panel>
                <PanelTitle>설비알람 TOP 5</PanelTitle>

                <ChartBox>
                  <Doughnut
                    data={doughnutDataAlarm}
                    options={doughnutOptions as any}
                  />
                </ChartBox>
              </Panel>

              <Panel>
                <PanelTitle>설비알람 Trend</PanelTitle>

                <ChartBox>
                  <Bar data={barDataAlarmTrend} options={barOptions as any} />
                </ChartBox>
              </Panel>
            </Grid2x2>
          </LeftCol>

          <RightCol>
            <ChatCard>
              <ChatHeader>
                <ChatTitle>
                  <RiRobot2Fill />
                  AI 챗봇 어시스턴트
                </ChatTitle>

                <RefreshButton
                  type="button"
                  aria-label="새로고침"
                  onClick={fetchAll}
                >
                  <MdRefresh />
                </RefreshButton>
              </ChatHeader>

              <ChatBody>
                {msgs.map((message, index) => (
                  <MsgRow key={`${message.role}-${index}`} $role={message.role}>
                    {message.role === 'bot' && (
                      <BotAvatar>
                        <RiRobot2Fill />
                      </BotAvatar>
                    )}

                    <MessageBubble $role={message.role}>
                      {message.lines.map((line, lineIndex) => (
                        <MsgLine key={`${line}-${lineIndex}`}>{line}</MsgLine>
                      ))}
                    </MessageBubble>
                  </MsgRow>
                ))}
              </ChatBody>

              <ChatInput>
                <textarea
                  ref={taRef}
                  rows={1}
                  placeholder="메세지를 입력하세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />

                <button type="button" aria-label="전송" onClick={send}>
                  <MdSend size={28} />
                </button>
              </ChatInput>
            </ChatCard>
          </RightCol>
        </Main>

        <AlertStack>
          {!processes?.success && <AlertBox msg="공정불량 TOP5" />}
          {!facilities?.success && <AlertBox msg="설비알람 TOP5" />}
          {!processesTrend?.success && <AlertBox msg="공정불량 Trend" />}
          {!facilitiesTrend?.success && <AlertBox msg="설비알람 Trend" />}
        </AlertStack>
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

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 540px;
  gap: 24px;
  height: 100vh;
  padding: 40px;
  overflow: hidden;
  box-sizing: border-box;
  align-items: stretch;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr 450px;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    overflow: auto;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LeftCol = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1100px) {
    overflow: visible;
  }
`;

const Grid2x2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 24px;
  height: 100%;
  min-height: 0;
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
  }
`;

const RightCol = styled.aside`
  position: sticky;
  top: 40px;
  height: 100%;
  min-height: 0;
  align-self: start;

  @media (max-width: 1100px) {
    position: static;
    height: 800px;
  }

  @media (max-width: 768px) {
    height: 680px;
  }
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 22px;
    border-radius: 18px;
  }
`;

const PanelTitle = styled.h3`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 30px;
  color: var(--color-text-primary);
  font-size: 30px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;

  @media (max-width: 768px) {
    margin-bottom: 22px;
    font-size: 24px;
  }
`;

const ChartBox = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 300px;
`;

const ChatCard = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 24px 30px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ChatTitle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.03em;
  word-break: keep-all;

  svg {
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
    color: var(--color-accent);
  }

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const RefreshButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  svg {
    width: 28px;
    height: 28px;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-border-strong);
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const ChatBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  padding: 30px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 22px;
  }
`;

const MsgRow = styled.div<{ $role: 'user' | 'bot' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ $role }) =>
    $role === 'user' ? 'flex-end' : 'flex-start'};
  gap: 12px;
`;

const BotAvatar = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-accent);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MessageBubble = styled.div<{ $role: 'user' | 'bot' }>`
  max-width: 80%;
  padding: 18px 24px;
  border: 1px solid
    ${({ $role }) =>
      $role === 'user' ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 20px;
  border-top-left-radius: ${({ $role }) => ($role === 'bot' ? '4px' : '20px')};
  border-top-right-radius: ${({ $role }) =>
    $role === 'user' ? '4px' : '20px'};
  background: ${({ $role }) =>
    $role === 'user' ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: ${({ $role }) =>
    $role === 'user' ? 'var(--color-accent)' : 'var(--color-text-primary)'};
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;

  @media (max-width: 768px) {
    max-width: 86%;
    padding: 16px 18px;
    font-size: 18px;
  }
`;

const MsgLine = styled.span`
  display: block;
`;

const ChatInput = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin: 20px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface-muted);
  transition: border-color 160ms ease;

  &:focus-within {
    border-color: var(--color-accent);
  }

  textarea {
    flex: 1;
    min-height: 56px;
    max-height: 160px;
    padding: 12px 16px;
    resize: none;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text-primary);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.5;

    &::placeholder {
      color: var(--color-text-tertiary);
    }
  }

  button {
    ${buttonReset};

    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    flex: 0 0 auto;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-surface);
    transition:
      transform 160ms ease,
      background 160ms ease;

    svg {
      width: 28px;
      height: 28px;
    }

    &:hover {
      transform: translateY(-1px);
    }

    &:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }
  }

  @media (max-width: 768px) {
    margin: 16px;
    padding: 16px;

    textarea {
      font-size: 18px;
    }
  }
`;

const AlertStack = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    right: 20px;
    bottom: 20px;
    left: 20px;
  }
`;

const AlertToast = styled.div`
  display: inline-flex;
  align-items: center;
  width: auto;
  padding: 16px 24px;
  border: 1px solid var(--color-error);
  border-radius: 12px;
  background: var(--color-error-soft);
  color: var(--color-error);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.45;
  word-break: keep-all;

  svg {
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
    margin-right: 12px;
  }

  b {
    font-weight: 900;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px;
  }
`;