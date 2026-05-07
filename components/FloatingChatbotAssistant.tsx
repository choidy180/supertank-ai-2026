'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Bot, RefreshCw, Sparkles, X } from 'lucide-react';
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

type FloatingChatbotThemeStyle = {
  surface: string;
  surfaceElevated: string;
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
  danger: string;
  dangerSoft: string;
  success: string;
  shadow: string;
  shadowStrong: string;
  focus: string;
};

const FLOATING_CHATBOT_THEME: Record<'light' | 'dark', FloatingChatbotThemeStyle> = {
  light: {
    surface: '#ffffff',
    surfaceElevated: 'rgba(255, 255, 255, 0.88)',
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
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.08)',
    success: '#059669',
    shadow: '0 18px 54px rgba(15, 23, 42, 0.16)',
    shadowStrong: '0 26px 80px rgba(15, 23, 42, 0.24)',
    focus: 'rgba(37, 99, 235, 0.18)',
  },
  dark: {
    surface: '#111827',
    surfaceElevated: 'rgba(17, 24, 39, 0.88)',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    border: 'rgba(148, 163, 184, 0.22)',
    borderStrong: 'rgba(148, 163, 184, 0.38)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    onAccent: '#0f172a',
    danger: '#fca5a5',
    dangerSoft: 'rgba(252, 165, 165, 0.1)',
    success: '#86efac',
    shadow: '0 18px 54px rgba(0, 0, 0, 0.34)',
    shadowStrong: '0 26px 80px rgba(0, 0, 0, 0.46)',
    focus: 'rgba(147, 197, 253, 0.24)',
  },
};

const createFloatingChatbotThemeVars = (theme: FloatingChatbotThemeStyle) => css`
  --floating-chatbot-surface: ${theme.surface};
  --floating-chatbot-surface-elevated: ${theme.surfaceElevated};
  --floating-chatbot-surface-muted: ${theme.surfaceMuted};
  --floating-chatbot-surface-hover: ${theme.surfaceHover};
  --floating-chatbot-border: ${theme.border};
  --floating-chatbot-border-strong: ${theme.borderStrong};
  --floating-chatbot-text-primary: ${theme.textPrimary};
  --floating-chatbot-text-secondary: ${theme.textSecondary};
  --floating-chatbot-text-tertiary: ${theme.textTertiary};
  --floating-chatbot-accent: ${theme.accent};
  --floating-chatbot-accent-soft: ${theme.accentSoft};
  --floating-chatbot-on-accent: ${theme.onAccent};
  --floating-chatbot-danger: ${theme.danger};
  --floating-chatbot-danger-soft: ${theme.dangerSoft};
  --floating-chatbot-success: ${theme.success};
  --floating-chatbot-shadow: ${theme.shadow};
  --floating-chatbot-shadow-strong: ${theme.shadowStrong};
  --floating-chatbot-focus: ${theme.focus};

  --bg: ${theme.surfaceMuted};
  --card: ${theme.surface};
  --text: ${theme.textPrimary};
  --muted: ${theme.textSecondary};
  --border: ${theme.border};
  --primary: ${theme.accent};
  --danger: ${theme.danger};
  --accent: ${theme.accent};
  --shadow: ${theme.shadow};

  --color-background: ${theme.surfaceMuted};
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
  --color-error: ${theme.danger};
  --color-error-soft: ${theme.dangerSoft};
  --color-shadow: ${theme.shadow};
  --color-focus: ${theme.focus};
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDismissNetworkError = () => {
    networkDismissedRef.current = true;
    setNetworkError(null);
  };

  const handleRefresh = () => {
    networkDismissedRef.current = false;
    setNetworkError(null);
    setIsLoading(true);
    setRetryKey((prev) => prev + 1);
  };

  return (
    <FloatingRoot $isDark={isDark}>
      {isOpen && (
        <ChatbotDrawer
          role="dialog"
          aria-modal="false"
          aria-labelledby="floating-chatbot-title"
        >
          <DrawerHeader>
            <HeaderTitleGroup>
              <HeaderEyebrow>
                <Sparkles size={13} />
                Smart Assistant
              </HeaderEyebrow>
              <HeaderTitle id="floating-chatbot-title">
                AI 챗봇 어시스턴트
              </HeaderTitle>
              <HeaderCaption>
                {isLoading
                  ? '조치 로그를 불러오는 중입니다.'
                  : `연동 로그 ${allLogs.length}건 · 영상 준비 ${readyVideoCount}건`}
              </HeaderCaption>
            </HeaderTitleGroup>

            <HeaderActions>
              <IconButton
                type="button"
                aria-label="챗봇 데이터 새로고침"
                onClick={handleRefresh}
              >
                <RefreshCw size={18} className={isLoading ? 'spinner' : undefined} />
              </IconButton>

              <IconButton
                type="button"
                aria-label="AI 챗봇 닫기"
                onClick={handleClose}
              >
                <X size={20} />
              </IconButton>
            </HeaderActions>
          </DrawerHeader>

          {networkError && (
            <NetworkBanner>
              <span>
                로그 서버와 연결이 원활하지 않습니다.
                {networkError.detail ? ` ${networkError.detail}` : ''}
              </span>
              <button type="button" onClick={handleDismissNetworkError}>
                닫기
              </button>
            </NetworkBanner>
          )}

          <ChatbotViewport>
            <ChatbotPanel logs={allLogs} />
          </ChatbotViewport>
        </ChatbotDrawer>
      )}

      <FloatingButton
        type="button"
        aria-label={isOpen ? 'AI 챗봇 어시스턴트 닫기' : 'AI 챗봇 어시스턴트 열기'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            handleClose();
            return;
          }

          handleOpen();
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        <span>{isOpen ? '닫기' : 'AI'}</span>
      </FloatingButton>
    </FloatingRoot>
  );
}

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const FloatingRoot = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) =>
    createFloatingChatbotThemeVars(
      $isDark ? FLOATING_CHATBOT_THEME.dark : FLOATING_CHATBOT_THEME.light,
    )}

  position: relative;
  z-index: 1800;
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
`;

