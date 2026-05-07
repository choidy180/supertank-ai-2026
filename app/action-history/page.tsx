'use client';

import type { ChangeEvent, ComponentProps } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaFilePdf,
  FaRegClock,
  FaSpinner,
} from 'react-icons/fa';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';
import { IoAlertCircle, IoCloseSharp } from 'react-icons/io5';

import VideoThumbnail from '@/components/video-thumbnail';
import { useDateFilterStore } from '@/store/useDateFilterStore';
import { useThemeStore } from '@/store/useThemeStore';
import HeaderSection from '@/components/realtime-defect-status/HeaderSection';

/* ===========================
    Types & API Base
=========================== */

const API_BASE = 'http://192.168.10.175:5000';
const API_TIMEOUT_MS = 7000;

const WAITING_MSG = '현재 텍스트를 STT로 변환중 입니다';
const NO_TEXT_MSG = '변환된 텍스트가 없습니다';

type ActionHistoryContext = 'defect-tracking' | 'no-work';
type ActionStatus = '발생' | '완료' | 'N/A';
type ModalStep = 'closed' | 'video';
type ThemeMode = 'light' | 'dark';

type DateFilterRange = {
  startDate: string;
  endDate: string;
  startDateTime: string;
  endDateTime: string;
  apiStartDateTime: string;
  apiEndDateTime: string;
};

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
  raw?: ApiLogItem;
};

type ActionHistoryItem = {
  id: string;
  context: ActionHistoryContext;
  occurredAt: string;
  completedAt: string;
  durationMinutes: number | null;
  facilityName: string;
  alarmName: string;
  phenomenon: string;
  actionContent: string;
  status: ActionStatus;
  reportTitle: string;
  fullLogText: string;
  videoTitle: string;
  videoSrc: string;
  videoReady: boolean;
  sourceLog: LogItem;
};

type DateSummaryRow = {
  date: string;
  total: number;
  occurred: number;
  completed: number;
  na: number;
  averageMinutes: number | null;
};

