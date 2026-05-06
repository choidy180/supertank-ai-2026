'use client';

import React, { useEffect, useRef, useState } from 'react';

import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from 'react-icons/fa';
import { FiCalendar, FiSearch } from 'react-icons/fi';
import { IoAlertCircle, IoCloseSharp } from 'react-icons/io5';

import ChatbotPanel from '@/components/ChatbotPanel';
import VideoThumbnail from '@/components/video-thumbnail';
import { useThemeStore } from '@/store/useThemeStore';

/* ===========================
    Types & API Base
=========================== */

const API_BASE = 'http://192.168.10.175:5000';
const API_TIMEOUT_MS = 7000;

const WAITING_MSG = '현재 텍스트를 STT로 변환중 입니다';
const NO_TEXT_MSG = '변환된 텍스트가 없습니다';

type LogItem = {
  id: string;
  title: string;
  desc: string;
  fullLogText: string;
  thumb: string;
  videoTitle: string;
  videoSrc: string;
  videoReady: boolean;
  time: string;
  sttUrl: string;
  textUrl: string;
};

type ModalStep = 'closed' | 'video';

type ApiLogItem = {
  IMG_PATH: string;
  LOG_NAME: string;
  STT_NAME: string;
  TIME: string;
  VIDEO_NAME: string;
};

type LogsApiResponse = {
  data?: ApiLogItem[];
  status?: string;
};

type SttResponse = {
  config?: {
    dialogs?: {
      speakerText: string;
    }[];
  };
  status: string;
  message?: string;
};

type NetworkErrorState = {
  detail?: string;
};

/* ===========================
    Theme
=========================== */

type ThemeMode = 'light' | 'dark';

type LogsThemeStyle = {
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
  onAccent: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  shadow: string;
  focus: string;
  overlay: string;
  skeleton: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const LOGS_THEME_STYLES: Record<ThemeMode, LogsThemeStyle> = {
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
    onAccent: '#ffffff',
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
    overlay: 'rgba(15, 23, 42, 0.42)',
    skeleton: '#e5e7eb',
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
    onAccent: '#0f172a',
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',
    danger: '#fca5a5',
    dangerSoft: 'rgba(252, 165, 165, 0.1)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',
    overlay: 'rgba(2, 6, 23, 0.68)',
    skeleton: '#273449',
    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
  },
};

const getLogsTheme = (isDark: boolean) =>
  isDark ? LOGS_THEME_STYLES.dark : LOGS_THEME_STYLES.light;

const createLogsThemeVars = (theme: LogsThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --bg: ${theme.background};
  --card: ${theme.surface};
  --text: ${theme.textPrimary};
  --muted: ${theme.textSecondary};
  --border: ${theme.border};
  --primary: ${theme.accent};
  --danger: ${theme.danger};
  --accent: ${theme.accent};
  --shadow: ${theme.shadow};
  --radius: 20px;

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
  --color-on-accent: ${theme.onAccent};

  --color-success: ${theme.success};
  --color-success-soft: ${theme.successSoft};

  --color-error: ${theme.danger};
  --color-error-soft: ${theme.dangerSoft};

  --color-warning: ${theme.warning};
  --color-warning-soft: ${theme.warningSoft};

  --color-shadow: ${theme.shadow};
  --color-focus: ${theme.focus};
  --color-overlay: ${theme.overlay};

  --color-skeleton: ${theme.skeleton};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};
