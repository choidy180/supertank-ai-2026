'use client';

import { useMemo } from 'react';

import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Layers3,
  PenLine,
  Printer,
  Search,
  Sparkles,
} from 'lucide-react';
import styled, { css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type ThemeMode = 'light' | 'dark';
type CellTone = 'ok' | 'warn' | 'empty' | 'info' | 'danger';

type ReportThemeStyle = {
  colorScheme: ThemeMode;
  pageBg: string;
  surface: string;
  surfaceSoft: string;
  surfaceGlass: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  neutralSoft: string;
  shadow: string;
  shadowLarge: string;
  focus: string;
  gridLine: string;
  tableHead: string;
};

type SummaryCard = {
  id: string;
  label: string;
  value: string;
  caption: string;
  tone: CellTone;
};

type ApprovalStep = {
  label: string;
  name: string;
  role: string;
  status: 'done' | 'waiting';
};

type ReportRow = {
  id: string;
  group: string;
  item: string;
  spec: string[];
  refs?: string[];
  values: string[];
  memo?: string;
};

type ActivityLog = {
  id: string;
  time: string;
  title: string;
  desc: string;
  tone: CellTone;
};

const REPORT_THEME: Record<ThemeMode, ReportThemeStyle> = {
  light: {
    colorScheme: 'light',
    pageBg: '#f4f7fb',
    surface: 'rgba(255, 255, 255, 0.94)',
    surfaceSoft: '#f8fafc',
    surfaceGlass: 'rgba(255, 255, 255, 0.72)',
    surfaceHover: '#f1f5f9',
    border: 'rgba(226, 232, 240, 0.92)',
    borderStrong: '#cbd5e1',
    textPrimary: '#101827',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.09)',
    accentStrong: '#1d4ed8',
    onAccent: '#ffffff',
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.1)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.12)',
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.1)',
    neutralSoft: 'rgba(100, 116, 139, 0.1)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    shadowLarge: '0 24px 70px rgba(15, 23, 42, 0.11)',
    focus: 'rgba(37, 99, 235, 0.18)',
    gridLine: 'rgba(148, 163, 184, 0.34)',
    tableHead: 'rgba(248, 250, 252, 0.92)',
  },
  dark: {
    colorScheme: 'dark',
    pageBg: '#07111f',
    surface: 'rgba(15, 23, 42, 0.92)',
    surfaceSoft: '#111827',
    surfaceGlass: 'rgba(15, 23, 42, 0.68)',
    surfaceHover: '#1e293b',
    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(203, 213, 225, 0.34)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.14)',
    accentStrong: '#bfdbfe',
    onAccent: '#0f172a',
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.12)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.12)',
    danger: '#fca5a5',
    dangerSoft: 'rgba(252, 165, 165, 0.12)',
    neutralSoft: 'rgba(148, 163, 184, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.18)',
    shadowLarge: '0 28px 80px rgba(0, 0, 0, 0.34)',
    focus: 'rgba(147, 197, 253, 0.24)',
    gridLine: 'rgba(148, 163, 184, 0.24)',
    tableHead: 'rgba(15, 23, 42, 0.9)',
  },
};

