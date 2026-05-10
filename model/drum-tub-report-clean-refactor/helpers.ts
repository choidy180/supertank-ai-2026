import type { CellTone, ReportRow, ReportRowWithMeta } from './types';

export const getToneLabel = (tone: CellTone) => {
  const labels: Record<CellTone, string> = {
    ok: '정상',
    warn: '주의',
    empty: '미입력',
    info: '정보',
    danger: '위험',
  };

  return labels[tone];
};

export const getValueTone = (value: string): CellTone => {
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

export const getRowsWithGroupMeta = (rows: ReportRow[]): ReportRowWithMeta[] => {
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

export const getCompletionRate = (rows: ReportRow[]) => {
  const cellCount = rows.reduce((sum, row) => sum + row.values.length, 0);

  if (cellCount === 0) {
    return 0;
  }

  const filledCount = rows.reduce((sum, row) => {
    return sum + row.values.filter((value) => getValueTone(value) !== 'empty').length;
  }, 0);

  return Math.round((filledCount / cellCount) * 100);
};

export const createCsvContent = (rows: ReportRow[]) => {
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

  const body = rows.map((row) => [
    row.group,
    row.item,
    row.spec.join(' / '),
    ...row.values,
    row.memo ?? '',
  ]);

  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  return [header, ...body]
    .map((line) => line.map((cell) => escapeCell(cell)).join(','))
    .join('\n');
};
