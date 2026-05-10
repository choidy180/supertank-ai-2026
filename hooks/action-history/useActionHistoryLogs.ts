import { useEffect, useRef, useState } from 'react';

import { API_BASE, NO_TEXT_MSG, WAITING_MSG } from '@/model/action-history/constants';
import {
  getNetworkErrorDetail,
  isTimeOverOneMinute,
  fetchJsonWithTimeout,
} from '@/model/action-history/helpers';
import {
  buildImageNameUrl,
  buildImageUrl,
  buildSttUrl,
  buildTextUrl,
  buildVideoUrl,
} from '@/model/action-history/url';
import type { ApiLogItem, LogItem, LogsApiResponse, NetworkErrorState, SttResponse } from '@/model/action-history/types';

const fetchLogs = () => fetchJsonWithTimeout<LogsApiResponse>(`${API_BASE}/api/data`);

const fetchSttOnly = async (sttUrl: string): Promise<string | null> => {
  try {
    const res = await fetch(sttUrl);
    const json: SttResponse = await res.json();

    if (res.ok && json.status !== 'error') {
      return json.config?.dialogs?.map((dialog) => dialog.speakerText).join('\n') ?? '';
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

  const thumbUrl = imgName != null ? buildImageUrl(item.IMG_PATH, imgName) : '/img/logs_03.jpg';

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
      desc = sttJson.config?.dialogs?.map((dialog) => dialog.speakerText).join('\n') ?? '';
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
    raw: item,
  };
};

export const useActionHistoryLogs = () => {
  const [allLogs, setAllLogs] = useState<LogItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [networkError, setNetworkError] = useState<NetworkErrorState | null>(null);

  const loadedIdsRef = useRef<Set<string>>(new Set());
  const logsRef = useRef<LogItem[]>([]);
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

      return { detail };
    });
  };

  const clearNetworkProblem = () => {
    pollingPausedRef.current = false;
    networkDismissedRef.current = false;
    setNetworkError((prev) => (prev === null ? prev : null));
  };

  const handleCloseNetworkModal = () => {
    networkDismissedRef.current = true;
    setNetworkError(null);
  };

  const requestReload = () => {
    pollingPausedRef.current = false;
    networkDismissedRef.current = false;
    setNetworkError(null);

    if (allLogs.length === 0) {
      setIsInitialLoading(true);
    }

    setRetryKey((prev) => prev + 1);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessData = async (isFirstLoad = false) => {
      if (pollingPausedRef.current && !isFirstLoad) {
        return;
      }

      try {
        const wrapper = await fetchLogs();

        if (wrapper?.status?.toLowerCase?.() === 'error') {
          throw new Error('로그 API 상태가 error로 응답했습니다.');
        }

        const items: ApiLogItem[] = Array.isArray(wrapper?.data) ? wrapper.data : [];

        if (isMounted) {
          clearNetworkProblem();
        }

        const newItems = items.filter((item) => !loadedIdsRef.current.has(item.LOG_NAME));
        let processedNewLogs: LogItem[] = [];

        if (newItems.length > 0) {
          processedNewLogs = await Promise.all(newItems.map((item) => processLogItem(item)));
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
              return newText ? { id: item.id, newDesc: newText } : null;
            }),
          );

          updatedSttLogs = results.filter(
            (result): result is { id: string; newDesc: string } => result !== null,
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
              return isReady ? { id: item.id, isReady: true } : null;
            }),
          );

          updatedVideoLogs = results.filter(
            (result): result is { id: string; isReady: boolean } => result !== null,
          );
        }

        if (isMounted) {
          const hasSttUpdates = updatedSttLogs.length > 0 || sttTimeoutUpdates.length > 0;
          const hasVideoUpdates = updatedVideoLogs.length > 0;
          const hasNewLogs = processedNewLogs.length > 0;

          if (hasNewLogs || hasSttUpdates || hasVideoUpdates) {
            setAllLogs((prev) => {
              let nextLogs = [...prev];
              const allSttUpdates = [...updatedSttLogs, ...sttTimeoutUpdates];

              if (allSttUpdates.length > 0) {
                nextLogs = nextLogs.map((log) => {
                  const target = allSttUpdates.find((update) => update.id === log.id);
                  return target ? { ...log, desc: target.newDesc } : log;
                });
              }

              if (updatedVideoLogs.length > 0) {
                nextLogs = nextLogs.map((log) => {
                  const target = updatedVideoLogs.find((video) => video.id === log.id);
                  return target ? { ...log, videoReady: true } : log;
                });
              }

              if (processedNewLogs.length > 0) {
                nextLogs = [...processedNewLogs, ...nextLogs];
              }

              return nextLogs.sort((a, b) => b.time.localeCompare(a.time));
            });
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
  }, [retryKey]);

  return {
    allLogs,
    isInitialLoading,
    networkError,
    handleCloseNetworkModal,
    handleRetryNetwork: requestReload,
    handleRefresh: requestReload,
  };
};