`;

const GlobalBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createLogsThemeVars(getLogsTheme($isDark))}
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #__next {
    min-height: 100%;
  }

  body {
    margin: 0;
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

  img {
    display: block;
    max-width: 100%;
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

function Global() {
  const isDark = useThemeStore((state) => state.isDark);

  return <GlobalBase $isDark={isDark} />;
}

/* ===========================
    Helper Functions
=========================== */

const formatTimeDisplay = (timeStr: string) => {
  if (!timeStr) {
    return { date: '', time: '' };
  }

  const parts = timeStr.split(' ');

  if (parts.length < 2) {
    return { date: timeStr, time: '' };
  }

  const date = parts[0].replace(/-/g, '. ');
  const time = parts[1].substring(0, 8);

  return { date, time };
};

const convertToInputFormat = (dbTimeStr: string) => {
  if (!dbTimeStr) {
    return '';
  }

  return dbTimeStr.replace(' ', 'T').substring(0, 16);
};

const getNowInputFormat = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

const formatForDisplay = (dateString: string) => {
  if (!dateString) {
    return '날짜 및 시간 선택';
  }

  return dateString.replace('T', ' ');
};

const isTimeOverOneMinute = (logTimeStr: string): boolean => {
  if (!logTimeStr) {
    return true;
  }

  try {
    const logDate = new Date(logTimeStr.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now.getTime() - logDate.getTime();

    return diffMs > 60000;
  } catch {
    return true;
  }
};

const getNetworkErrorDetail = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'API 응답 시간이 초과되었습니다.';
  }

  if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      return 'API 서버에 연결할 수 없습니다.';
    }

    return error.message;
  }

  return '로그 데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.';
};

const fetchJsonWithTimeout = async <T,>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const controller = new AbortController();

  const timerId = window.setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timerId);
  }
};

/* ===========================
    URL Builder
=========================== */

const buildImageNameUrl = (imgPath: string) =>
  `${API_BASE}/api/images/${encodeURIComponent(imgPath)}`;

const buildImageUrl = (imgPath: string, imgName: string) =>
  `${API_BASE}/api/images/${encodeURIComponent(imgPath)}/${encodeURIComponent(
    imgName,
  )}`;

const buildSttUrl = (sttName: string) =>
  `${API_BASE}/api/STT/${encodeURIComponent(sttName)}`;

const buildTextUrl = (logName: string) =>
  `${API_BASE}/api/text/${encodeURIComponent(logName)}`;

const buildVideoUrl = (videoName: string) =>
  `${API_BASE}/api/videos/${encodeURIComponent(videoName)}`;

/* ===========================
    Animation
=========================== */

const waitingPulse = keyframes`
  0% {
    opacity: 0.58;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.58;
  }
