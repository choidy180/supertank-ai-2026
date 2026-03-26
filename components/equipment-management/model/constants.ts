import { ActionHistoryItem, DowntimeStat, LiveSummary } from './types';

export const LIVE_SUMMARY: LiveSummary = {
  incident: 3,
  processing: 2,
  done: 145
};

export const DOWNTIME_STATS: DowntimeStat[] = [
  {
    id: 'facility-a',
    name: '설비A',
    downtimeMinutes: 224,
    incidents: 12,
    availability: 96.1,
    tone: 'critical'
  },
  {
    id: 'facility-b',
    name: '설비B',
    downtimeMinutes: 128,
    incidents: 7,
    availability: 97.8,
    tone: 'warning'
  },
  {
    id: 'facility-c',
    name: '설비C',
    downtimeMinutes: 54,
    incidents: 3,
    availability: 99.2,
    tone: 'info'
  }
];

export const ACTION_HISTORY: ActionHistoryItem[] = [
  {
    id: 'act-001',
    date: '2026.03.12',
    time: '10:42',
    equipment: 'M-04',
    code: 'E201',
    status: 'incident',
    area: '압착 2라인',
    title: '유압 압력 급락 감지',
    summary: '유압 센서 값이 임계치 아래로 하락해 자동 알림이 발생했습니다.',
    owner: '김현수',
    impact: '라인 대기 6분',
    startedAt: '2026.03.12 10:37',
    updatedAt: '2026.03.12 10:42'
  },
  {
    id: 'act-002',
    date: '2026.03.12',
    time: '10:40',
    equipment: 'P-12',
    code: 'A105',
    status: 'processing',
    area: '포장 1라인',
    title: '라벨러 센서 재보정 진행',
    summary: '센서 오프셋 보정과 테스트 패스 작업이 진행 중입니다.',
    owner: '박수빈',
    impact: '처리율 18% 저하',
    startedAt: '2026.03.12 10:30',
    updatedAt: '2026.03.12 10:40'
  },
  {
    id: 'act-003',
    date: '2026.03.12',
    time: '09:15',
    equipment: 'M-01',
    code: 'E300',
    status: 'done',
    area: '절단 셀',
    title: '메인 모터 과열 조치 완료',
    summary: '냉각 팬 교체 후 테스트 운전 정상 확인, 생산 재개 처리했습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:49',
    updatedAt: '2026.03.12 09:15'
  },
  {
    id: 'act-004',
    date: '2026.03.12',
    time: '08:50',
    equipment: 'K-09',
    code: 'B002',
    status: 'done',
    area: '혼합 탱크 구역',
    title: '밸브 응답 지연 복구',
    summary: '구동 밸브 재시퀀싱 이후 응답 시간이 기준치 안으로 복귀했습니다.',
    owner: '이민재',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:33',
    updatedAt: '2026.03.12 08:50'
  },
  {
    id: 'act-005',
    date: '2026.03.12',
    time: '08:30',
    equipment: 'M-04',
    code: 'E201',
    status: 'done',
    area: '압착 2라인',
    title: '초기 진동 이상 조치 완료',
    summary: '체결부 재고정 후 공회전 점검 결과 기준 범위 내로 안정화되었습니다.',
    owner: '최도윤',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:11',
    updatedAt: '2026.03.12 08:30'
  },
  {
    id: 'act-006',
    date: '2026.03.12',
    time: '08:05',
    equipment: 'A-22',
    code: 'F404',
    status: 'incident',
    area: '검수 라인',
    title: '비전 카메라 프레임 드랍 발생',
    summary: '카메라 통신 지연으로 검사 이미지 유실이 감지되었습니다.',
    owner: '김현수',
    impact: '검사 지연 4분',
    startedAt: '2026.03.12 08:02',
    updatedAt: '2026.03.12 08:05'
  },
  {
    id: 'act-007',
    date: '2026.03.12',
    time: '07:44',
    equipment: 'L-18',
    code: 'C118',
    status: 'processing',
    area: '출하 대기존',
    title: '컨베이어 정렬 보정 진행',
    summary: '트래킹 센서 재보정과 시운전 작업이 동시에 진행 중입니다.',
    owner: '박수빈',
    impact: '출하 순번 지연',
    startedAt: '2026.03.12 07:35',
    updatedAt: '2026.03.12 07:44'
  },
  {
    id: 'act-008',
    date: '2026.03.12',
    time: '07:22',
    equipment: 'Q-07',
    code: 'H207',
    status: 'done',
    area: '정밀 가공실',
    title: '스핀들 축 정렬 완료',
    summary: '축 정렬과 런아웃 검증을 마친 뒤 설비를 운영 상태로 복귀했습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.12 06:58',
    updatedAt: '2026.03.12 07:22'
  },
  {
    id: 'act-009',
    date: '2026.03.11',
    time: '18:48',
    equipment: 'P-06',
    code: 'D110',
    status: 'done',
    area: '포장 2라인',
    title: '프린터 헤드 청소 완료',
    summary: '헤드 막힘 제거 후 테스트 패턴 출력 정상 확인했습니다.',
    owner: '최도윤',
    impact: '정상 복귀',
    startedAt: '2026.03.11 18:31',
    updatedAt: '2026.03.11 18:48'
  },
  {
    id: 'act-010',
    date: '2026.03.11',
    time: '17:20',
    equipment: 'M-09',
    code: 'E112',
    status: 'done',
    area: '가공 3셀',
    title: '쿨런트 유량 이상 조치 완료',
    summary: '필터 교체 후 유량 센서 값이 정상 범위로 회복되었습니다.',
    owner: '이민재',
    impact: '정상 복귀',
    startedAt: '2026.03.11 17:01',
    updatedAt: '2026.03.11 17:20'
  },
  {
    id: 'act-011',
    date: '2026.03.11',
    time: '15:54',
    equipment: 'R-14',
    code: 'G317',
    status: 'incident',
    area: '자재 이송로',
    title: '포크 센서 미검출 발생',
    summary: '물류 포크 위치 검출이 누락되어 이송 정지 알림이 생성되었습니다.',
    owner: '김현수',
    impact: '이송 대기 3분',
    startedAt: '2026.03.11 15:51',
    updatedAt: '2026.03.11 15:54'
  },
  {
    id: 'act-012',
    date: '2026.03.11',
    time: '14:12',
    equipment: 'B-03',
    code: 'A210',
    status: 'done',
    area: '배합실',
    title: '투입 게이트 작동 오류 복구',
    summary: '실린더 압력 재설정 후 투입 게이트 개폐 동작이 정상화되었습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.11 13:55',
    updatedAt: '2026.03.11 14:12'
  }
];