const FloatingButton = styled.button`
  ${buttonReset};

  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 1810;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 72px;
  height: 56px;
  padding: 0 18px;
  border: 1px solid var(--floating-chatbot-border);
  border-radius: 999px;
  background: var(--floating-chatbot-accent);
  color: var(--floating-chatbot-on-accent);
  box-shadow: var(--floating-chatbot-shadow);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.02em;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--floating-chatbot-shadow-strong);
  }

  &:focus-visible {
    outline: 4px solid var(--floating-chatbot-focus);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    right: 18px;
    bottom: 18px;
    min-width: 62px;
    height: 52px;
    padding: 0 16px;
  }
`;

const ChatbotDrawer = styled.aside`
  position: fixed;
  right: 24px;
  bottom: 94px;
  z-index: 1805;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  width: min(460px, calc(100vw - 32px));
  height: min(760px, calc(100dvh - 122px));
  min-height: 420px;
  overflow: hidden;
  border: 1px solid var(--floating-chatbot-border);
  border-radius: 28px;
  background: var(--floating-chatbot-surface-elevated);
  color: var(--floating-chatbot-text-primary);
  box-shadow: var(--floating-chatbot-shadow-strong);
  backdrop-filter: blur(22px) saturate(1.12);
  animation: ${slideUp} 220ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 640px) {
    right: 10px;
    bottom: 82px;
    width: calc(100vw - 20px);
    height: calc(100dvh - 104px);
    min-height: 0;
    border-radius: 24px;
  }
`;

const DrawerHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  padding: 18px 18px 16px;
  border-bottom: 1px solid var(--floating-chatbot-border);
  background:
    radial-gradient(circle at 0% 0%, var(--floating-chatbot-accent-soft), transparent 46%),
    var(--floating-chatbot-surface-elevated);
`;

const HeaderTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const HeaderEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  color: var(--floating-chatbot-accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  color: var(--floating-chatbot-text-primary);
  font-size: 21px;
  font-weight: 900;
  line-height: 1.22;
  letter-spacing: -0.045em;
`;

const HeaderCaption = styled.div`
  color: var(--floating-chatbot-text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.45;
`;

const HeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
`;

const IconButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--floating-chatbot-border);
  border-radius: 999px;
  background: var(--floating-chatbot-surface-muted);
  color: var(--floating-chatbot-text-secondary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--floating-chatbot-border-strong);
    background: var(--floating-chatbot-surface-hover);
    color: var(--floating-chatbot-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--floating-chatbot-focus);
    outline-offset: 2px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const NetworkBanner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--floating-chatbot-border);
  background: var(--floating-chatbot-danger-soft);
  color: var(--floating-chatbot-danger);
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
    font-weight: 900;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const ChatbotViewport = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--floating-chatbot-surface);

  > * {
    width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 0;
  }
`;