`;

const waitingCss = css`
  display: inline-block;
  color: var(--color-accent);
  font-weight: 800;
  animation: ${waitingPulse} 1.4s ease-in-out infinite;
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const skeletonPulse = keyframes`
  0% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.55;
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const pop = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

/* ===========================
    Sub-Component: Expandable Description
=========================== */

const ExpandableDesc = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const isWaiting = text === WAITING_MSG;

  useEffect(() => {
    if (!textRef.current) {
      return;
    }

    if (isWaiting || text === NO_TEXT_MSG) {
      setShowButton(false);
      return;
    }

    const isOverflowing =
      textRef.current.scrollHeight > textRef.current.clientHeight + 1;

    setShowButton(isOverflowing);
  }, [text, isWaiting]);

  return (
    <DescWrapper>
      <TextContainer
        ref={textRef}
        $expanded={expanded}
        $isWaiting={isWaiting}
      >
        {text}
      </TextContainer>

      {showButton && !isWaiting && (
        <ToggleButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? (
            <>
              접기 <FaChevronUp size={16} />
            </>
          ) : (
            <>
              더보기 <FaChevronDown size={16} />
            </>
          )}
        </ToggleButton>
      )}
    </DescWrapper>
  );
};

/* ===========================
    Sub-Component: Skeleton Card
=========================== */

const SkeletonCard = () => {
  return (
    <Card>
      <SkeletonThumb />

      <CardBody>
        <SkeletonLine
          $width="70%"
          $height="40px"
          style={{ marginBottom: '16px' }}
        />
        <SkeletonLine
          $width="30%"
          $height="24px"
          style={{ marginBottom: '20px' }}
        />
        <SkeletonLine
          $width="100%"
          $height="22px"
          style={{ marginBottom: '8px' }}
        />
        <SkeletonLine $width="90%" $height="22px" />
        <SkeletonBtn />
      </CardBody>
    </Card>
  );
};

/* ===========================
    Page Component
=========================== */

export default function LogsPage() {
  const [allLogs, setAllLogs] = useState<LogItem[]>([]);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const loadedIdsRef = useRef<Set<string>>(new Set());
  const logsRef = useRef<LogItem[]>([]);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const [networkError, setNetworkError] = useState<NetworkErrorState | null>(
    null,
  );
  const [retryKey, setRetryKey] = useState(0);

  const networkDismissedRef = useRef(false);
  const pollingPausedRef = useRef(false);

  useEffect(() => {
    logsRef.current = allLogs;
  }, [allLogs]);

  const showNetworkProblem = (detail?: string) => {
    if (networkDismissedRef.current) {
      return;
    }

    setNetworkError((prev) => {
      if (prev?.detail === detail) {
        return prev;
      }

      return {
        detail,
      };
    });
  };

  const clearNetworkProblem = () => {
    pollingPausedRef.current = false;
    networkDismissedRef.current = false;

    setNetworkError((prev) => {
      if (prev === null) {
        return prev;
      }

      return null;
    });
  };

  const handleCloseNetworkModal = () => {
    networkDismissedRef.current = true;
    setNetworkError(null);
  };

  const handleRetryNetwork = () => {
    pollingPausedRef.current = false;
    networkDismissedRef.current = false;
    setNetworkError(null);

    if (allLogs.length === 0) {
      setIsInitialLoading(true);
    }

    setRetryKey((prev) => prev + 1);
  };

  const fetchSttOnly = async (sttUrl: string): Promise<string | null> => {
    try {
      const res = await fetch(sttUrl);
      const json: SttResponse = await res.json();

      if (res.ok && json.status !== 'error') {
        return (
          json.config?.dialogs?.map((dialog) => dialog.speakerText).join('\n') ??
          ''
        );
      }

      return null;
    } catch {
      return null;
    }
  };

  const checkVideoAvailability = async (videoUrl: string): Promise<boolean> => {
    try {
      const res = await fetch(videoUrl, { method: 'HEAD' });

      return res.ok;
    } catch {
      return false;
    }
  };

  const processLogItem = async (item: ApiLogItem): Promise<LogItem> => {
    const sttUrl = buildSttUrl(item.STT_NAME);
    const textUrl = buildTextUrl(item.LOG_NAME);
    const videoUrl = buildVideoUrl(item.VIDEO_NAME);

    let imgName: string | null = null;

    try {
      const res = await fetch(buildImageNameUrl(item.IMG_PATH));

      if (res.ok) {
        const json = await res.json();

        if (Array.isArray(json.images) && json.images.length > 0) {
          imgName = json.images[0];
        }
      }
    } catch {
      imgName = null;
    }

    const thumbUrl =
      imgName != null
        ? buildImageUrl(item.IMG_PATH, imgName)
        : '/img/logs_03.jpg';

    let fetchedTitle = item.LOG_NAME.replace(/\.[^/.]+$/, '');
    let fetchedFullText = '';

    try {
      const res = await fetch(textUrl);

      if (res.ok) {
        const textData = await res.text();

        if (textData) {
          fetchedFullText = textData;

          const lines = textData.split('\n');
          const qrLine = lines.find((line) => line.includes('QR'));

          if (qrLine) {
            fetchedTitle = qrLine.trim();
          } else if (lines.length > 0) {
            fetchedTitle = lines[0].trim();
          }
        }
      }
    } catch {
      fetchedFullText = '';
    }

    let desc = '';

    try {
      const res = await fetch(sttUrl);
      const sttJson: SttResponse = await res.json();

      if (res.ok && sttJson.status !== 'error') {
        desc =
          sttJson.config?.dialogs
            ?.map((dialog) => dialog.speakerText)
            .join('\n') ?? '';
      } else if (sttJson.status === 'error') {
        desc = isTimeOverOneMinute(item.TIME) ? NO_TEXT_MSG : WAITING_MSG;
      } else {
        desc = sttUrl;
      }
    } catch {
      desc = isTimeOverOneMinute(item.TIME) ? NO_TEXT_MSG : WAITING_MSG;
    }

    const isVideoReady = await checkVideoAvailability(videoUrl);

    return {
      id: item.LOG_NAME,
      title: fetchedTitle,
      fullLogText: fetchedFullText,
      desc,
      thumb: thumbUrl,
      videoTitle: `${fetchedTitle} / ${item.TIME}`,
      videoSrc: videoUrl,
      videoReady: isVideoReady,
      time: item.TIME,
      sttUrl,
      textUrl,
    };
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async (isFirstLoad = false) => {
      if (pollingPausedRef.current && !isFirstLoad) {
        return;
      }

      try {
        const wrapper = await fetchJsonWithTimeout<LogsApiResponse>(
          `${API_BASE}/api/data`,
        );

        if (wrapper?.status?.toLowerCase?.() === 'error') {
          throw new Error('로그 API 상태가 error로 응답했습니다.');
        }

        const items: ApiLogItem[] = Array.isArray(wrapper?.data)
          ? wrapper.data
          : [];

        if (isMounted) {
          clearNetworkProblem();
        }

        const newItems = items.filter(
          (item) => !loadedIdsRef.current.has(item.LOG_NAME),
        );

        let processedNewLogs: LogItem[] = [];

        if (newItems.length > 0) {
          processedNewLogs = await Promise.all(
            newItems.map((item) => processLogItem(item)),
          );

          newItems.forEach((item) => loadedIdsRef.current.add(item.LOG_NAME));
        }

        const sttRetryCandidates = logsRef.current.filter(
          (log) => log.desc === WAITING_MSG && !isTimeOverOneMinute(log.time),
        );

        const sttTimeoutCandidates = logsRef.current.filter(
          (log) => log.desc === WAITING_MSG && isTimeOverOneMinute(log.time),
        );

        let updatedSttLogs: { id: string; newDesc: string }[] = [];

        if (sttRetryCandidates.length > 0) {
          const results = await Promise.all(
            sttRetryCandidates.map(async (item) => {
              const newText = await fetchSttOnly(item.sttUrl);

              if (newText) {
                return { id: item.id, newDesc: newText };
              }

              return null;
            }),
          );

          updatedSttLogs = results.filter(
            (result): result is { id: string; newDesc: string } =>
              result !== null,
          );
        }

        const sttTimeoutUpdates = sttTimeoutCandidates.map((item) => ({
          id: item.id,
          newDesc: NO_TEXT_MSG,
        }));

        const videoRetryCandidates = logsRef.current.filter(
          (log) => !log.videoReady && !isTimeOverOneMinute(log.time),
        );

        let updatedVideoLogs: { id: string; isReady: boolean }[] = [];

        if (videoRetryCandidates.length > 0) {
          const results = await Promise.all(
            videoRetryCandidates.map(async (item) => {
              const isReady = await checkVideoAvailability(item.videoSrc);

              if (isReady) {
                return { id: item.id, isReady: true };
              }

              return null;
            }),
          );

          updatedVideoLogs = results.filter(
            (result): result is { id: string; isReady: boolean } =>
              result !== null,
          );
        }

        if (isMounted) {
          const hasSttUpdates =
            updatedSttLogs.length > 0 || sttTimeoutUpdates.length > 0;
          const hasVideoUpdates = updatedVideoLogs.length > 0;
          const hasNewLogs = processedNewLogs.length > 0;

          if (hasNewLogs || hasSttUpdates || hasVideoUpdates) {
            setAllLogs((prev) => {
              let newAllLogs = [...prev];

              const allSttUpdates = [...updatedSttLogs, ...sttTimeoutUpdates];

              if (allSttUpdates.length > 0) {
                newAllLogs = newAllLogs.map((log) => {
                  const target = allSttUpdates.find(
                    (update) => update.id === log.id,
                  );

                  if (target) {
                    return { ...log, desc: target.newDesc };
                  }

                  return log;
                });
              }

              if (updatedVideoLogs.length > 0) {
                newAllLogs = newAllLogs.map((log) => {
                  const target = updatedVideoLogs.find(
                    (video) => video.id === log.id,
                  );

                  if (target) {
                    return { ...log, videoReady: true };
                  }

                  return log;
                });
              }

              if (processedNewLogs.length > 0) {
                newAllLogs = [...processedNewLogs, ...newAllLogs];
              }

              return newAllLogs.sort((a, b) => b.time.localeCompare(a.time));
            });

            if (hasNewLogs && !searchCode) {
              setEndTime(getNowInputFormat());
            }
          }
        }
      } catch (error) {
        const detail = getNetworkErrorDetail(error);

        if (isMounted) {
          pollingPausedRef.current = true;
          showNetworkProblem(detail);
        }
      } finally {
        if (isMounted && isFirstLoad) {
          setIsInitialLoading(false);
        }
      }
    };

    void fetchAndProcessData(true);

    const intervalId = window.setInterval(() => {
      void fetchAndProcessData(false);
    }, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCode, retryKey]);

  useEffect(() => {
    if (allLogs.length > 0 && !startTime && !endTime && !searchCode) {
      const times = allLogs.map((log) => log.time).sort();
      const minTime = times[0];

      setStartTime(convertToInputFormat(minTime));
      setEndTime(getNowInputFormat());
      setLogs(allLogs);
    } else {
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLogs, startTime, endTime, searchCode]);

  const applyFilter = () => {
    if (searchCode.trim()) {
      const keyword = searchCode.toLowerCase();

      const filtered = allLogs.filter((item) => {
        return (
          item.title.toLowerCase().includes(keyword) ||
          item.id.toLowerCase().includes(keyword)
        );
      });

      setLogs(filtered);
    } else if (startTime && endTime) {
      const startStr = startTime.replace('T', ' ');
      const endStr = endTime.replace('T', ' ');

      const filtered = allLogs.filter((item) => {
        return item.time >= startStr && item.time <= `${endStr}:59`;
      });

      setLogs(filtered);
    } else {
      setLogs(allLogs);
    }
  };

  const handleTimeSearch = () => {
    setSearchCode('');

    if (!startTime || !endTime) {
      alert('시작 시간과 종료 시간을 모두 선택해주세요.');
      return;
    }

    applyFilter();
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchCode(value);
    setStartTime('');
    setEndTime('');
  };

  const [modalStep, setModalStep] = useState<ModalStep>('closed');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openVideoModal = (item: LogItem) => {
    if (!item.videoReady) {
      return;
    }

    setCurrentVideoTitle(item.videoTitle);
    setCurrentVideoSrc(item.videoSrc);
    setModalStep('video');

    window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 150);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setModalStep('closed');
  };

  return (
    <>
      <Global />

      <Shell>
        <LeftCol>
          <SearchArea>
            <div className="left-group">
              <span className="label">기간검색</span>

              <div className="custom-date-box">
                <FiCalendar className="icon" />
                <span className="date-text">{formatForDisplay(startTime)}</span>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  className="hidden-picker"
                />
              </div>

              <span className="tilde">~</span>

              <div className="custom-date-box">
                <FiCalendar className="icon" />
                <span className="date-text">{formatForDisplay(endTime)}</span>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  className="hidden-picker"
                />
              </div>

              <SearchBtn
                type="button"
                onClick={handleTimeSearch}
                aria-label="기간 검색"
              >
                <FiSearch />
              </SearchBtn>
            </div>

            <div className="divider" />

            <div className="right-group">
              <div className="input-box text-search">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="QR 코드 또는 파일명 입력"
                  value={searchCode}
                  onChange={handleCodeChange}
                />
              </div>
            </div>
          </SearchArea>

          <List>
            {isInitialLoading && logs.length === 0 ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : logs.length === 0 ? (
              <NoData>검색 결과가 없습니다.</NoData>
            ) : (
              logs.map((item) => (
                <Card key={item.id}>
                  <Thumb>
                    <VideoThumbnail
                      videoUrl={item.videoSrc}
                      width="100%"
                      height="100%"
                      className="thumb-img"
                    />
                  </Thumb>

                  <CardBody>
                    <h3 className="title">
                      조치보고:{' '}
                      {item.title.replace('QR 코드 인식됨: ', '')}
                    </h3>

                    <div className="time-row">
                      {(() => {
                        const { date, time } = formatTimeDisplay(item.time);

                        return (
                          <>
                            <span className="date">{date}</span>
                            <span className="sep">|</span>
                            <span className="time">{time}</span>
                          </>
                        );
                      })()}
                    </div>

                    <ExpandableDesc text={item.desc} />

                    <VideoBtn
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        if (item.videoReady) {
                          openVideoModal(item);
                        }
                      }}
                      $ready={item.videoReady}
                      disabled={!item.videoReady}
                    >
                      {item.videoReady ? (
                        <>
                          <FaCheckCircle size={20} />
                          <span>영상 확인</span>
                        </>
                      ) : (
                        <>
                          <FaSpinner className="spinner" size={20} />
                          <span>영상 생성중...</span>
                        </>
                      )}
                    </VideoBtn>
                  </CardBody>
                </Card>
              ))
            )}
          </List>
        </LeftCol>

        <ChatbotPanel logs={allLogs} />
      </Shell>

      {modalStep === 'video' && (
        <ModalDim onClick={closeModal}>
          <Modal onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentVideoTitle}</h3>

              <CloseBtn
                type="button"
                aria-label="영상 모달 닫기"
                onClick={closeModal}
              >
                <IoCloseSharp size={32} />
              </CloseBtn>
            </div>

            <div className="modal-body">
              <div className="video-container">
                <video ref={videoRef} controls autoPlay>
                  <source src={currentVideoSrc} type="video/mp4" />
                  브라우저가 비디오 재생을 지원하지 않습니다.
                </video>
              </div>
            </div>
          </Modal>
        </ModalDim>
      )}

      {networkError && (
        <NetworkModalDim onClick={handleCloseNetworkModal}>
          <NetworkModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <NetworkIcon>
              <IoAlertCircle />
            </NetworkIcon>

            <NetworkTitle id="network-modal-title">
              현재 네트워크에 문제가 있습니다
            </NetworkTitle>

            <NetworkText>
              로그 서버와 연결이 원활하지 않아 데이터를 불러오지 못했습니다.
              <br />
              네트워크 상태 또는 API 서버 연결을 확인해주세요.
            </NetworkText>

            {networkError.detail && (
              <NetworkDetail>{networkError.detail}</NetworkDetail>
            )}

            <NetworkActions>
              <NetworkGhostButton
                type="button"
                onClick={handleCloseNetworkModal}
              >
                닫기
              </NetworkGhostButton>

              <NetworkPrimaryButton type="button" onClick={handleRetryNetwork}>
                다시 시도
              </NetworkPrimaryButton>
            </NetworkActions>
          </NetworkModal>
        </NetworkModalDim>
      )}
    </>
  );
}

/* ===========================
    Styled Components
=========================== */

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

const Shell = styled.main`
  display: grid;
  grid-template-columns: 1fr 540px;
  gap: 24px;
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  background: var(--color-background);
  color: var(--color-text-primary);

  @media (max-width: 1400px) {
    grid-template-columns: 1fr 450px;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LeftCol = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  max-height: calc(100vh - 80px);

  @media (max-width: 1100px) {
    max-height: none;
  }
`;

const SearchArea = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 24px;
  padding: 24px 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--color-shadow);

  .left-group {
    display: flex;
    align-items: center;
    gap: 16px;

    .label {
      margin-right: 8px;
      color: var(--color-text-primary);
      font-size: 20px;
      font-weight: 700;
      white-space: nowrap;
    }

    .tilde {
      color: var(--color-text-secondary);
      font-size: 20px;
      font-weight: 700;
    }
  }

  .custom-date-box {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 250px;
    height: 56px;
    padding: 0 16px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface-muted);
    cursor: pointer;
    transition:
      border-color 160ms ease,
      background 160ms ease;

    &:hover,
    &:focus-within {
      border-color: var(--color-accent);
      background: var(--color-surface-hover);
    }

    .icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: var(--color-accent);
      pointer-events: none;
    }

    .date-text {
      color: var(--color-text-primary);
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
    }

    .hidden-picker {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;

      &::-webkit-calendar-picker-indicator {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }

  .divider {
    width: 1px;
    height: 40px;
    background: var(--color-border);
  }

  .right-group {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-left: auto;
  }

  .input-box {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 16px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface-muted);
    transition:
      border-color 160ms ease,
      background 160ms ease;

    &:focus-within {
      border-color: var(--color-accent);
      background: var(--color-surface-hover);
    }

    .search-icon {
      width: 24px;
      height: 24px;
      margin-right: 12px;
      color: var(--color-text-tertiary);
    }

    input {
      height: 100%;
      border: 0;
      outline: none;
      background: transparent;
      color: var(--color-text-primary);
      font-family: inherit;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;

      &::placeholder {
        color: var(--color-text-tertiary);
      }
    }
  }

  .text-search {
    width: 380px;

    input {
      width: 100%;
      cursor: text;
    }
  }

  @media (max-width: 900px) {
    align-items: stretch;
    flex-direction: column;

    .divider {
      display: none;
    }

    .right-group {
      width: 100%;
      margin-left: 0;
    }

    .input-box.text-search {
      width: 100%;
    }

    .left-group {
      flex-wrap: wrap;

      .custom-date-box {
        flex: 1;
        min-width: 220px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 18px;
  }
`;

const SearchBtn = styled.button`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  transition:
    transform 160ms ease,
    opacity 160ms ease;

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
`;

const List = styled.div`
  display: grid;
  gap: 24px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 10px;

  @media (max-width: 1100px) {
    max-height: none;
  }
`;

const NoData = styled.div`
  display: grid;
  place-items: center;
  min-height: 320px;
  padding: 60px;
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 24px;
  font-weight: 700;
`;

const Card = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  padding: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--color-shadow);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Thumb = styled.div`
  height: 220px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface-muted);

  img,
  div.thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardBody = styled.div`
  display: grid;
  align-content: start;
  gap: 0;

  .title {
    margin: 0 0 12px;
    color: var(--color-text-primary);
    font-size: 34px;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.25;
    word-break: keep-all;
  }

  .time-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    color: var(--color-text-secondary);
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0.02em;

    .sep {
      color: var(--color-border-strong);
      font-weight: 300;
    }
  }
