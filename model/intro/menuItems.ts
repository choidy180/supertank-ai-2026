import {
  Boxes,
  Clock3,
  Eye,
  Flame,
  PackageCheck,
  PauseCircle,
} from 'lucide-react';

import type { FactoryMenuItem } from './types';

export const FACTORY_MENU_ITEMS: FactoryMenuItem[] = [
  {
    id: 'realtime-defect-status',
    href: '/realtime-defect-status',
    title: '불량 역추적',
    eyebrow: 'Defect Tracking',
    description:
      '불량 발생 지점과 현장 조치 흐름을 빠르게 확인하고, 원인 추적부터 수리 이력까지 연결합니다.',
    metric: 'A1',
    metricLabel: '품질 추적',
    Icon: Eye,
  },
  {
    id: 'timecheck',
    href: '/timecheck',
    title: '타임체크',
    eyebrow: 'Time Check',
    description:
      '순회 점검 시간, 설비 상태, 담당자 진행률을 한 화면에서 확인하는 현장 체크 모듈입니다.',
    metric: 'A2',
    metricLabel: '순회 점검',
    Icon: Clock3,
  },
  {
    id: 'fire',
    href: '/fire',
    title: '소방관리',
    eyebrow: 'Fire Safety',
    description:
      '소화기, 소화전, 안전 설비의 위치와 점검 상태를 직관적으로 관리합니다.',
    metric: 'A3',
    metricLabel: '안전 설비',
    Icon: Flame,
  },
  {
    id: 'no-work',
    href: '/no-work',
    title: '무작업 관리',
    eyebrow: 'No Work Control',
    description:
      '무작업 구간과 알람 발생 지점을 확인하고 현장 조치 내용을 운영 데이터로 남깁니다.',
    metric: 'A4',
    metricLabel: '알람 대응',
    Icon: PauseCircle,
  },
  {
    id: 'receiving-material',
    href: '/receiving-material',
    title: '자재 입고',
    eyebrow: 'Material Receiving',
    description:
      '거래명세서 확인, 수량 검수, 시스템 입력까지 자재 입고 흐름을 정돈합니다.',
    metric: 'A5',
    metricLabel: '입고 검수',
    Icon: PackageCheck,
  },
  {
    id: 'smes',
    href: '/smes',
    title: 'SMES',
    eyebrow: 'Smart MES',
    description:
      '생산, 품질, 설비 데이터를 통합해 현장 운영 지표를 빠르게 파악합니다.',
    metric: 'A6',
    metricLabel: '운영 지표',
    Icon: Boxes,
  },
];

export const LANDING_STATS = [
  {
    label: '운영 모듈',
    value: '6',
    caption: '핵심 업무 바로 진입',
  },
  {
    label: '테마 기준',
    value: '#2563eb',
    caption: '포인트 컬러 통일',
  },
  {
    label: '다크 베이스',
    value: '#141414',
    caption: '깔끔한 블랙톤',
  },
] as const;
