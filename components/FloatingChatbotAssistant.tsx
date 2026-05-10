'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {
  ChevronDown,
  MessageCircle,
  RefreshCw,
  X,
} from 'lucide-react';
import styled, { css, keyframes } from 'styled-components';

import ChatbotPanel from '@/components/ChatbotPanel';
import { useThemeStore } from '@/store/useThemeStore';

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

type FloatingThemeStyle = {
  colorScheme: 'light' | 'dark';
  panel: string;
  panelSolid: string;
  elevated: string;
  muted: string;
  hover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  launcherBg: string;
  launcherText: string;
  danger: string;
  dangerSoft: string;
  success: string;
  shadow: string;
  shadowStrong: string;
  focus: string;
};

const FLOATING_THEME: Record<'light' | 'dark', FloatingThemeStyle> = {
  light: {
    colorScheme: 'light',
    panel: '#ffffff',
    panelSolid: '#ffffff',
    elevated: '#ffffff',
    muted: '#f8fafc',
    hover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    launcherBg: '#ffffff',
    launcherText: '#111827',
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.08)',
    success: '#16a34a',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowStrong: '0 12px 32px rgba(15, 23, 42, 0.12)',
    focus: 'rgba(37, 99, 235, 0.18)',
  },
  dark: {
    colorScheme: 'dark',
    panel: '#141414',
    panelSolid: '#141414',
    elevated: '#181818',
    muted: '#1a1a1a',
    hover: '#222222',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f5f5f5',
    textSecondary: '#c7c7c7',
    textTertiary: '#8f8f8f',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    launcherBg: '#141414',
    launcherText: '#f5f5f5',
    danger: '#ef4444',
    dangerSoft: 'rgba(239, 68, 68, 0.12)',
    success: '#16a34a',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.26)',
    shadowStrong: '0 16px 42px rgba(0, 0, 0, 0.42)',
    focus: 'rgba(37, 99, 235, 0.28)',
  },
};