`;

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 60px;
  margin: 10px 0 0;
`;

const TextContainer = styled.div<{
  $expanded: boolean;
  $isWaiting?: boolean;
}>`
  width: 100%;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 22px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  transition:
    max-height 240ms ease,
    opacity 240ms ease;

  ${({ $expanded }) =>
    $expanded
      ? css`
          display: block;
          max-height: 800px;
          opacity: 1;
          -webkit-line-clamp: unset;
        `
      : css`
          display: -webkit-box;
          max-height: 3.2em;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        `}

  ${({ $isWaiting }) => $isWaiting && waitingCss}
`;

const ToggleButton = styled.button`
  ${buttonReset};

  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 0;
  color: var(--color-accent);
  font-size: 20px;
  font-weight: 700;

  &:hover {
    opacity: 0.82;
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const VideoBtn = styled.button<{ $ready?: boolean }>`
  ${buttonReset};

  position: absolute;
  right: 32px;
  bottom: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 180px;
  height: 50px;
  padding: 8px 16px;
  border: 1px solid
    ${({ $ready }) =>
      $ready ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 12px;
  background: ${({ $ready }) =>
    $ready ? 'var(--color-accent)' : 'var(--color-surface-muted)'};
  color: ${({ $ready }) =>
    $ready ? 'var(--color-on-accent)' : 'var(--color-text-secondary)'};
  font-size: 20px;
  font-weight: 800;
  cursor: ${({ $ready }) => ($ready ? 'pointer' : 'not-allowed')};
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  &:hover {
    transform: ${({ $ready }) => ($ready ? 'translateY(-1px)' : 'none')};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }

  @media (max-width: 720px) {
    position: static;
    justify-self: start;
    margin-top: 20px;
  }
`;

/* ====== Skeleton Styles ====== */

const SkeletonBlock = css`
  border-radius: 8px;
  background: var(--color-skeleton);
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
`;

const SkeletonThumb = styled.div`
  ${SkeletonBlock};

  width: 100%;
  height: 220px;
  border-radius: 16px;
`;

const SkeletonLine = styled.div<{
  $width?: string;
  $height?: string;
}>`
  ${SkeletonBlock};

  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
`;

const SkeletonBtn = styled.div`
  ${SkeletonBlock};

  position: absolute;
  right: 32px;
  bottom: 32px;
  width: 180px;
  height: 50px;
  border-radius: 12px;

  @media (max-width: 720px) {
    position: static;
    margin-top: 20px;
  }
`;

/* ===========================
    Video Modal Styles
=========================== */

const ModalDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: var(--color-overlay);
  animation: ${fade} 180ms ease;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: min(1200px, 90vw);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--color-shadow);
  animation: ${pop} 220ms cubic-bezier(0.22, 1, 0.36, 1);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 32px;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);

    h3 {
      margin: 0;
      overflow: hidden;
      color: var(--color-text-primary);
      font-size: 26px;
      font-weight: 800;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .modal-body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0;
    background: #000000;

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #000000;

      video {
        display: block;
        width: 100%;
        height: 100%;
        outline: none;
      }
    }
  }
`;

const CloseBtn = styled.button`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  color: var(--color-text-secondary);
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: var(--color-surface-hover);
    color: var(--color-error);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

/* ===========================
    Network Modal Styles
=========================== */

const NetworkModalDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 140;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--color-overlay);
  animation: ${fade} 180ms ease;
`;

const NetworkModal = styled.div`
  display: grid;
  justify-items: center;
  width: min(520px, 100%);
  padding: 34px 32px 30px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  text-align: center;
  box-shadow: var(--color-shadow);
  animation: ${pop} 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const NetworkIcon = styled.div`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 18px;
  border: 1px solid var(--color-error);
  border-radius: 999px;
  background: var(--color-error-soft);
  color: var(--color-error);

  svg {
    width: 34px;
    height: 34px;
  }
`;

const NetworkTitle = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const NetworkText = styled.p`
  margin: 14px 0 0;
  color: var(--color-text-secondary);
  font-size: 17px;
  font-weight: 600;
  line-height: 1.65;
  word-break: keep-all;
`;

const NetworkDetail = styled.div`
  width: 100%;
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-surface-muted);
  color: var(--color-text-tertiary);
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  overflow-wrap: anywhere;
`;

const NetworkActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 24px;
`;

const NetworkButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const NetworkGhostButton = styled(NetworkButtonBase)`
  border: 1px solid var(--color-border);
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);

  &:hover {
    border-color: var(--color-border-strong);
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const NetworkPrimaryButton = styled(NetworkButtonBase)`
  border: 1px solid var(--color-accent);
  background: var(--color-accent);
  color: var(--color-on-accent);
`;