const createReportThemeVars = (theme: ReportThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --report-bg: ${theme.pageBg};
  --report-surface: ${theme.surface};
  --report-surface-soft: ${theme.surfaceSoft};
  --report-surface-glass: ${theme.surfaceGlass};
  --report-surface-hover: ${theme.surfaceHover};

  --report-border: ${theme.border};
  --report-border-strong: ${theme.borderStrong};
  --report-grid-line: ${theme.gridLine};
  --report-table-head: ${theme.tableHead};

  --report-text-primary: ${theme.textPrimary};
  --report-text-secondary: ${theme.textSecondary};
  --report-text-tertiary: ${theme.textTertiary};

  --report-accent: ${theme.accent};
  --report-accent-soft: ${theme.accentSoft};
  --report-accent-strong: ${theme.accentStrong};
  --report-on-accent: ${theme.onAccent};

  --report-success: ${theme.success};
  --report-success-soft: ${theme.successSoft};
  --report-warning: ${theme.warning};
  --report-warning-soft: ${theme.warningSoft};
  --report-danger: ${theme.danger};
  --report-danger-soft: ${theme.dangerSoft};
  --report-neutral-soft: ${theme.neutralSoft};

  --report-shadow: ${theme.shadow};
  --report-shadow-large: ${theme.shadowLarge};
  --report-focus: ${theme.focus};
`;

const reportMeta = {
  title: 'Drum Tub Asm 순회 검사 Sheet',
  subtitle: 'Giant-C / AJQ729130',
  documentNo: 'QMS-DRUM-2026-02-28-001',
  lotNo: 'M/Change 시, 1~500EA/2EA · 501~1000EA/3EA',
  model: 'AJQ729130',
  line: '소방설비 조립 1F',
  inspector: '정현수',
  date: '2026.02.28',
  shift: '주간',
  revision: 'Rev. 03',
};

const summaryCards: SummaryCard[] = [
  {
    id: 'total',
    label: '검사 항목',
    value: '28',
    caption: '전체 체크 포인트',
    tone: 'info',
  },
  {
    id: 'ok',
    label: '정상',
    value: '24',
    caption: '기준 내 확인',
    tone: 'ok',
  },
  {
    id: 'warn',
    label: '주의',
    value: '3',
    caption: '재확인 필요',
    tone: 'warn',
  },
  {
    id: 'empty',
    label: '미입력',
    value: '1',
    caption: '작성 대기',
    tone: 'empty',
  },
];

const approvalSteps: ApprovalStep[] = [
  {
    label: '작성',
    name: '정현수',
    role: '현장 담당',
    status: 'done',
  },
  {
    label: '검토',
    name: '한남규',
    role: '품질 리더',
    status: 'done',
  },
  {
    label: '승인',
    name: '대기',
    role: '파트장',
    status: 'waiting',
  },
];

const reportRows: ReportRow[] = [
  {
    id: 'hose-assembly',
    group: '외관 / 구성품',
    item: 'Hose Assembly, Connector',
    spec: ['AEM73412901', '5214ER4001Z', 'MEJ61885422'],
    refs: ['Hose', 'Connector', 'Clamp'],
    values: ['OK', 'OK', 'OK', 'OK'],
    memo: '체결 방향 및 누락 없음',
  },
  {
    id: 'cover-safety',
    group: '외관 / 구성품',
    item: 'Cover, Safety',
    spec: ['MCK67229801', '유 / 무 확인'],
    refs: ['Safety Cover'],
    values: ['유', '유', '유', '유'],
    memo: '스크래치 없음',
  },
  {
    id: 'inlet-bellows',
    group: 'DRUM TUB ASM',
    item: 'Inlet Bellows',
    spec: ['4738ER1004A', '조립 방향 및 씰링 확인'],
    values: ['OK', 'OK', 'OK', 'OK'],
  },
  {
    id: 'tub-cover-gasket',
    group: 'DRUM TUB ASM',
    item: 'Tub Cover Gasket',
    spec: ['4986ER0004L Gray', '4986ER0004P Black', '4986ER0004Q Black'],
    refs: ['Gray', 'Black'],
    values: ['OK', '주의', 'OK', 'OK'],
    memo: '2차 측정품 가스켓 들뜸 재확인',
  },
  {
    id: 'drum-tub-position',
    group: 'DRUM TUB ASM',
    item: 'IP 위치 / Type',
    spec: ['좌측 1P~4P', '우측 1P~4P', '후면 1P~4P'],
    values: ['1P / 2P', '1P / 3P', '2P / 4P', '1P / 4P'],
  },
  {
    id: 'bolt-torque',
    group: 'DRUM TUB ASM',
    item: 'Bolt 체결력',
    spec: ['Cover / Outer', 'T: 80~150 kgf.cm', '자체 관리 90~150'],
    values: ['112', '108', '116', '113'],
    memo: '최소/최대 관리 기준 내',
  },
  {
    id: 'balance-upper',
    group: 'Balance Weight 체결력',
    item: '상부 Balance Weight',
    spec: ['Black L: 7.0kg', '4866ER0007A'],
    values: ['7.0 kg', '7.0 kg', '7.0 kg', '7.0 kg'],
  },
  {
    id: 'balance-lower',
    group: 'Balance Weight 체결력',
    item: '하부 Balance Weight',
    spec: ['Black T: 7.35kg', '4866ER0004A'],
    values: ['7.35 kg', '7.35 kg', '7.35 kg', '7.35 kg'],
  },
  {
    id: 'balance-torque',
    group: 'Balance Weight 체결력',
    item: '체결 토크',
    spec: ['T: 70~120 kgf.cm', '자체 관리 90~150'],
    values: ['104', '102', '110', '105'],
  },
  {
    id: 'stator-torque',
    group: 'STATOR 체결력',
    item: 'Stator Bolt',
    spec: ['AJB73816004', 'AJB73816028', 'AJB73816017 대체 가능'],
    values: ['132', '128', '134', '130'],
  },
  {
    id: 'bearing-pressure-upper',
    group: 'Bearing 압입력 Data',
    item: '상부 압입력',
    spec: ['550~2000 kgf.cm', '4Point 측정'],
    values: ['1018', '1032', '1016', '1028'],
  },
  {
    id: 'bearing-pressure-lower',
    group: 'Bearing 압입력 Data',
    item: '하부 압입력',
    spec: ['550~1900 kgf.cm', '4Point 측정'],
    values: ['986', '1002', '996', '990'],
  },
  {
    id: 'hardness',
    group: '부품 확인',
    item: 'HARDNESS',
    spec: ['6877ER1016', 'N / U / Z / E'],
    values: ['1016 N', '1016 U', '1016 Z', '1016 E'],
  },
  {
    id: 'heater',
    group: '부품 확인',
    item: 'Heater PART NO',
    spec: ['AEG33121527 230V/3200W', 'AEG33121501 120V/1000W', 'AEG73309903 230V/2000W'],
    values: ['1527', '1501', '9903', '1527'],
    memo: '전압 사양 교차 확인',
  },
  {
    id: 'rotor',
    group: '부품 확인',
    item: 'Rotor',
    spec: ['27AHL72914402-ALB', '신규 사양 적용'],
    values: ['ALB', 'ALB', 'ALB', 'ALB'],
  },
  {
    id: 'gasket-gap',
    group: '치수 / 단차',
    item: 'Gasket 틈새',
    spec: ['3~8mm', '90° 간격 4Point 측정'],
    values: ['4.1 / 4.2', '4.4 / 4.3', '4.1 / 4.0', '4.2 / 4.2'],
  },
  {
    id: 'bearing-step-upper',
    group: '치수 / 단차',
    item: 'Bearing 단차 상부',
    spec: ['0.2mm 이내', '90° 간격 4Point 측정'],
    values: ['0.12', '0.15', '0.11', '0.14'],
  },
  {
    id: 'bearing-step-lower',
    group: '치수 / 단차',
    item: 'Bearing 단차 하부',
    spec: ['1.1~1.5mm', '90° 간격 4Point 측정'],
    values: ['1.21', '1.24', '1.19', '1.22'],
  },
  {
    id: 'siphon',
    group: '특성 검사',
    item: 'Tub Outer Siphon',
    spec: ['Flash, 막힘 없을 것'],
    values: ['OK', 'OK', 'OK', 'OK'],
  },
  {
    id: 'scratch',
    group: '특성 검사',
    item: '제원검사 / 스크래치',
    spec: ['도장 까짐 없음', '외관 스크래치 없을 것'],
    values: ['OK', 'OK', '주의', 'OK'],
    memo: '3차 샘플 후면 미세 스크래치',
  },
  {
    id: 'heater-press',
    group: '특성 검사',
    item: 'Heater 압입 및 Rotor 이물',
    spec: ['Heater 압입 및 Rotor 이물 없을 것', '속 이물 없음'],
    values: ['OK', 'OK', 'OK', 'OK'],
  },
  {
    id: 'leak',
    group: '특성 검사',
    item: '누수 검사',
    spec: ['누수 없을 것', '1회 / 日'],
    values: ['OK', 'OK', 'OK', '미입력'],
  },
  {
    id: 'eco',
    group: '특성 검사',
    item: '친환경검사',
    spec: ['RoHS Mark 부착', 'Lot 식별 가능'],
    values: ['OK', 'OK', 'OK', 'OK'],
  },
  {
    id: 'water-seal',
    group: '특성 검사',
    item: 'Water Seal 압입높이',
    spec: ['0.7±0.3mm', '합격력 15kgf 이상'],
    values: ['0.72 / 16.2', '0.69 / 15.8', '0.74 / 16.0', '0.71 / 15.9'],
  },
  {
    id: 'special-note',
    group: '특이사항',
    item: '특이사항',
    spec: ['라인 특이사항 또는 품질 이슈 기록'],
    values: ['없음', '없음', '가스켓 재확인', '누수 검사 대기'],
    memo: '최종 승인 전 미입력 항목 확인 필요',
  },
];

const activityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    time: '14:52',
    title: 'Tub Cover Gasket 재확인 요청',
    desc: '2차 샘플에서 들뜸 가능성이 있어 작업자 확인 대기',
    tone: 'warn',
  },
  {
    id: 'log-2',
    time: '14:35',
    title: 'Bearing 압입력 정상 범위 확인',
    desc: '상·하부 압입력 모두 관리 기준 내 입력 완료',
    tone: 'ok',
  },
  {
    id: 'log-3',
    time: '14:10',
    title: '누수 검사 결과 대기',
    desc: '4차 샘플은 설비 대기 후 추가 입력 예정',
    tone: 'empty',
  },
  {
    id: 'log-4',
    time: '13:48',
    title: 'Heater PART NO 교차 확인',
    desc: '사양 혼입 없음, 샘플별 번호 기록 완료',
    tone: 'info',
  },
];

const sectionAnchors = [
  '외관 / 구성품',
  'DRUM TUB ASM',
  '체결력',
  'Bearing Data',
  '특성 검사',
  '특이사항',
];

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
`;

const getToneLabel = (tone: CellTone) => {
  const labels: Record<CellTone, string> = {
    ok: '정상',
    warn: '주의',
    empty: '미입력',
    info: '정보',
    danger: '위험',
  };

  return labels[tone];
};

const getValueTone = (value: string): CellTone => {
  const normalizedValue = value.toLowerCase();

  if (
    value.includes('주의') ||
    normalizedValue.includes('recheck') ||
    normalizedValue.includes('hold')
  ) {
    return 'warn';
  }

  if (value.includes('미입력') || value.includes('대기') || value === '-') {
    return 'empty';
  }

  if (normalizedValue.includes('ng') || value.includes('불량')) {
    return 'danger';
  }

  if (value.includes('OK') || value.includes('유') || value.includes('없음')) {
    return 'ok';
  }

  return 'info';
};

const getGroupMeta = (rows: ReportRow[]) => {
  const counts = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.group] = (acc[row.group] ?? 0) + 1;
    return acc;
  }, {});

  const seen = new Set<string>();

  return rows.map((row) => {
    const isFirstInGroup = !seen.has(row.group);
    seen.add(row.group);

    return {
      ...row,
      isFirstInGroup,
      groupSpan: counts[row.group] ?? 1,
    };
  });
};

