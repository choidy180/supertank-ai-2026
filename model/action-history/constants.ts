import type { ActionContextMeta, ActionHistoryContext, ActionStatus } from './types';

export const API_BASE = 'http://192.168.10.175:5000';
export const API_TIMEOUT_MS = 7000;

export const WAITING_MSG = '현재 텍스트를 STT로 변환중 입니다';
export const NO_TEXT_MSG = '변환된 텍스트가 없습니다';

export const ACTION_CONTEXT_META: Record<ActionHistoryContext, ActionContextMeta> = {
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

export const STATUS_META: Record<
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

export const DATE_SUMMARY_HEADERS = [
  '날짜',
  '전체',
  '발생',
  '완료',
  'N/A',
  '평균 조치시간(분)',
];

export const DURATION_SUMMARY_HEADERS = [
  '조치시간 구간',
  '전체',
  '발생',
  '완료',
  'N/A',
];