type DurationSummaryRow = {
  label: string;
  total: number;
  occurred: number;
  completed: number;
  na: number;
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

type ActionContextMeta = {
  badge: string;
  title: string;
  description: string;
  primaryLabel: string;
  emptyText: string;
  reportButtonLabel: string;
  reportTitle: string;
  filePrefix: string;
  searchPlaceholder: string;
};

type ActionHistoryThemeStyle = {
  colorScheme: ThemeMode;
  background: string;
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
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  shadow: string;
  shadowStrong: string;
  focus: string;
  overlay: string;
  skeleton: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

/* ===========================
    Theme
=========================== */

const ACTION_HISTORY_THEME_STYLES: Record<ThemeMode, ActionHistoryThemeStyle> = {
  light: {
    colorScheme: 'light',
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceElevated: 'rgba(255, 255, 255, 0.86)',
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
    shadowStrong: '0 24px 70px rgba(15, 23, 42, 0.16)',
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
    surfaceElevated: 'rgba(17, 24, 39, 0.86)',
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
    shadowStrong: '0 24px 70px rgba(0, 0, 0, 0.34)',
    focus: 'rgba(147, 197, 253, 0.24)',
    overlay: 'rgba(2, 6, 23, 0.68)',
    skeleton: '#273449',
    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
  },
};

const getActionHistoryTheme = (isDark: boolean) =>
  isDark ? ACTION_HISTORY_THEME_STYLES.dark : ACTION_HISTORY_THEME_STYLES.light;

const createActionHistoryThemeVars = (theme: ActionHistoryThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --history-bg: ${theme.background};
  --history-surface: ${theme.surface};
  --history-surface-elevated: ${theme.surfaceElevated};
  --history-surface-muted: ${theme.surfaceMuted};
  --history-surface-hover: ${theme.surfaceHover};

  --history-border: ${theme.border};
  --history-border-strong: ${theme.borderStrong};

  --history-text-primary: ${theme.textPrimary};
  --history-text-secondary: ${theme.textSecondary};
  --history-text-tertiary: ${theme.textTertiary};

  --history-accent: ${theme.accent};
  --history-accent-soft: ${theme.accentSoft};
  --history-on-accent: ${theme.onAccent};

  --history-success: ${theme.success};
  --history-success-soft: ${theme.successSoft};

  --history-danger: ${theme.danger};
  --history-danger-soft: ${theme.dangerSoft};

  --history-warning: ${theme.warning};
  --history-warning-soft: ${theme.warningSoft};

  --history-shadow: ${theme.shadow};
  --history-shadow-strong: ${theme.shadowStrong};
  --history-focus: ${theme.focus};
  --history-overlay: ${theme.overlay};
  --history-skeleton: ${theme.skeleton};

  --history-scrollbar-thumb: ${theme.scrollbarThumb};
  --history-scrollbar-thumb-hover: ${theme.scrollbarThumbHover};
`;

const GlobalBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createActionHistoryThemeVars(getActionHistoryTheme($isDark))}
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #__next {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  body {
    margin: 0;
    background: var(--history-bg);
    color: var(--history-text-primary);
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
    background: var(--history-scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    border: 2px solid transparent;
    background: var(--history-scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  ::selection {
    background: var(--history-accent-soft);
    color: var(--history-text-primary);
  }
`;

function Global() {
  const isDark = useThemeStore((state) => state.isDark);

  return <GlobalBase $isDark={isDark} />;
}

/* ===========================
    Constants
=========================== */

const ACTION_CONTEXT_META: Record<ActionHistoryContext, ActionContextMeta> = {
  'defect-tracking': {
    badge: '불량역추적',
    title: '불량역추적 조치 이력',
    description:
      '기존 조치 영상 리스트는 그대로 유지하면서 날짜별·조치시간별 Summary와 수리 이력 보고서를 함께 제공합니다.',
    primaryLabel: '수리 이력',
    emptyText: '선택한 기간에 등록된 불량역추적 조치 영상이 없습니다.',
    reportButtonLabel: '수리 이력 보고서 PDF',
    reportTitle: '불량역추적 수리 이력 보고서',
    filePrefix: 'defect_action_history',
    searchPlaceholder: 'QR 코드, 파일명, 설비명, 현상, 조치내용 검색',
  },
  'no-work': {
    badge: '무작업관리',
    title: '무작업관리 조치 이력',
    description:
      '무작업 알람의 발생시각, 완료시각, 조치시간, 설비명, 알람명, 현상, 조치내용, 상태를 영상 리스트와 함께 확인합니다.',
    primaryLabel: '조치 이력',
    emptyText: '선택한 기간에 등록된 무작업관리 조치 영상이 없습니다.',
    reportButtonLabel: '조치 보고서 PDF',
    reportTitle: '무작업관리 조치 이력 보고서',
    filePrefix: 'no_work_action_history',
    searchPlaceholder: '설비명, 알람명, 현상, 조치내용, 파일명 검색',
  },
};

const STATUS_META: Record<
  ActionStatus,
  {
    label: ActionStatus;
    color: string;
    background: string;
    border: string;
  }
> = {
  발생: {
    label: '발생',
    color: 'var(--history-warning)',
    background: 'var(--history-warning-soft)',
    border: 'var(--history-warning)',
  },
  완료: {
    label: '완료',
    color: 'var(--history-success)',
    background: 'var(--history-success-soft)',
    border: 'var(--history-success)',
  },
  'N/A': {
    label: 'N/A',
    color: 'var(--history-text-tertiary)',
    background: 'var(--history-surface-muted)',
    border: 'var(--history-border-strong)',
  },
};

const DATE_SUMMARY_HEADERS = [
  '날짜',
  '전체',
  '발생',
  '완료',
  'N/A',
  '평균 조치시간(분)',
];

const DURATION_SUMMARY_HEADERS = [
  '조치시간 구간',
  '전체',
  '발생',
  '완료',
  'N/A',
];

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
    Helpers
=========================== */

const formatTimeDisplay = (timeStr: string) => {
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

const parseDate = (value: unknown) => {
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

const formatDateTime = (value: string) => {
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

const formatDateLabel = (value: string) => {
  if (!value) {
    return '-';
  }

  return value.replace(/-/gu, '. ');
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

const toFiniteNumber = (value: unknown) => {
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

const parseDurationMinutes = (value: unknown) => {
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

const calculateDurationMinutes = (start: string, end: string) => {
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

const formatDuration = (minutes: number | null) => {
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

const formatAverageMinutes = (minutes: number | null) => {
  if (minutes === null || !Number.isFinite(minutes)) {
    return '-';
  }

  return minutes.toFixed(1);
};

const getAverage = (values: number[]) => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const getDatePart = (dateTime: string) => {
  return normalizeDateTime(dateTime).split(' ')[0] || '-';
};

const isWithinRange = (dateTime: string, range: DateFilterRange) => {
  const normalized = normalizeDateTime(dateTime);

  if (!normalized) {
    return false;
  }

  return normalized >= range.startDateTime && normalized <= range.endDateTime;
};

const escapeCsv = (value: string | number | null) => {
  const text = value === null ? '' : String(value);

  return `"${text.replace(/"/gu, '""')}"`;
};

const createCsv = (headers: string[], rows: Array<Array<string | number | null>>) => {
  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(cell)).join(','))
    .join('\n');
};

const downloadTextFile = (filename: string, content: string, type: string) => {
  const blob = new Blob(['\ufeff', content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const sanitizeFilename = (value: string) => {
  return value.replace(/[\\/:*?"<>|\s]+/gu, '_').replace(/_+/gu, '_');
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&#039;');
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
};

const extractFieldFromText = (text: string, labels: string[]) => {
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

const getFallbackTitleFromLogText = (text: string) => {
  const firstMeaningfulLine = text
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean);

  if (!firstMeaningfulLine) {
    return '';
  }

  return firstMeaningfulLine.replace('QR 코드 인식됨: ', '');
};

const normalizeStatus = (
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

  return '조치 이력 데이터를 가져오는 중 알 수 없는 오류가 발생했습니다.';
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

const createDateSummaryRows = (items: ActionHistoryItem[]) => {
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

const getDurationBucketLabel = (minutes: number | null) => {
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

const createDurationSummaryRows = (items: ActionHistoryItem[]) => {
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

const createActionHistoryItemFromLog = (
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

const buildReportHtml = (
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
        font-weight: 800;
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

const getContextFromSearchParams = (value: string | null): ActionHistoryContext => {
  return value === 'no-work' ? 'no-work' : 'defect-tracking';
};

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
  color: var(--history-accent);
  font-weight: 900;
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
    Sub Components
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
              접기 <FaChevronUp size={14} />
            </>
          ) : (
            <>
              더보기 <FaChevronDown size={14} />
            </>
          )}
        </ToggleButton>
      )}
    </DescWrapper>
  );
};

const SkeletonCard = () => {
  return (
    <HistoryCard>
      <SkeletonThumb />

      <HistoryCardBody>
        <SkeletonLine $width="72%" $height="28px" />
        <SkeletonLine $width="42%" $height="18px" />
        <SkeletonLine $width="100%" $height="18px" />
        <SkeletonLine $width="88%" $height="18px" />
      </HistoryCardBody>
    </HistoryCard>
  );
};

/* ===========================
    Page Component
=========================== */

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

  const dateRange = useMemo(() => {
    return getDateRange();
  }, [endDate, getDateRange, startDate]);

  const [now, setNow] = useState(() => new Date());
  const [allLogs, setAllLogs] = useState<LogItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const loadedIdsRef = useRef<Set<string>>(new Set());
  const logsRef = useRef<LogItem[]>([]);

  const [networkError, setNetworkError] = useState<NetworkErrorState | null>(
    null,
  );

  const networkDismissedRef = useRef(false);
  const pollingPausedRef = useRef(false);

  const [modalStep, setModalStep] = useState<ModalStep>('closed');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoSrc, setCurrentVideoSrc] = useState('');
  const [selectedItem, setSelectedItem] = useState<ActionHistoryItem | null>(
    null,
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    logsRef.current = allLogs;
  }, [allLogs]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

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
      raw: item,
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
              let nextLogs = [...prev];

              const allSttUpdates = [...updatedSttLogs, ...sttTimeoutUpdates];

              if (allSttUpdates.length > 0) {
                nextLogs = nextLogs.map((log) => {
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
                nextLogs = nextLogs.map((log) => {
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

  useEffect(() => {
    if (!selectedItem && modalStep === 'closed' && !networkError) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalStep, networkError, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeVideoModal();
        setSelectedItem(null);
        setNetworkError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionItems = useMemo(() => {
    return allLogs
      .map((log) => createActionHistoryItemFromLog(log, context))
      .filter((item) => isWithinRange(item.occurredAt, dateRange))
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [allLogs, context, dateRange.endDateTime, dateRange.startDateTime]);

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

  const dateSummaryRows = useMemo(() => {
    return createDateSummaryRows(filteredItems);
  }, [filteredItems]);

  const durationSummaryRows = useMemo(() => {
    return createDurationSummaryRows(filteredItems);
  }, [filteredItems]);

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

  const handleRefresh = () => {
    pollingPausedRef.current = false;
    networkDismissedRef.current = false;
    setNetworkError(null);

    if (allLogs.length === 0) {
      setIsInitialLoading(true);
    }

    setRetryKey((prev) => prev + 1);
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
    setModalStep('video');

    window.setTimeout(() => {
      videoRef.current?.play().catch(() => {});
    }, 150);
  };

  const closeVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setModalStep('closed');
  };

  return (
    <>
      <Global />

      <PageShell>
        <HeaderSection
          summaryCards={headerSummaryCards}
          now={now}
          isDark={isDark}
        />

        <ContentFrame>
          <PageHero>
            <HeroTextGroup>
              <Eyebrow>{contextMeta.badge}</Eyebrow>
              <PageTitle>{contextMeta.title}</PageTitle>
              <PageDescription>{contextMeta.description}</PageDescription>
            </HeroTextGroup>

            <ContextSwitch aria-label="조치 이력 컨텍스트 선택">
              <ContextLink
                href="/action-history?context=defect-tracking"
                $active={context === 'defect-tracking'}
              >
                불량역추적
              </ContextLink>
              <ContextLink
                href="/action-history?context=no-work"
                $active={context === 'no-work'}
              >
                무작업관리
              </ContextLink>
            </ContextSwitch>
          </PageHero>

          <Toolbar>
            <SearchBox>
              <FiSearch size={19} />
              <input
                type="text"
                value={keyword}
                placeholder={contextMeta.searchPlaceholder}
                onChange={handleKeywordChange}
              />
            </SearchBox>

            <ToolbarActions>
              <GhostButton type="button" onClick={handleDownloadDateSummary}>
                <FaDownload size={14} />
                날짜 Summary
              </GhostButton>

              <GhostButton type="button" onClick={handleDownloadDurationSummary}>
                <FaDownload size={14} />
                조치시간 Summary
              </GhostButton>

              <PrimaryButton type="button" onClick={handleRefresh} disabled={isInitialLoading}>
                {isInitialLoading ? <FaSpinner className="spinner" size={14} /> : <FiRefreshCw size={15} />}
                새로고침
              </PrimaryButton>
            </ToolbarActions>
          </Toolbar>

          <MainGrid>
            <LeftPanel>
              <HistorySection>
                <SectionHeader>
                  <SectionTitleGroup>
                    <SectionTitle>{contextMeta.primaryLabel} 영상 리스트</SectionTitle>
                    <SectionCaption>
                      영상 리스트는 왼쪽에서 확인하고, 날짜별·조치시간 Summary는 오른쪽에서 확인합니다. 항목 클릭 시 상세 팝업, 영상 확인, PDF 보고서를 사용할 수 있습니다.
                    </SectionCaption>
                  </SectionTitleGroup>

                  <ResultCount>
                    <strong>{filteredItems.length}</strong>건
                  </ResultCount>
                </SectionHeader>

                <HistoryList>
                  {isInitialLoading && allLogs.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  ) : filteredItems.length === 0 ? (
                    <EmptyBox>{contextMeta.emptyText}</EmptyBox>
                  ) : (
                    filteredItems.map((item) => {
                      const { date, time } = formatTimeDisplay(item.occurredAt);

                      return (
                        <HistoryCard
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          $clickable
                          onClick={() => setSelectedItem(item)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setSelectedItem(item);
                            }
                          }}
                        >
                          <Thumb>
                            <VideoThumbnail
                              videoUrl={item.videoSrc}
                              width="100%"
                              height="100%"
                              className="thumb-img"
                            />
                          </Thumb>

                          <HistoryCardBody>
                            <CardTop>
                              <CardTitleGroup>
                                <CardTitle>
                                  조치보고: {item.reportTitle.replace('QR 코드 인식됨: ', '')}
                                </CardTitle>
                                <CardMetaRow>
                                  <span>{date}</span>
                                  <span className="sep">|</span>
                                  <span>{time}</span>
                                  <span className="sep">|</span>
                                  <span>{formatDuration(item.durationMinutes)}</span>
                                </CardMetaRow>
                              </CardTitleGroup>

                              <StatusPill $status={item.status}>{item.status}</StatusPill>
                            </CardTop>

                            <InfoGrid>
                              <InfoItem>
                                <span>발생시각</span>
                                <strong>{formatDateTime(item.occurredAt)}</strong>
                              </InfoItem>
                              <InfoItem>
                                <span>완료시각</span>
                                <strong>{item.completedAt ? formatDateTime(item.completedAt) : '-'}</strong>
                              </InfoItem>
                              <InfoItem>
                                <span>설비명</span>
                                <strong>{item.facilityName}</strong>
                              </InfoItem>
                              <InfoItem>
                                <span>알람명</span>
                                <strong>{item.alarmName}</strong>
                              </InfoItem>
                            </InfoGrid>

                            <PhenomenonLine title={item.phenomenon}>
                              <span>현상</span>
                              <strong>{item.phenomenon}</strong>
                            </PhenomenonLine>

                            <ExpandableDesc text={item.actionContent} />

                            <CardActions>
                              <ReportButton
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDownloadReportPdf(item);
                                }}
                              >
                                <FaFilePdf size={14} />
                                PDF
                              </ReportButton>

                              <VideoBtn
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openVideoModal(item);
                                }}
                                $ready={item.videoReady}
                                disabled={!item.videoReady}
                              >
                                {item.videoReady ? (
                                  <>
                                    <FaCheckCircle size={18} />
                                    <span>영상 확인</span>
                                  </>
                                ) : (
                                  <>
                                    <FaSpinner className="spinner" size={18} />
                                    <span>영상 생성중</span>
                                  </>
                                )}
                              </VideoBtn>
                            </CardActions>
                          </HistoryCardBody>
                        </HistoryCard>
                      );
                    })
                  )}
                </HistoryList>
              </HistorySection>
            </LeftPanel>

            <RightSummaryPanel>
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

                  <MiniDownloadButton type="button" onClick={handleDownloadDateSummary}>
                    다운로드
                  </MiniDownloadButton>
                </SummaryPanelHeader>

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
                      {dateSummaryRows.length === 0 ? (
                        <tr>
                          <td colSpan={6}>표시할 Summary가 없습니다.</td>
                        </tr>
                      ) : (
                        dateSummaryRows.map((row) => (
                          <tr key={row.date}>
                            <td>{formatDateLabel(row.date)}</td>
                            <td>{row.total}</td>
                            <td>{row.occurred}</td>
                            <td>{row.completed}</td>
                            <td>{row.na}</td>
                            <td>{formatDuration(row.averageMinutes)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </SummaryTable>
                </SummaryTableWrapper>
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

                  <MiniDownloadButton type="button" onClick={handleDownloadDurationSummary}>
                    다운로드
                  </MiniDownloadButton>
                </SummaryPanelHeader>

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
                            filteredItems.length > 0
                              ? Math.round((row.total / filteredItems.length) * 100)
                              : 0
                          }
                        />
                      </BucketTrack>
                    </DurationBucket>
                  ))}
                </DurationBucketList>
              </SummaryPanel>
            </RightSummaryPanel>
          </MainGrid>
        </ContentFrame>
      </PageShell>

      {selectedItem && (
        <ModalDim onClick={() => setSelectedItem(null)}>
          <DetailModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitleGroup>
                <ModalEyebrow>{contextMeta.badge}</ModalEyebrow>
                <ModalTitle id="history-detail-title">
                  {selectedItem.reportTitle}
                </ModalTitle>
              </ModalTitleGroup>

              <CloseButton
                type="button"
                aria-label="상세 팝업 닫기"
                onClick={() => setSelectedItem(null)}
              >
                <IoCloseSharp size={30} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <DetailGrid>
                <DetailItem>
                  <span>발생시각</span>
                  <strong>{formatDateTime(selectedItem.occurredAt)}</strong>
                </DetailItem>
                <DetailItem>
                  <span>완료시각</span>
                  <strong>{selectedItem.completedAt ? formatDateTime(selectedItem.completedAt) : '-'}</strong>
                </DetailItem>
                <DetailItem>
                  <span>조치시간</span>
                  <strong>{formatDuration(selectedItem.durationMinutes)}</strong>
                </DetailItem>
                <DetailItem>
                  <span>상태</span>
                  <StatusPill $status={selectedItem.status}>{selectedItem.status}</StatusPill>
                </DetailItem>
                <DetailItem>
                  <span>설비명</span>
                  <strong>{selectedItem.facilityName}</strong>
                </DetailItem>
                <DetailItem>
                  <span>알람명</span>
                  <strong>{selectedItem.alarmName}</strong>
                </DetailItem>
              </DetailGrid>

              <DetailSection>
                <DetailSectionTitle>현상</DetailSectionTitle>
                <DetailText>{selectedItem.phenomenon || '-'}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailSectionTitle>조치내용</DetailSectionTitle>
                <DetailText>{selectedItem.actionContent || '-'}</DetailText>
              </DetailSection>

              {selectedItem.fullLogText && (
                <DetailSection>
                  <DetailSectionTitle>원문 로그</DetailSectionTitle>
                  <DetailText>{selectedItem.fullLogText}</DetailText>
                </DetailSection>
              )}

              <DetailSection>
                <DetailSectionTitle>조치 영상</DetailSectionTitle>
                {selectedItem.videoReady ? (
                  <VideoBox controls>
                    <source src={selectedItem.videoSrc} type="video/mp4" />
                    브라우저가 비디오 재생을 지원하지 않습니다.
                  </VideoBox>
                ) : (
                  <DetailText>영상 생성 중입니다. 잠시 후 다시 확인해주세요.</DetailText>
                )}
              </DetailSection>
            </ModalBody>

            <ModalActions>
              <GhostButton type="button" onClick={() => setSelectedItem(null)}>
                닫기
              </GhostButton>
              <PrimaryButton
                type="button"
                onClick={() => handleDownloadReportPdf(selectedItem)}
              >
                <FaFilePdf size={14} />
                {contextMeta.reportButtonLabel}
              </PrimaryButton>
            </ModalActions>
          </DetailModal>
        </ModalDim>
      )}

      {modalStep === 'video' && (
        <ModalDim onClick={closeVideoModal}>
          <VideoModal onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentVideoTitle}</h3>

              <CloseButton
                type="button"
                aria-label="영상 모달 닫기"
                onClick={closeVideoModal}
              >
                <IoCloseSharp size={30} />
              </CloseButton>
            </div>

            <div className="modal-body">
              <div className="video-container">
                <video ref={videoRef} controls autoPlay>
                  <source src={currentVideoSrc} type="video/mp4" />
                  브라우저가 비디오 재생을 지원하지 않습니다.
                </video>
              </div>
            </div>
          </VideoModal>
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
              조치 이력 데이터를 불러오지 못했습니다
            </NetworkTitle>

            <NetworkText>
              로그 서버와 연결이 원활하지 않아 영상 리스트를 불러오지 못했습니다.
              <br />
              네트워크 상태 또는 API 서버 연결을 확인해주세요.
            </NetworkText>

            {networkError.detail && <NetworkDetail>{networkError.detail}</NetworkDetail>}

            <NetworkActions>
              <GhostButton type="button" onClick={handleCloseNetworkModal}>
                닫기
              </GhostButton>

              <PrimaryButton type="button" onClick={handleRetryNetwork}>
                다시 시도
              </PrimaryButton>
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

const oneLine = css`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  min-height: 0;
  overflow: hidden;
  padding: 24px;
  background:
    radial-gradient(circle at 8% 0%, var(--history-accent-soft), transparent 30%),
    var(--history-bg);
  color: var(--history-text-primary);

  @media (max-width: 768px) {
    gap: 14px;
    padding: 14px;
  }
`;

const ContentFrame = styled.section`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const PageHero = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--history-border);
  border-radius: 24px;
  background: var(--history-surface-elevated);
  box-shadow: var(--history-shadow);
  backdrop-filter: blur(18px) saturate(1.08);

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

const HeroTextGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 28px;
  padding: 0 11px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface);
  color: var(--history-accent);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--history-text-primary);
  font-size: clamp(26px, 2.3vw, 38px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.055em;
`;

const PageDescription = styled.p`
  max-width: 860px;
  margin: 0;
  color: var(--history-text-secondary);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.55;
  word-break: keep-all;
`;

const ContextSwitch = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface-muted);
`;

const ContextLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 15px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--history-surface)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'var(--history-text-primary)' : 'var(--history-text-secondary)'};
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: ${({ $active }) => ($active ? 'var(--history-shadow)' : 'none')};
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    color: var(--history-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 62px;
  padding: 10px;
  border: 1px solid var(--history-border);
  border-radius: 20px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);

  @media (max-width: 980px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(540px, 100%);
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface-muted);
  color: var(--history-text-tertiary);
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-within {
    border-color: var(--history-accent);
    background: var(--history-surface);
  }

  input {
    width: 100%;
    min-width: 0;
    height: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--history-text-primary);
    font-size: 14px;
    font-weight: 750;

    &::placeholder {
      color: var(--history-text-tertiary);
    }
  }

  @media (max-width: 980px) {
    width: 100%;
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 430px);
  gap: 16px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1320px) {
    grid-template-columns: minmax(0, 1fr) minmax(330px, 390px);
  }

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) minmax(260px, 34vh);
  }
`;

const LeftPanel = styled.section`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const RightSummaryPanel = styled.aside`
  display: grid;
  grid-template-rows: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 1fr;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

const ButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.52;
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const GhostButton = styled(ButtonBase)`
  border: 1px solid var(--history-border);
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);

  &:hover:not(:disabled) {
    border-color: var(--history-border-strong);
    background: var(--history-surface-hover);
    color: var(--history-text-primary);
  }
`;

const PrimaryButton = styled(ButtonBase)`
  border: 1px solid var(--history-accent);
  background: var(--history-accent);
  color: var(--history-on-accent);
`;

const SummaryPanel = styled.article`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 14px;
  border: 1px solid var(--history-border);
  border-radius: 20px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
`;

const SummaryPanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const SummaryTitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;

const SummaryIcon = styled.div`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 1px solid var(--history-accent);
  border-radius: 13px;
  background: var(--history-accent-soft);
  color: var(--history-accent);
`;

const SummaryTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 16px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
`;

const SummaryCaption = styled.p`
  margin: 2px 0 0;
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
`;

const MiniDownloadButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--history-surface-hover);
    color: var(--history-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }
`;

const SummaryTableWrapper = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px 8px;
    border-bottom: 1px solid var(--history-border);
    color: var(--history-text-secondary);
    font-size: 12px;
    font-weight: 800;
    text-align: right;
    white-space: nowrap;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  th {
    color: var(--history-text-tertiary);
    font-size: 11px;
    letter-spacing: 0.04em;
  }

  td:first-child {
    color: var(--history-text-primary);
    font-weight: 900;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const DurationBucketList = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;
`;

const DurationBucket = styled.div`
  display: grid;
  gap: 6px;
  padding: 10px;
  border: 1px solid var(--history-border);
  border-radius: 15px;
  background: var(--history-surface-muted);
`;

const BucketTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  strong {
    color: var(--history-text-primary);
    font-size: 13px;
    font-weight: 900;
  }

  span {
    color: var(--history-accent);
    font-size: 12px;
    font-weight: 900;
  }
`;

const BucketMeta = styled.div`
  color: var(--history-text-secondary);
  font-size: 11px;
  font-weight: 750;
`;

const BucketTrack = styled.div`
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--history-surface);
`;

const BucketFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: var(--history-accent);
  transition: width 180ms ease;
`;

const HistorySection = styled.article`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
  padding: 14px;
  border: 1px solid var(--history-border);
  border-radius: 22px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const SectionTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 19px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
`;

const SectionCaption = styled.p`
  margin: 0;
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const ResultCount = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;

  strong {
    color: var(--history-text-primary);
    font-weight: 900;
  }
`;

const HistoryList = styled.div`
  display: grid;
  gap: 12px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 6px;
`;

const HistoryCard = styled.article<{ $clickable?: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--history-border);
  border-radius: 20px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: ${({ $clickable }) => ($clickable ? 'translateY(-1px)' : 'none')};
    border-color: ${({ $clickable }) =>
      $clickable ? 'var(--history-border-strong)' : 'var(--history-border)'};
    background: ${({ $clickable }) =>
      $clickable ? 'var(--history-surface-hover)' : 'var(--history-surface)'};
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Thumb = styled.div`
  min-height: 154px;
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface-muted);

  img,
  div.thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const HistoryCardBody = styled.div`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

const CardTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

const CardTitle = styled.h3`
  ${oneLine};

  margin: 0;
  color: var(--history-text-primary);
  font-size: 20px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
`;

const CardMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--history-text-secondary);
  font-size: 13px;
  font-weight: 800;

  .sep {
    color: var(--history-border-strong);
    font-weight: 400;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--history-border);
  border-radius: 13px;
  background: var(--history-surface-muted);

  span {
    color: var(--history-text-tertiary);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.04em;
  }

  strong {
    ${oneLine};

    color: var(--history-text-primary);
    font-size: 12px;
    font-weight: 900;
  }
`;

const PhenomenonLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 2px;

  span {
    flex: 0 0 auto;
    color: var(--history-text-tertiary);
    font-size: 12px;
    font-weight: 900;
  }

  strong {
    ${oneLine};

    color: var(--history-text-secondary);
    font-size: 13px;
    font-weight: 800;
  }
`;

const DescWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 44px;
`;

const TextContainer = styled.div<{
  $expanded: boolean;
  $isWaiting?: boolean;
}>`
  width: 100%;
  overflow: hidden;
  color: var(--history-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  transition:
    max-height 240ms ease,
    opacity 240ms ease;

  ${({ $expanded }) =>
    $expanded
      ? css`
          display: block;
          max-height: 520px;
          opacity: 1;
          -webkit-line-clamp: unset;
        `
      : css`
          display: -webkit-box;
          max-height: 3.1em;
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
  gap: 7px;
  margin-top: 4px;
  padding: 5px 0;
  color: var(--history-accent);
  font-size: 12px;
  font-weight: 900;

  &:hover {
    opacity: 0.82;
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

const VideoBtn = styled.button<{ $ready?: boolean }>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid
    ${({ $ready }) =>
      $ready ? 'var(--history-accent)' : 'var(--history-border)'};
  border-radius: 999px;
  background: ${({ $ready }) =>
    $ready ? 'var(--history-accent)' : 'var(--history-surface-muted)'};
  color: ${({ $ready }) =>
    $ready ? 'var(--history-on-accent)' : 'var(--history-text-secondary)'};
  font-size: 13px;
  font-weight: 900;
  cursor: ${({ $ready }) => ($ready ? 'pointer' : 'not-allowed')};
  transition:
    transform 160ms ease,
    opacity 160ms ease;

  &:hover {
    transform: ${({ $ready }) => ($ready ? 'translateY(-1px)' : 'none')};
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }
`;

const ReportButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 13px;
  font-weight: 900;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--history-danger);
    background: var(--history-danger-soft);
    color: var(--history-danger);
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }
`;

const StatusPill = styled.span<{ $status: ActionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $status }) => STATUS_META[$status].border};
  border-radius: 999px;
  background: ${({ $status }) => STATUS_META[$status].background};
  color: ${({ $status }) => STATUS_META[$status].color};
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
`;

const EmptyBox = styled.div`
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 36px;
  border: 1px dashed var(--history-border-strong);
  border-radius: 18px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  word-break: keep-all;
`;

/* ====== Skeleton Styles ====== */

const SkeletonBlock = css`
  border-radius: 8px;
  background: var(--history-skeleton);
  animation: ${skeletonPulse} 1.4s ease-in-out infinite;
`;

const SkeletonThumb = styled.div`
  ${SkeletonBlock};

  width: 100%;
  min-height: 154px;
  border-radius: 16px;
`;

const SkeletonLine = styled.div<{
  $width?: string;
  $height?: string;
}>`
  ${SkeletonBlock};

  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '18px'};
`;

/* ===========================
    Modal Styles
=========================== */

const ModalDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--history-overlay);
  backdrop-filter: blur(18px) saturate(1.08);
  animation: ${fade} 180ms ease;

  @media (max-width: 720px) {
    padding: 12px;
  }
`;

const DetailModal = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(940px, 100%);
  max-height: min(860px, 92vh);
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 28px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 17px;
  border-bottom: 1px solid var(--history-border);
`;

const ModalTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

const ModalEyebrow = styled.div`
  color: var(--history-accent);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const ModalTitle = styled.h2`
  ${oneLine};

  margin: 0;
  color: var(--history-text-primary);
  font-size: 24px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.045em;
`;

const CloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--history-surface-hover);
    color: var(--history-danger);
  }

  &:focus-visible {
    outline: 3px solid var(--history-focus);
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  display: grid;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 20px 24px;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface-muted);

  span {
    color: var(--history-text-tertiary);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.04em;
  }

  strong {
    ${oneLine};

    color: var(--history-text-primary);
    font-size: 14px;
    font-weight: 900;
  }
`;

const DetailSection = styled.section`
  display: grid;
  gap: 8px;
`;

const DetailSectionTitle = styled.h3`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.03em;
`;

const DetailText = styled.div`
  min-height: 92px;
  padding: 14px 16px;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
`;

const VideoBox = styled.video`
  width: 100%;
  max-height: 440px;
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: #000000;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--history-border);
`;

const VideoModal = styled.div`
  display: flex;
  flex-direction: column;
  width: min(1200px, 92vw);
  max-height: min(840px, 92vh);
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 24px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 220ms cubic-bezier(0.22, 1, 0.36, 1);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 74px;
    padding: 0 24px;
    border-bottom: 1px solid var(--history-border);
    background: var(--history-surface);

    h3 {
      ${oneLine};

      margin: 0;
      color: var(--history-text-primary);
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.04em;
    }
  }

  .modal-body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 0;
    padding: 0;
    background: #000000;

    .video-container {
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: calc(92vh - 74px);
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

const NetworkModalDim = styled(ModalDim)`
  z-index: 1500;
`;

const NetworkModal = styled.div`
  display: grid;
  justify-items: center;
  width: min(520px, 100%);
  padding: 34px 32px 30px;
  border: 1px solid var(--history-border);
  border-radius: 24px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  text-align: center;
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const NetworkIcon = styled.div`
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 18px;
  border: 1px solid var(--history-danger);
  border-radius: 999px;
  background: var(--history-danger-soft);
  color: var(--history-danger);

  svg {
    width: 34px;
    height: 34px;
  }
`;

const NetworkTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 25px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const NetworkText = styled.p`
  margin: 14px 0 0;
  color: var(--history-text-secondary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.6;
  word-break: keep-all;
`;

const NetworkDetail = styled.div`
  width: 100%;
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid var(--history-border);
  border-radius: 14px;
  background: var(--history-surface-muted);
  color: var(--history-text-tertiary);
  font-size: 13px;
  font-weight: 700;
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