const ReportReferencePreview = ({ label }: { label: string }) => {
  return (
    <ReferencePreview>
      <ReferenceLine />
      <ReferenceDot />
      <span>{label}</span>
    </ReferencePreview>
  );
};

export default function DrumTubInspectionReportPage() {
  const isDark = useThemeStore((state) => state.isDark);

  const rowsWithMeta = useMemo(() => getGroupMeta(reportRows), []);

  const completionRate = useMemo(() => {
    const cellCount = reportRows.reduce((sum, row) => sum + row.values.length, 0);
    const filledCount = reportRows.reduce((sum, row) => {
      return sum + row.values.filter((value) => getValueTone(value) !== 'empty').length;
    }, 0);

    return Math.round((filledCount / cellCount) * 100);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleCsvDownload = () => {
    const header = [
      '구분',
      '검사항목',
      '규격',
      '1차',
      '2차',
      '3차',
      '4차',
      '메모',
    ];

    const body = reportRows.map((row) => [
      row.group,
      row.item,
      row.spec.join(' / '),
      ...row.values,
      row.memo ?? '',
    ]);

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [header, ...body]
      .map((line) => line.map((cell) => escapeCell(cell)).join(','))
      .join('\n');

    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `drum-tub-inspection-${reportMeta.date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ThemeScope $isDark={isDark}>
      <PageShell>
        <TopBar>
          <HeroBlock>

            <HeroText>
              <Eyebrow>Inspection Report</Eyebrow>
              <PageTitle>{reportMeta.title}</PageTitle>
              <PageDescription>
                종이 검사 Sheet를 웹 화면에서 바로 확인하고 입력할 수 있도록
                구성한 더미 보고서 화면입니다.
              </PageDescription>
            </HeroText>
          </HeroBlock>

          <TopActions>
            <SearchBox>
              <Search size={17} />
              <span>검사항목 검색</span>
            </SearchBox>

            <GhostActionButton type="button" onClick={handleCsvDownload}>
              <Download size={17} />
              CSV
            </GhostActionButton>

            <PrimaryActionButton type="button" onClick={handlePrint}>
              <Printer size={17} />
              PDF 저장
            </PrimaryActionButton>
          </TopActions>
        </TopBar>

        <SummaryStrip>
          {summaryCards.map((card) => (
            <SummaryTile key={card.id} $tone={card.tone}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.caption}</small>
            </SummaryTile>
          ))}
        </SummaryStrip>

        <MainGrid>
          <LeftRail>
            <GlassCard>
              <CardHeader>
                <CardTitle>검사 개요</CardTitle>
                <Badge $tone="info">{reportMeta.revision}</Badge>
              </CardHeader>

              <InfoList>
                <InfoItem>
                  <span>문서번호</span>
                  <strong>{reportMeta.documentNo}</strong>
                </InfoItem>
                <InfoItem>
                  <span>모델</span>
                  <strong>{reportMeta.model}</strong>
                </InfoItem>
                <InfoItem>
                  <span>라인</span>
                  <strong>{reportMeta.line}</strong>
                </InfoItem>
                <InfoItem>
                  <span>검사자</span>
                  <strong>{reportMeta.inspector}</strong>
                </InfoItem>
              </InfoList>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>작성 진행률</CardTitle>
                <Badge $tone="ok">{completionRate}%</Badge>
              </CardHeader>

              <ProgressBlock>
                <ProgressTrack>
                  <ProgressFill $percent={completionRate} />
                </ProgressTrack>
                <ProgressCaption>
                  기준값 입력 후 미입력 항목은 자동으로 표시됩니다.
                </ProgressCaption>
              </ProgressBlock>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>섹션 이동</CardTitle>
                <Layers3 size={18} />
              </CardHeader>

              <AnchorList>
                {sectionAnchors.map((section) => (
                  <AnchorPill key={section} type="button">
                    {section}
                  </AnchorPill>
                ))}
              </AnchorList>
            </GlassCard>
          </LeftRail>

          <ReportWorkspace>
            <ReportPaper>
              <ReportHeader>
                <DocumentTitleBlock>
                  <MiniLabel>표준 검사 양식</MiniLabel>
                  <DocumentTitle>{reportMeta.title}</DocumentTitle>
                  <DocumentSubtitle>{reportMeta.subtitle}</DocumentSubtitle>
                </DocumentTitleBlock>

                <MetaPanel>
                  <MetaCell>
                    <CalendarDays size={16} />
                    <span>일자</span>
                    <strong>{reportMeta.date}</strong>
                  </MetaCell>
                  <MetaCell>
                    <PenLine size={16} />
                    <span>작업자</span>
                    <strong>{reportMeta.inspector}</strong>
                  </MetaCell>
                  <MetaCell>
                    <Sparkles size={16} />
                    <span>근무</span>
                    <strong>{reportMeta.shift}</strong>
                  </MetaCell>
                </MetaPanel>

                <ApprovalPanel>
                  {approvalSteps.map((step) => (
                    <ApprovalCell key={step.label} $status={step.status}>
                      <span>{step.label}</span>
                      <strong>{step.name}</strong>
                      <small>{step.role}</small>
                    </ApprovalCell>
                  ))}
                </ApprovalPanel>
              </ReportHeader>

              <LotNotice>
                <FileText size={17} />
                <span>Lot별 검사수량: {reportMeta.lotNo}</span>
              </LotNotice>

              <ReportTableShell>
                <ReportTable>
                  <colgroup>
                    <col style={{ width: '132px' }} />
                    <col style={{ width: '210px' }} />
                    <col style={{ width: '280px' }} />
                    <col style={{ width: '210px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '220px' }} />
                  </colgroup>

                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>검사 항목</th>
                      <th>규격 / 기준</th>
                      <th>참조 이미지</th>
                      <th>1차</th>
                      <th>2차</th>
                      <th>3차</th>
                      <th>4차</th>
                      <th>비고</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rowsWithMeta.map((row) => (
                      <tr key={row.id}>
                        {row.isFirstInGroup && (
                          <GroupCell rowSpan={row.groupSpan}>
                            <GroupName>{row.group}</GroupName>
                          </GroupCell>
                        )}

                        <ItemCell>
                          <strong>{row.item}</strong>
                        </ItemCell>

                        <SpecCell>
                          {row.spec.map((line) => (
                            <span key={line}>{line}</span>
                          ))}
                        </SpecCell>

                        <ReferenceCell>
                          {row.refs?.length ? (
                            <ReferenceGrid>
                              {row.refs.map((ref) => (
                                <ReportReferencePreview key={ref} label={ref} />
                              ))}
                            </ReferenceGrid>
                          ) : (
                            <EmptyReference>-</EmptyReference>
                          )}
                        </ReferenceCell>

                        {row.values.map((value, index) => (
                          <ValueCell key={`${row.id}-${index}`}>
                            <ValuePill $tone={getValueTone(value)}>{value}</ValuePill>
                          </ValueCell>
                        ))}

                        <MemoCell>{row.memo ?? '기준 내 확인'}</MemoCell>
                      </tr>
                    ))}
                  </tbody>
                </ReportTable>
              </ReportTableShell>

              <ReportFooter>
                <FooterNote>
                  * The best quality company
                </FooterNote>
                <FooterStamp>QMS DIGITAL SHEET</FooterStamp>
              </ReportFooter>
            </ReportPaper>
          </ReportWorkspace>

          <RightRail>
            <GlassCard>
              <CardHeader>
                <CardTitle>승인 상태</CardTitle>
                <Badge $tone="warn">검토 중</Badge>
              </CardHeader>

              <ApprovalTimeline>
                {approvalSteps.map((step) => (
                  <TimelineItem key={step.label} $done={step.status === 'done'}>
                    <TimelineDot>
                      {step.status === 'done' ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <AlertTriangle size={14} />
                      )}
                    </TimelineDot>
                    <div>
                      <strong>{step.label}</strong>
                      <span>
                        {step.name} · {step.role}
                      </span>
                    </div>
                  </TimelineItem>
                ))}
              </ApprovalTimeline>
            </GlassCard>

            <GlassCard $scroll>
              <CardHeader>
                <CardTitle>실시간 입력 이력</CardTitle>
                <Badge $tone="info">Live</Badge>
              </CardHeader>

              <ActivityList>
                {activityLogs.map((log) => (
                  <ActivityItem key={log.id} $tone={log.tone}>
                    <ActivityTop>
                      <span>{log.time}</span>
                      <Badge $tone={log.tone}>{getToneLabel(log.tone)}</Badge>
                    </ActivityTop>
                    <strong>{log.title}</strong>
                    <p>{log.desc}</p>
                  </ActivityItem>
                ))}
              </ActivityList>
            </GlassCard>

            <GlassCard>
              <CardHeader>
                <CardTitle>보고서 액션</CardTitle>
                <BadgeCheck size={18} />
              </CardHeader>

              <ActionStack>
                <WideButton type="button" onClick={handlePrint}>
                  <Printer size={18} />
                  PDF 다운로드 / 인쇄
                </WideButton>
                <WideGhostButton type="button" onClick={handleCsvDownload}>
                  <Download size={18} />
                  Summary CSV 다운로드
                </WideGhostButton>
              </ActionStack>
            </GlassCard>
          </RightRail>
        </MainGrid>
      </PageShell>
    </ThemeScope>
  );
}

const ThemeScope = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) =>
    createReportThemeVars($isDark ? REPORT_THEME.dark : REPORT_THEME.light)}

  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 0%, var(--report-accent-soft), transparent 30%),
    radial-gradient(circle at 88% 10%, var(--report-warning-soft), transparent 26%),
    var(--report-bg);
  color: var(--report-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
`;

const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 24px;

  @media (max-width: 900px) {
    padding: 16px;
  }

  @media print {
    display: block;
    height: auto;
    padding: 0;
    overflow: visible;
    background: #ffffff;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;

  @media (max-width: 1160px) {
    align-items: flex-start;
    flex-direction: column;
  }

  @media print {
    display: none;
  }
`;

const HeroBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const HeroIcon = styled.div`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  border: 1px solid var(--report-border);
  border-radius: 17px;
  background: var(--report-surface-glass);
  color: var(--report-accent);
  box-shadow: var(--report-shadow);
  backdrop-filter: blur(18px) saturate(1.08);
`;

const HeroText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 24px;
  color: var(--report-accent);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: var(--report-text-primary);
  font-size: clamp(27px, 2.4vw, 38px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.2px;
`;

const PageDescription = styled.p`
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  word-break: keep-all;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--report-border);
  border-radius: 999px;
  background: var(--report-surface-glass);
  color: var(--report-text-tertiary);
  font-size: 14px;
  font-weight: 800;
  box-shadow: var(--report-shadow);
  backdrop-filter: blur(18px) saturate(1.08);
`;

const ActionButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--report-focus);
    outline-offset: 2px;
  }
`;

const GhostActionButton = styled(ActionButtonBase)`
  border: 1px solid var(--report-border);
  background: var(--report-surface-glass);
  color: var(--report-text-primary);
  box-shadow: var(--report-shadow);
  backdrop-filter: blur(18px) saturate(1.08);

  &:hover {
    border-color: var(--report-border-strong);
    background: var(--report-surface-hover);
  }
`;

const PrimaryActionButton = styled(ActionButtonBase)`
  border: 1px solid var(--report-accent);
  background: var(--report-accent);
  color: var(--report-on-accent);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
`;

const SummaryStrip = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none;
  }
`;

const toneCss = (tone: CellTone) => {
  const vars: Record<CellTone, { color: string; bg: string; border: string }> = {
    ok: {
      color: 'var(--report-success)',
      bg: 'var(--report-success-soft)',
      border: 'var(--report-success)',
    },
    warn: {
      color: 'var(--report-warning)',
      bg: 'var(--report-warning-soft)',
      border: 'var(--report-warning)',
    },
    empty: {
      color: 'var(--report-text-tertiary)',
      bg: 'var(--report-neutral-soft)',
      border: 'var(--report-border-strong)',
    },
    info: {
      color: 'var(--report-accent)',
      bg: 'var(--report-accent-soft)',
      border: 'var(--report-accent)',
    },
    danger: {
      color: 'var(--report-danger)',
      bg: 'var(--report-danger-soft)',
      border: 'var(--report-danger)',
    },
  };

  return css`
    --tone-color: ${vars[tone].color};
    --tone-bg: ${vars[tone].bg};
    --tone-border: ${vars[tone].border};
  `;
};

const SummaryTile = styled.article<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 12px;
  min-width: 0;
  min-height: 82px;
  padding: 15px 17px;
  border: 1px solid var(--report-border);
  border-radius: 22px;
  background: var(--report-surface-glass);
  box-shadow: var(--report-shadow);
  backdrop-filter: blur(18px) saturate(1.08);

  span {
    align-self: end;
    color: var(--report-text-secondary);
    font-size: 16px;
    font-weight: 700;
  }

  strong {
    grid-row: span 2;
    align-self: center;
    color: var(--tone-color);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.05em;
  }

  small {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-tertiary);
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MainGrid = styled.section`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 310px;
  gap: 16px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1440px) {
    grid-template-columns: 230px minmax(0, 1fr) 280px;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
    padding-right: 4px;
  }

  @media print {
    display: block;
    overflow: visible;
  }
`;

const LeftRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;

  @media print {
    display: none;
  }
`;

const RightRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;

  @media print {
    display: none;
  }
`;

const GlassCard = styled.section<{ $scroll?: boolean }>`
  display: grid;
  gap: 8px;
  min-width: 0;
  min-height: 0;
  padding: 16px;
  border: 1px solid var(--report-border);
  border-radius: 24px;
  background: var(--report-surface-glass);
  box-shadow: var(--report-shadow);
  backdrop-filter: blur(18px) saturate(1.08);
  

  ${({ $scroll }) =>
    $scroll &&
    css`
      flex: 1 1 auto;
      overflow: hidden;
    `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  svg {
    flex: 0 0 auto;
    color: var(--report-text-tertiary);
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  color: var(--report-text-primary);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.04em;
`;

const Badge = styled.span<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 26px;
  padding: 0 9px;
  border: 1px solid color-mix(in srgb, var(--tone-border) 38%, transparent);
  border-radius: 999px;
  background: var(--tone-bg);
  color: var(--tone-color);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
`;

const InfoList = styled.div`
  display: grid;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: grid;
  gap: 5px;
  padding: 12px;
  border: 1px solid var(--report-border);
  border-radius: 16px;
  background: var(--report-surface);

  span {
    color: var(--report-text-tertiary);
    font-size: 14px;
    font-weight: 600;
  }

  strong {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-primary);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ProgressBlock = styled.div`
  display: flex;
  gap: 10px;
`;

const ProgressTrack = styled.div`
  height: 10px;
  overflow: hidden;
  border: 1px solid var(--report-border);
  border-radius: 999px;
  background: var(--report-surface-soft);
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--report-accent), var(--report-success));
`;

const ProgressCaption = styled.p`
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 13px;
  font-weight: 650;
  line-height: 1.55;
  word-break: keep-all;
`;

const AnchorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const AnchorPill = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--report-border);
  border-radius: 999px;
  background: var(--report-surface);
  color: var(--report-text-secondary);
  font-size: 13px;
  font-weight: 700;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--report-accent);
    background: var(--report-accent-soft);
    color: var(--report-accent);
  }
