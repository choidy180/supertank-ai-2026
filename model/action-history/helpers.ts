
import { API_TIMEOUT_MS, NO_TEXT_MSG, WAITING_MSG } from './constants';
import type {
  ActionContextMeta,
  ActionHistoryContext,
  ActionHistoryItem,
  ActionStatus,
  DateFilterRange,
  DateSummaryRow,
  DurationSummaryRow,
  LogItem,
} from './types';

export const formatTimeDisplay = (timeStr: string) => {
  if (!timeStr) {
    return { date: '', time: '' };
  }

  const normalized = normalizeDateTime(timeStr);
  const parts = normalized.split(' ');

  if (parts.length < 2) {
    return { date: normalized, time: '' };
  }

  const date = parts[0].replace(/-/g, '. ');
  const time = parts[1].substring(0, 8);

  return { date, time };
};

export const isTimeOverOneMinute = (logTimeStr: string): boolean => {
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

export const normalizeDateTime = (value: unknown) => {
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

export const parseDate = (value: unknown) => {
  const normalized = normalizeDateTime(value);

  if (!normalized) {
    return null;
  }

  const date = new Date(normalized.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatDateTime = (value: string) => {
  if (!value) {
    return '-';
  }

  const normalized = normalizeDateTime(value);

  if (!normalized) {
    return '-';
  }

  const [date = '', time = ''] = normalized.split(' ');
  const compactTime = time ? time.slice(0, 8) : '';

  return compactTime ? `${date} ${compactTime}` : date;
};

export const formatDateLabel = (value: string) => {
  if (!value) {
    return '-';
  }

  return value.replace(/-/gu, '. ');
};

export const stringifyValue = (value: unknown) => {
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

export const toFiniteNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const text = stringifyValue(value).replace(/,/gu, '');

  if (!text) {
    return null;
  }

  const numeric = Number(text);

  return Number.isFinite(numeric) ? numeric : null;
};

export const parseDurationMinutes = (value: unknown) => {
  const numericValue = toFiniteNumber(value);

  if (numericValue !== null) {
    return numericValue;
  }

  const text = stringifyValue(value);

  if (!text || /^n\/?a$/iu.test(text)) {
    return null;
  }

  const colonMatch = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/u.exec(text);

  if (colonMatch) {
    const hours = Number(colonMatch[1]);
    const minutes = Number(colonMatch[2]);
    const seconds = Number(colonMatch[3] ?? 0);

    return hours * 60 + minutes + seconds / 60;
  }

  const hourMatch = /(\d+(?:\.\d+)?)\s*(?:시간|hour|hr|h)/iu.exec(text);
  const minuteMatch = /(\d+(?:\.\d+)?)\s*(?:분|minute|min|m)/iu.exec(text);
  const secondMatch = /(\d+(?:\.\d+)?)\s*(?:초|second|sec|s)/iu.exec(text);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const seconds = secondMatch ? Number(secondMatch[1]) : 0;

  if (hourMatch || minuteMatch || secondMatch) {
    return hours * 60 + minutes + seconds / 60;
  }

  return null;
};

export const calculateDurationMinutes = (start: string, end: string) => {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate || !endDate) {
    return null;
  }

  const diffMinutes = (endDate.getTime() - startDate.getTime()) / 60000;

  if (!Number.isFinite(diffMinutes) || diffMinutes < 0) {
    return null;
  }

  return diffMinutes;
};

export const formatDuration = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) {
    return 'N/A';
  }

  if (minutes < 1) {
    return `${Math.max(1, Math.round(minutes * 60))}초`;
  }

  const roundedMinutes = Math.round(minutes);

  if (roundedMinutes < 60) {
    return `${roundedMinutes}분`;
  }

  const hours = Math.floor(roundedMinutes / 60);
  const restMinutes = roundedMinutes % 60;

  return restMinutes > 0 ? `${hours}시간 ${restMinutes}분` : `${hours}시간`;
};

export const formatAverageMinutes = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) {
    return '-';
  }

  return minutes.toFixed(1);
};

export const getAverage = (values: number[]) => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const getDatePart = (dateTime: string) => {
  return normalizeDateTime(dateTime).split(' ')[0] || '-';
};

export const isWithinRange = (dateTime: string, range: DateFilterRange) => {
  const normalized = normalizeDateTime(dateTime);

  if (!normalized) {
    return false;
  }

  return normalized >= range.startDateTime && normalized <= range.endDateTime;
};

export const escapeCsv = (value: string | number | null) => {
  const text = value === null ? '' : String(value);

  return `"${text.replace(/"/gu, '""')}"`;
};

export const createCsv = (headers: string[], rows: Array<Array<string | number | null>>) => {
  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(cell)).join(','))
    .join('\n');
};

