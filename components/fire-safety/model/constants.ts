import { FactoryZone, InspectionRecord } from './types';

export const FACTORY_ZONES: FactoryZone[] = [
  {
    id: 'zone-a',
    name: 'A구역',
    floor: '조립동 1F',
    width: 120,
    height: 80,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-a-01',
        name: '소화기-A01',
        x: 24,
        y: 58,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '입고 동선 입구 우측',
        lastInspection: '2026.02.27 14:18',
        nextReplacement: '2026.09.14',
        note: '출입구와 적재구간 사이 벽체에 고정 설치'
      },
      {
        id: 'ext-a-02',
        name: '소화기-A02',
        x: 95,
        y: 60,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '패널 박스 전면',
        lastInspection: '2026.02.27 14:22',
        nextReplacement: '2026.08.03',
        note: '패널 전면 1.2m 거리, 접근성 양호'
      },
      {
        id: 'ext-a-03',
        name: '소화기-A03',
        x: 20,
        y: 14,
        health: 'critical',
        replacementState: 'replace-now',
        pressure: '미달',
        installSpot: '서측 비상구 옆',
        lastInspection: '2026.02.27 14:52',
        nextReplacement: '2026.03.10',
        note: '압력 게이지 미달, 즉시 교체 권고'
      }
    ]
  },
  {
    id: 'zone-b',
    name: 'B구역',
    floor: '가공동 1F',
    width: 110,
    height: 78,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-b-01',
        name: '소화기-B01',
        x: 20,
        y: 62,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '절단기 전방',
        lastInspection: '2026.02.28 10:16',
        nextReplacement: '2026.03.12',
        note: '봉인 핀 정상이나 외관 마모 확인'
      },
      {
        id: 'ext-b-02',
        name: '소화기-B02',
        x: 90,
        y: 60,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '가공 설비 후면 통로',
        lastInspection: '2026.02.28 10:24',
        nextReplacement: '2026.10.01',
        note: '고정 브래킷 및 안내 표식 상태 양호'
      }
    ]
  },
  {
    id: 'zone-c',
    name: 'C구역',
    floor: '검수동 2F',
    width: 118,
    height: 82,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-c-01',
        name: '소화기-C01',
        x: 22,
        y: 18,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '검수동 진입 계단 앞',
        lastInspection: '2026.02.28 13:40',
        nextReplacement: '2026.07.30',
        note: '동선 시작점에 설치되어 접근성 우수'
      },
      {
        id: 'ext-c-02',
        name: '소화기-C02',
        x: 92,
        y: 18,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '포장기 측면',
        lastInspection: '2026.02.28 13:48',
        nextReplacement: '2026.09.26',
        note: '포장 공정 종료점 인접'
      },
      {
        id: 'ext-c-03',
        name: '소화기-C03',
        x: 54,
        y: 56,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '중앙 작업대 후면',
        lastInspection: '2026.02.28 16:12',
        nextReplacement: '2026.03.21',
        note: '전면 적치물로 접근 반경 축소'
      }
    ]
  },
  {
    id: 'zone-d',
    name: 'D구역',
    floor: '출하동 1F',
    width: 104,
    height: 74,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-d-01',
        name: '소화기-D01',
        x: 18,
        y: 12,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '하역장 입구 좌측',
        lastInspection: '2026.02.28 14:07',
        nextReplacement: '2026.03.28',
        note: '출하 박스 적재 시 가시성 저하 발생'
      },
      {
        id: 'ext-d-02',
        name: '소화기-D02',
        x: 84,
        y: 54,
        health: 'critical',
        replacementState: 'replace-now',
        pressure: '미달',
        installSpot: '출하 라벨러 옆',
        lastInspection: '2026.02.28 14:35',
        nextReplacement: '2026.03.08',
        note: '압력 저하 및 외관 손상 동시 확인'
      }
    ]
  }
];