`;

const ReportWorkspace = styled.section`
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 2px 2px 14px;
  overscroll-behavior: contain;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--report-border-strong);
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media print {
    overflow: visible;
    padding: 0;
  }
`;

const ReportPaper = styled.article`
  display: grid;
  gap: 14px;
  min-width: 1480px;
  min-height: 100%;
  padding: 22px;
  border: 1px solid var(--report-border);
  border-radius: 30px;
  background: var(--report-surface);
  box-shadow: var(--report-shadow-large);

  @media print {
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: #ffffff;
    color: #111827;
  }
`;

const ReportHeader = styled.header`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(360px, 0.9fr) 360px;
  gap: 12px;
  align-items: stretch;
`;

const DocumentTitleBlock = styled.div`
  display: grid;
  align-content: center;
  /* gap: 5px; */
  /* min-height: 118px; */
  padding: 22px;
  border: 1px solid var(--report-border);
  border-radius: 22px;
`;

const MiniLabel = styled.span`
  color: var(--report-accent);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;

const DocumentTitle = styled.h2`
  margin: 0;
  color: var(--report-text-primary);
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.055em;
  line-height: 1.18;
`;

const DocumentSubtitle = styled.p`
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 16px;
  font-weight: 850;
  letter-spacing: 0.02em;
`;

const MetaPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const MetaCell = styled.div`
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 2px;
  min-height: 118px;
  padding: 16px;
  border: 1px solid var(--report-border);
  border-radius: 20px;
  background: var(--report-surface-soft);

  svg {
    color: var(--report-accent);
    width: 20px;
    height: 20px;
  }

  span {
    color: var(--report-text-tertiary);
    font-size: 16px;
    font-weight: 600;
    margin-top: 4px;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
  }
`;

const ApprovalPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--report-border-strong);
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ApprovalCell = styled.div<{ $status: ApprovalStep['status'] }>`
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 6px;
  min-height: 118px;
  padding: 14px;
  border: 1px solid
    ${({ $status }) =>
      $status === 'done' ? 'var(--report-success)' : 'var(--report-border)'};
  border-radius: 20px;
  background: ${({ $status }) =>
    $status === 'done'
      ? 'var(--report-success-soft)'
      : 'var(--report-surface-soft)'};

  span {
    color: ${({ $status }) =>
      $status === 'done' ? 'var(--report-success)' : 'var(--report-text-tertiary)'};
    font-size: 16px;
    font-weight: 600;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.04em;
  }

  small {
    color: var(--report-text-secondary);
    font-size: 16px;
    font-weight: 700;
  }
`;

const LotNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 46px;
  padding: 0 16px;
  border: 1px solid var(--report-border);
  border-radius: 17px;
  background: var(--report-surface-soft);
  color: var(--report-text-secondary);
  font-size: 14px;
  font-weight: 700;

  svg {
    color: var(--report-accent);
  }