export const downloadTextFile = (filename: string, content: string, type: string) => {
  const blob = new Blob(['\ufeff', content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const sanitizeFilename = (value: string) => {
  return value.replace(/[\\/:*?"<>|\s]+/gu, '_').replace(/_+/gu, '_');
};

export const escapeHtml = (value: string) => {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
};

export const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
};

export const extractFieldFromText = (text: string, labels: string[]) => {
  if (!text) {
    return '';
  }

  const lines = text.split(/\r?\n/gu);

  for (const label of labels) {
    const escapedLabel = escapeRegExp(label);
    const linePattern = new RegExp(
      `^\\s*(?:${escapedLabel})\\s*(?:[:：=\\-]|\\s)\\s*(.+?)\\s*$`,
      'iu',
    );

    for (const line of lines) {
      const matched = linePattern.exec(line);

      if (matched?.[1]?.trim()) {
        return matched[1].trim();
      }
    }
  }

  for (const label of labels) {
    const escapedLabel = escapeRegExp(label);
    const inlinePattern = new RegExp(
      `${escapedLabel}\\s*[:：=\\-]\\s*([^\\r\\n]+)`,
      'iu',
    );
    const matched = inlinePattern.exec(text);

    if (matched?.[1]?.trim()) {
      return matched[1].trim();
    }
  }

  return '';
};

export const getFallbackTitleFromLogText = (text: string) => {
  const firstMeaningfulLine = text
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstMeaningfulLine) {
    return '';
  }

  return firstMeaningfulLine.replace('QR 코드 인식됨: ', '');
};

export const normalizeStatus = (
  sourceStatus: string,
  completedAt: string,
  actionContent: string,
): ActionStatus => {
  const text = sourceStatus.toLowerCase();

  if (text.includes('완료') || text.includes('complete') || text.includes('done')) {
    return '완료';
  }

  if (text.includes('발생') || text.includes('open') || text.includes('pending')) {
    return '발생';
  }

  if (text.includes('n/a') || text.includes('na') || text.includes('none')) {
    return 'N/A';
  }

  if (completedAt) {
    return '완료';
  }

  if (actionContent === NO_TEXT_MSG) {
    return 'N/A';
  }

  if (actionContent && actionContent !== '-' && actionContent !== WAITING_MSG) {
    return '완료';
  }

  return '발생';
};

export const getNetworkErrorDetail = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'API 응답 시간이 초과되었습니다.';
  }

  if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      return 'API 서버에 연결할 수 없습니다.';
    }

    return error.message;
  }

  return '조치 이력 데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.';
};