export const INSPECTION_HISTORY: InspectionRecord[] = [
  {
    id: 'log-1',
    date: '2026.02.28',
    timeRange: '14:00 ~ 15:00',
    level: 'warning',
    zoneId: 'zone-d',
    zoneName: 'D구역',
    equipmentId: 'ext-d-02',
    equipmentName: '소화기-D02',
    inspector: '정하린',
    summary: '출하 라벨러 옆 설비 압력 저하 감지',
    abnormality: '압력 게이지 정상 범위 하단 이탈, 외관 스크래치 동시 확인',
    action: '현장 사용 중지 표시 후 예비 소화기로 대체 배치, 교체 요청 등록',
    detailTitle: '압력 미달 및 외관 손상',
    details: [
      '점검 시 게이지 지침이 허용 범위 최하단 아래로 이동함',
      '브래킷 체결은 유지되었으나 외관에 충격 흔적이 확인됨',
      '출하 장비 동선과 가깝기 때문에 우선 교체 대상으로 지정함'
    ]
  },
  {
    id: 'log-2',
    date: '2026.02.28',
    timeRange: '10:00 ~ 11:00',
    level: 'normal',
    zoneId: 'zone-b',
    zoneName: 'B구역',
    equipmentId: 'ext-b-02',
    equipmentName: '소화기-B02',
    inspector: '박수빈',
    summary: '가공 설비 후면 통로 설비 정상 확인',
    abnormality: '이상 없음',
    action: '현 상태 유지, 다음 정기 점검 일정 반영',
    detailTitle: '정기 점검 정상 완료',
    details: [
      '봉인 핀과 안전 고리가 정상 상태로 유지됨',
      '게이지 압력 정상, 소화기 표기 스티커 식별 상태 양호',
      '작업자 동선과의 간섭 없이 접근 가능'
    ]
  },
  {
    id: 'log-3',
    date: '2026.02.28',
    timeRange: '16:00 ~ 16:30',
    level: 'warning',
    zoneId: 'zone-c',
    zoneName: 'C구역',
    equipmentId: 'ext-c-03',
    equipmentName: '소화기-C03',
    inspector: '이민재',
    summary: '중앙 작업대 후면 적치물로 접근성 저하',
    abnormality: '전면 0.8m 공간 중 일부가 포장 자재로 점유됨',
    action: '적치물 즉시 이동 요청, 교체주기 도래 설비로 함께 관리',
    detailTitle: '접근 반경 확보 필요',
    details: [
      '설비 자체 압력은 정상 범위 안쪽이지만 접근 거리가 기준보다 짧아짐',
      '작업 교대 직후 임시 적치가 반복되어 개선 요청 필요',
      '교체 예정일이 가까워 추적 관리 항목으로 이관'
    ]
  },
  {
    id: 'log-4',
    date: '2026.02.27',
    timeRange: '14:00 ~ 15:00',
    level: 'critical',
    zoneId: 'zone-a',
    zoneName: 'A구역',
    equipmentId: 'ext-a-03',
    equipmentName: '소화기-A03',
    inspector: '김현수',
    summary: '서측 비상구 옆 설비 즉시 교체 필요',
    abnormality: '압력 게이지 미달, 실린더 하단 마모 심화',
    action: '즉시 교체 요청 생성 및 비상구 인접 예비 설비 임시 배치',
    detailTitle: '즉시 교체 대상 설비',
    details: [
      '비상구 동선 인접 설비라 우선순위를 최상위로 지정함',
      '교체 요청 티켓 #FS-2031 자동 생성 완료',
      '교체 전까지 임시 설비 위치를 안내 표지로 고지함'
    ]
  },
  {
    id: 'log-5',
    date: '2026.02.28',
    timeRange: '13:30 ~ 14:00',
    level: 'normal',
    zoneId: 'zone-c',
    zoneName: 'C구역',
    equipmentId: 'ext-c-01',
    equipmentName: '소화기-C01',
    inspector: '최도윤',
    summary: '검수동 진입 계단 앞 설비 정상 유지',
    abnormality: '이상 없음',
    action: '정상 점검 완료 처리',
    detailTitle: '설비 상태 안정',
    details: [
      '안내 표식, 고정 브래킷, 압력 상태 모두 정상',
      '계단 동선 확보 상태 양호',
      '다음 점검 예정: 2026.03.05 오전'
    ]
  },
  {
    id: 'log-6',
    date: '2026.02.28',
    timeRange: '09:30 ~ 10:00',
    level: 'warning',
    zoneId: 'zone-b',
    zoneName: 'B구역',
    equipmentId: 'ext-b-01',
    equipmentName: '소화기-B01',
    inspector: '박수빈',
    summary: '절단기 전방 설비 교체 예정일 임박',
    abnormality: '외관 도장 마모와 사용 안내 스티커 흐림 확인',
    action: '차기 교체주기 대상에 포함, 스티커 재부착 요청',
    detailTitle: '교체주기 도래 예정',
    details: [
      '압력은 정상 범위이나 마킹 식별성이 떨어짐',
      '고온 구간 노출이 반복되어 외관 열화 가속',
      '교체일 전 선제 점검 예약'
    ]
  }
];