const createFloatingThemeVars = (theme: FloatingThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --floating-panel: ${theme.panel};
  --floating-panel-solid: ${theme.panelSolid};
  --floating-elevated: ${theme.elevated};
  --floating-muted: ${theme.muted};
  --floating-hover: ${theme.hover};
  --floating-border: ${theme.border};
  --floating-border-strong: ${theme.borderStrong};
  --floating-text-primary: ${theme.textPrimary};
  --floating-text-secondary: ${theme.textSecondary};
  --floating-text-tertiary: ${theme.textTertiary};
  --floating-accent: ${theme.accent};
  --floating-accent-soft: ${theme.accentSoft};
  --floating-launcher-bg: ${theme.launcherBg};
  --floating-launcher-text: ${theme.launcherText};
  --floating-danger: ${theme.danger};
  --floating-danger-soft: ${theme.dangerSoft};
  --floating-success: ${theme.success};
  --floating-shadow: ${theme.shadow};
  --floating-shadow-strong: ${theme.shadowStrong};
  --floating-focus: ${theme.focus};
`;

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

const stringifyValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }

  return '';
};

const normalizeDateTime = (value: unknown) => {
  const raw = stringifyValue(value);

  if (!raw) {
    return '';
  }

  const normalized = raw
    .replace('T', ' ')
    .replace(/\.\d+Z?$/u, '')
    .replace(/Z$/u, '')
    .trim();

  if (/^\d{4}-\d{2}-\d{2}$/u.test(normalized)) {
    return `${normalized} 00:00:00`;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/u.test(normalized)) {
    return `${normalized}:00`;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/u.test(normalized)) {
    return normalized.slice(0, 19);
  }

  return normalized;
};

const isTimeOverOneMinute = (logTimeStr: string): boolean => {
  if (!logTimeStr) {
    return true;
  }

  try {
    const logDate = new Date(normalizeDateTime(logTimeStr).replace(' ', 'T'));
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

  return '챗봇 데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.';
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

export default function FloatingChatbotAssistant() {
  const isDark = useThemeStore((state) => state.isDark);
  const [isOpen, setIsOpen] = useState(false);
  const [allLogs, setAllLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [networkError, setNetworkError] = useState<NetworkErrorState | null>(
    null,
  );
  const [retryKey, setRetryKey] = useState(0);

  const loadedIdsRef = useRef<Set<string>>(new Set());
  const logsRef = useRef<LogItem[]>([]);
  const hasFetchedOnceRef = useRef(false);
  const networkDismissedRef = useRef(false);

  const readyVideoCount = useMemo(() => {
    return allLogs.filter((log) => log.videoReady).length;
  }, [allLogs]);

  useEffect(() => {
    logsRef.current = allLogs;
  }, [allLogs]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    const fetchSttOnly = async (sttUrl: string): Promise<string | null> => {
      try {
        const res = await fetch(sttUrl);
        const json: SttResponse = await res.json();

        if (res.ok && json.status !== 'error') {
          return (
            json.config?.dialogs
              ?.map((dialog) => dialog.speakerText)
              .join('\n') ?? ''
          );
        }

        return null;
      } catch {
        return null;
      }
    };

    const checkVideoAvailability = async (
      videoUrl: string,
    ): Promise<boolean> => {
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

      let fetchedTitle = item.LOG_NAME.replace(/\.[^/.]+$/u, '');
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

    const fetchAndProcessData = async (isFirstLoad = false) => {
      if (isFirstLoad) {
        setIsLoading(true);
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
          networkDismissedRef.current = false;
          setNetworkError(null);
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
          const allSttUpdates = [...updatedSttLogs, ...sttTimeoutUpdates];

          if (
            processedNewLogs.length > 0 ||
            allSttUpdates.length > 0 ||
            updatedVideoLogs.length > 0
          ) {
            setAllLogs((prev) => {
              let nextLogs = [...prev];

              if (allSttUpdates.length > 0) {
                nextLogs = nextLogs.map((log) => {
                  const target = allSttUpdates.find(
                    (update) => update.id === log.id,
                  );

                  return target ? { ...log, desc: target.newDesc } : log;
                });
              }

              if (updatedVideoLogs.length > 0) {
                nextLogs = nextLogs.map((log) => {
                  const target = updatedVideoLogs.find(
                    (video) => video.id === log.id,
                  );

                  return target ? { ...log, videoReady: true } : log;
                });
              }

              if (processedNewLogs.length > 0) {
                nextLogs = [...processedNewLogs, ...nextLogs];
              }

              return nextLogs.sort((a, b) => b.time.localeCompare(a.time));
            });
          }

          hasFetchedOnceRef.current = true;
        }
      } catch (error) {
        const detail = getNetworkErrorDetail(error);

        if (isMounted && !networkDismissedRef.current) {
          setNetworkError({ detail });
        }
      } finally {
        if (isMounted && isFirstLoad) {
          setIsLoading(false);
        }
      }
    };

    void fetchAndProcessData(!hasFetchedOnceRef.current);

    const intervalId = window.setInterval(() => {
      void fetchAndProcessData(false);
    }, 3000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [isOpen, retryKey]);

  const handleRefresh = () => {
    networkDismissedRef.current = false;
    setNetworkError(null);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  const handleDismissNetworkError = () => {
    networkDismissedRef.current = true;
    setNetworkError(null);
  };

  return (
    <FloatingRoot $isDark={isDark}>
      {isOpen && (
        <FloatingPanel
          role="dialog"
          aria-modal="false"
          aria-labelledby="floating-chatbot-title"
        >
          <PanelChrome>
            <PanelIdentity>
              <PanelOrb aria-hidden="true">
                <MessageCircle size={18} />
              </PanelOrb>

              <PanelTitleGroup>
                <PanelEyebrow>Smart Factory Copilot</PanelEyebrow>
                <PanelTitle id="floating-chatbot-title">AI 조치 어시스턴트</PanelTitle>
                <PanelCaption>
                  {isLoading
                    ? '로그 데이터를 동기화하고 있습니다.'
                    : `로그 ${allLogs.length}건 · 영상 준비 ${readyVideoCount}건`}
                </PanelCaption>
              </PanelTitleGroup>
            </PanelIdentity>

            <PanelActions>
              <ChromeButton
                type="button"
                aria-label="챗봇 데이터 새로고침"
                onClick={handleRefresh}
              >
                <RefreshCw size={17} className={isLoading ? 'spinner' : undefined} />
              </ChromeButton>

              <ChromeButton
                type="button"
                aria-label="AI 챗봇 닫기"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </ChromeButton>
            </PanelActions>
          </PanelChrome>

          {networkError && (
            <NetworkNotice>
              <span>
                로그 서버 연결이 원활하지 않습니다.
                {networkError.detail ? ` ${networkError.detail}` : ''}
              </span>
              <button type="button" onClick={handleDismissNetworkError}>
                숨기기
              </button>
            </NetworkNotice>
          )}

          <PanelBody>
            <ChatbotPanel logs={allLogs} height="100%" showHeader={false} />
          </PanelBody>
        </FloatingPanel>
      )}

      <Launcher
        type="button"
        aria-label={isOpen ? 'AI 조치 어시스턴트 닫기' : 'AI 조치 어시스턴트 열기'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <LauncherIcon>
          {isOpen ? <ChevronDown size={22} /> : <MessageCircle size={22} />}
        </LauncherIcon>

        <LauncherText>
          <strong>{isOpen ? '접기' : 'AI Assist'}</strong>
          <span>{isOpen ? '열린 상태' : '조치 이력 요약'}</span>
        </LauncherText>

        {!isOpen && <LauncherStatusDot aria-hidden="true" />}
      </Launcher>
    </FloatingRoot>
  );
}

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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const FloatingRoot = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) =>
    createFloatingThemeVars($isDark ? FLOATING_THEME.dark : FLOATING_THEME.light)}

  position: relative;
  z-index: 1900;
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'SF Pro Display',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
`;

const Launcher = styled.button`
  ${buttonReset};

  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1910;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 164px;
  height: 58px;
  padding: 8px 16px 8px 8px;
  border: 1px solid var(--floating-border);
  border-radius: 16px;
  background: var(--floating-launcher-bg);
  color: var(--floating-launcher-text);
  box-shadow: var(--floating-shadow);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--floating-border-strong);
    background: var(--floating-hover);
    box-shadow: var(--floating-shadow-strong);
  }

  &:focus-visible {
    outline: 3px solid var(--floating-focus);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    right: 18px;
    bottom: 18px;
    min-width: 58px;
    width: 58px;
    height: 58px;
    padding: 8px;
  }
`;

const LauncherIcon = styled.span`
  position: relative;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid var(--floating-border);
  border-radius: 12px;
  background: var(--floating-muted);
  color: var(--floating-accent);
`;

const LauncherText = styled.span`
  display: grid;
  gap: 3px;
  min-width: 0;
  text-align: left;

  strong {
    color: var(--floating-text-primary);
    font-size: 15px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.035em;
    white-space: nowrap;
  }

  span {
    color: var(--floating-text-secondary);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.25;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const LauncherStatusDot = styled.span`
  position: absolute;
  top: 10px;
  right: 11px;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--floating-accent);