export const fetchJsonWithTimeout = async <T,>(
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

export const createDateSummaryRows = (items: ActionHistoryItem[]) => {
  const summaryMap = new Map<string, ActionHistoryItem[]>();

  items.forEach((item) => {
    const date = getDatePart(item.occurredAt);
    const currentItems = summaryMap.get(date) ?? [];

    summaryMap.set(date, [...currentItems, item]);
  });

  return Array.from(summaryMap.entries())
    .map<DateSummaryRow>(([date, groupedItems]) => {
      const durationValues = groupedItems
        .map((item) => item.durationMinutes)
        .filter((value): value is number => value !== null);

      return {
        date,
        total: groupedItems.length,
        occurred: groupedItems.filter((item) => item.status === '발생').length,
        completed: groupedItems.filter((item) => item.status === '완료').length,
        na: groupedItems.filter((item) => item.status === 'N/A').length,
        averageMinutes: getAverage(durationValues),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const getDurationBucketLabel = (minutes: number | null) => {
  if (minutes === null) {
    return 'N/A';
  }

  if (minutes < 10) {
    return '10분 미만';
  }

  if (minutes < 30) {
    return '10~30분';
  }

  if (minutes < 60) {
    return '30~60분';
  }

  return '60분 이상';
};

export const createDurationSummaryRows = (items: ActionHistoryItem[]) => {
  const bucketOrder = ['10분 미만', '10~30분', '30~60분', '60분 이상', 'N/A'];
  const summaryMap = new Map<string, ActionHistoryItem[]>();

  items.forEach((item) => {
    const label = getDurationBucketLabel(item.durationMinutes);
    const currentItems = summaryMap.get(label) ?? [];

    summaryMap.set(label, [...currentItems, item]);
  });

  return bucketOrder.map<DurationSummaryRow>((label) => {
    const groupedItems = summaryMap.get(label) ?? [];

    return {
      label,
      total: groupedItems.length,
      occurred: groupedItems.filter((item) => item.status === '발생').length,
      completed: groupedItems.filter((item) => item.status === '완료').length,
      na: groupedItems.filter((item) => item.status === 'N/A').length,
    };
  });
};

export const createActionHistoryItemFromLog = (
  log: LogItem,
  context: ActionHistoryContext,
): ActionHistoryItem => {
  const fullText = log.fullLogText || '';
  const occurredAt = normalizeDateTime(
    extractFieldFromText(fullText, ['발생시각', '발생시간', '시작시각', '시작시간']) ||
      log.time,
  );
  const completedAt = normalizeDateTime(
    extractFieldFromText(fullText, ['완료시각', '완료시간', '종료시각', '종료시간']),
  );
  const durationMinutes =
    parseDurationMinutes(
      extractFieldFromText(fullText, ['조치시간', '수리시간', '소요시간', '처리시간']),
    ) ?? calculateDurationMinutes(occurredAt, completedAt);
  const fallbackTitle =
    log.title.replace('QR 코드 인식됨: ', '') ||
    getFallbackTitleFromLogText(fullText) ||
    log.id.replace(/\.[^/.]+$/u, '');
  const facilityName =
    extractFieldFromText(fullText, [
      '설비명',
      '장비명',
      '설비',
      '라인명',
      '라인',
      '현장',
    ]) || '-';
  const alarmName =
    extractFieldFromText(fullText, [
      '알람명',
      '알람',
      '불량명',
      '불량유형',
      '이상명',
      '작업명',
      'QR',
    ]) || fallbackTitle;
  const phenomenon =
    extractFieldFromText(fullText, [
      '현상',
      '불량현상',
      '이상현상',
      '증상',
      '내용',
      '불량내용',
    ]) || fallbackTitle;
  const actionContent =
    extractFieldFromText(fullText, [
      '조치내용',
      '수리내용',
      '처리내용',
      '대응내용',
      '조치',
      '수리',
    ]) ||
    log.desc ||
    '-';
  const status = normalizeStatus(
    extractFieldFromText(fullText, ['상태', '진행상태', '처리상태']),
    completedAt,
    actionContent,
  );

  return {
    id: log.id,
    context,
    occurredAt,
    completedAt,
    durationMinutes,
    facilityName,
    alarmName,
    phenomenon,
    actionContent,
    status,
    reportTitle: alarmName || fallbackTitle,
    fullLogText: fullText,
    videoTitle: log.videoTitle,
    videoSrc: log.videoSrc,
    videoReady: log.videoReady,
    sourceLog: log,
  };
};

export const buildReportHtml = (
  item: ActionHistoryItem,
  meta: ActionContextMeta,
  generatedAt: Date,
) => {
  const rows = [
    ['발생시각', formatDateTime(item.occurredAt)],
    ['완료시각', item.completedAt ? formatDateTime(item.completedAt) : '-'],
    ['조치시간', formatDuration(item.durationMinutes)],
    ['설비명', item.facilityName],
    ['알람명', item.alarmName],
    ['상태', item.status],
    ['영상 파일', item.videoTitle],
  ];

  const generatedAtLabel = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(generatedAt);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(meta.reportTitle)}</title>
    <style>
      @page { size: A4; margin: 18mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #111827;
        font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
        line-height: 1.65;
      }
      .eyebrow {
        color: #2563eb;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      h1 {
        margin: 6px 0 8px;
        font-size: 28px;
        letter-spacing: -0.04em;
      }
      .meta {
        margin-bottom: 24px;
        color: #64748b;
        font-size: 13px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 18px 0 24px;
      }
      th, td {
        padding: 12px 14px;
        border: 1px solid #e5e7eb;
        text-align: left;
        vertical-align: top;
      }
      th {
        width: 140px;
        background: #f8fafc;
        color: #475569;
        font-size: 13px;
      }
      td {
        color: #111827;
        font-size: 14px;
      }
      h2 {
        margin: 22px 0 8px;
        font-size: 18px;
        letter-spacing: -0.03em;
      }
      .box {
        min-height: 96px;
        padding: 14px 16px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        background: #f8fafc;
        white-space: pre-wrap;
      }
      .footer {
        margin-top: 28px;
        color: #94a3b8;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="eyebrow">${escapeHtml(meta.badge)}</div>
    <h1>${escapeHtml(meta.reportTitle)}</h1>
    <div class="meta">보고서 생성시각: ${escapeHtml(generatedAtLabel)} · 이력 ID: ${escapeHtml(item.id)}</div>

    <table>
      <tbody>
        ${rows
          .map(
            ([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
          )
          .join('')}
      </tbody>
    </table>

    <h2>현상</h2>
    <div class="box">${escapeHtml(item.phenomenon || '-')}</div>

    <h2>조치내용</h2>
    <div class="box">${escapeHtml(item.actionContent || '-')}</div>

    ${
      item.fullLogText
        ? `<h2>원문 로그</h2><div class="box">${escapeHtml(item.fullLogText)}</div>`
        : ''
    }

    <div class="footer">스마트팩토리 조치이력 시스템에서 생성된 보고서입니다.</div>
  </body>
</html>`;
};

export const getContextFromSearchParams = (value: string | null): ActionHistoryContext => {
  return value === 'no-work' ? 'no-work' : 'defect-tracking';

};