`;

const ReportTableShell = styled.div`
  overflow: hidden;
  border: 1px solid var(--report-grid-line);
  border-radius: 22px;
  background: var(--report-surface);

  @media print {
    border-radius: 0;
  }
`;

const ReportTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  th,
  td {
    border-right: 1px solid var(--report-grid-line);
    border-bottom: 1px solid var(--report-grid-line);
    vertical-align: middle;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 3;
    height: 48px;
    padding: 0 12px;
    background: var(--report-table-head);
    color: var(--report-text-secondary);
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-align: center;
    backdrop-filter: blur(18px) saturate(1.08);
  }

  tbody td {
    min-height: 68px;
    padding: 12px;
    color: var(--report-text-primary);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.45;
  }
`;

const GroupCell = styled.td`
  background: var(--report-surface-soft);
  text-align: center;
`;

const GroupName = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 40px;
  color: var(--report-text-primary);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.15;
  word-break: keep-all;
`;

const ItemCell = styled.td`
  background: color-mix(in srgb, var(--report-surface-soft) 70%, transparent);

  strong {
    display: block;
    color: var(--report-text-primary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.035em;
    word-break: keep-all;
  }
`;

const SpecCell = styled.td`
  color: var(--report-text-secondary);

  span {
    display: block;
    min-height: 22px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.55;
  }
`;

const ReferenceCell = styled.td`
  padding: 8px !important;
`;

const ReferenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const ReferencePreview = styled.div`
  position: relative;
  display: grid;
  place-items: end start;
  min-height: 54px;
  overflow: hidden;
  padding: 8px;
  border: 1px solid var(--report-border);
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(148, 163, 184, 0.18), transparent 52%),
    var(--report-surface-soft);

  span {
    position: relative;
    z-index: 2;
    color: var(--report-text-secondary);
    font-size: 11px;
    font-weight: 700;
  }