`;

const FloatingPanel = styled.aside`
  position: fixed;
  right: 24px;
  bottom: 92px;
  z-index: 1905;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  width: min(468px, calc(100vw - 32px));
  height: min(740px, calc(100dvh - 116px));
  min-height: 420px;
  overflow: hidden;
  border: 1px solid var(--floating-border);
  border-radius: 20px;
  background: var(--floating-panel);
  color: var(--floating-text-primary);
  box-shadow: var(--floating-shadow-strong);

  @media (max-width: 640px) {
    right: 10px;
    bottom: 86px;
    width: calc(100vw - 20px);
    height: calc(100dvh - 104px);
    min-height: 0;
    border-radius: 18px;
  }
`;

const PanelChrome = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding: 18px;
  border-bottom: 1px solid var(--floating-border);
  background: var(--floating-panel);
`;

const PanelIdentity = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

const PanelOrb = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid var(--floating-border);
  border-radius: 12px;
  background: var(--floating-muted);
  color: var(--floating-accent);
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const PanelEyebrow = styled.div`
  color: var(--floating-accent);
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: var(--floating-text-primary);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
`;

const PanelCaption = styled.div`
  color: var(--floating-text-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
`;

const PanelActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
`;

const ChromeButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--floating-border);
  border-radius: 10px;
  background: var(--floating-elevated);
  color: var(--floating-text-secondary);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--floating-border-strong);
    background: var(--floating-hover);
    color: var(--floating-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--floating-focus);
    outline-offset: 2px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const NetworkNotice = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 16px;
  border-bottom: 1px solid var(--floating-border);
  border-left: 3px solid var(--floating-danger);
  background: var(--floating-muted);
  color: var(--floating-danger);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.45;

  span {
    min-width: 0;
  }

  button {
    ${buttonReset};

    flex: 0 0 auto;
    color: inherit;
    font-size: 12px;
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const PanelBody = styled.div`
  grid-row: 3;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--floating-panel-solid);

  > * {
    width: 100%;
    height: 100%;
    min-height: 0;
  }
`;