`;

const ReferenceLine = styled.div`
  position: absolute;
  top: 22px;
  right: 10px;
  left: 10px;
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--report-text-tertiary), var(--report-accent));
  opacity: 0.58;
`;

const ReferenceDot = styled.div`
  position: absolute;
  top: 14px;
  left: 28px;
  width: 18px;
  height: 18px;
  border: 2px solid var(--report-surface);
  border-radius: 999px;
  background: var(--report-accent);
  box-shadow: 28px 4px 0 rgba(100, 116, 139, 0.25);
`;

const EmptyReference = styled.div`
  display: grid;
  place-items: center;
  min-height: 54px;
  border: 1px dashed var(--report-border);
  border-radius: 12px;
  color: var(--report-text-tertiary);
  font-size: 13px;
  font-weight: 700;
`;

const ValueCell = styled.td`
  text-align: center;
`;

const ValuePill = styled.span<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  max-width: 100%;
  min-height: 30px;
  padding: 0 9px;
  /* border: 1px solid color-mix(in srgb, var(--tone-border) 40%, transparent);
  border-radius: 999px;
  background: var(--tone-bg); */
  color: var(--tone-color);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  overflow-wrap: anywhere;
`;

const MemoCell = styled.td`
  color: var(--report-text-secondary) !important;
  font-size: 13px !important;
  font-weight: 750 !important;
  word-break: keep-all;
`;

const ReportFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 0 4px;
  color: var(--report-text-tertiary);
  font-size: 16px;
  font-weight: 700;
`;

const FooterNote = styled.span`
  color: var(--tone-color);
`;

const FooterStamp = styled.span`
  color: var(--report-accent);
  letter-spacing: 0.04em;
`;

const ApprovalTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--report-border-strong);
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const TimelineItem = styled.div<{ $done: boolean }>`
  display: flex;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--report-border);
  border-radius: 17px;
  background: ${({ $done }) =>
    $done ? 'var(--report-success-soft)' : 'var(--report-surface)'};

  div:last-child {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 14px;
    font-weight: 700;
  }

  span {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-secondary);
    font-size: 12px;
    font-weight: 750;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const TimelineDot = styled.div`
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--report-surface);
  color: var(--report-accent);
`;

const ActivityList = styled.div`
  display: grid;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--report-border-strong);
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ActivityItem = styled.article<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: grid;
  gap: 8px;
  padding: 13px;
  border: 1px solid var(--report-border);
  border: 2px solid var(--tone-border);
  border-radius: 18px;
  background: var(--report-surface);

  strong {
    color: var(--report-text-primary);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
    word-break: keep-all;
  }

  p {
    margin: 0;
    color: var(--report-text-secondary);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.55;
    word-break: keep-all;
  }
`;

const ActivityTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  > span {
    color: var(--report-text-tertiary);
    font-size: 16px;
    font-weight: 600;
  }
`;

const ActionStack = styled.div`
  display: grid;
  gap: 10px;
`;

const WideButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--report-accent);
  border-radius: 15px;
  background: var(--report-accent);
  color: var(--report-on-accent);
  font-size: 14px;
  font-weight: 700;
  transition: transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const WideGhostButton = styled(WideButton)`
  border-color: var(--report-border);
  background: var(--report-surface);
  color: var(--report-text-primary);

  &:hover {
    border-color: var(--report-border-strong);
    background: var(--report-surface-hover);
  }
`;
