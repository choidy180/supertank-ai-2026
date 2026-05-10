'use client';

import { useEffect, useMemo, useState } from 'react';

import styled, { css } from 'styled-components';

import { getTodayDateString, useDateFilterStore } from '@/store/useDateFilterStore';
import { useThemeStore } from '@/store/useThemeStore';

type CalendarTarget = 'start' | 'end';
type DatePreset = 'today' | 'last7' | 'thisMonth';

type DateFilterTheme = {
  colorScheme: 'light' | 'dark';
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  surfaceActive: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  overlay: string;
  focus: string;
  shadow: string;
  modalShadow: string;
};

const DATE_FILTER_THEME = {
  light: {
    colorScheme: 'light',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f3f4f6',
    surfaceActive: '#eff6ff',
    border: '#e5e7eb',
    borderStrong: '#d1d5db',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#9ca3af',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    onAccent: '#ffffff',
    overlay: 'rgba(17, 24, 39, 0.48)',
    focus: 'rgba(37, 99, 235, 0.18)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
    modalShadow: '0 24px 70px rgba(15, 23, 42, 0.18)',
  },
  dark: {
    colorScheme: 'dark',
    surface: '#141414',
    surfaceMuted: '#181818',
    surfaceHover: '#202020',
    surfaceActive: '#1a1a1a',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f5f5f5',
    textSecondary: '#d4d4d4',
    textTertiary: '#8a8a8a',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.18)',
    onAccent: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.68)',
    focus: 'rgba(37, 99, 235, 0.32)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
    modalShadow: '0 24px 70px rgba(0, 0, 0, 0.46)',
  },
} as const satisfies Record<'light' | 'dark', DateFilterTheme>;

const createDateFilterVars = (theme: DateFilterTheme) => css`
  color-scheme: ${theme.colorScheme};

  --date-filter-surface: ${theme.surface};
  --date-filter-surface-muted: ${theme.surfaceMuted};
  --date-filter-surface-hover: ${theme.surfaceHover};
  --date-filter-surface-active: ${theme.surfaceActive};

  --date-filter-border: ${theme.border};
  --date-filter-border-strong: ${theme.borderStrong};

  --date-filter-text-primary: ${theme.textPrimary};
  --date-filter-text-secondary: ${theme.textSecondary};
  --date-filter-text-tertiary: ${theme.textTertiary};

  --date-filter-accent: ${theme.accent};
  --date-filter-accent-soft: ${theme.accentSoft};
  --date-filter-on-accent: ${theme.onAccent};

  --date-filter-overlay: ${theme.overlay};
  --date-filter-focus: ${theme.focus};
  --date-filter-shadow: ${theme.shadow};
  --date-filter-modal-shadow: ${theme.modalShadow};
`;

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const parseDateString = (dateString: string) => {
  const [year, month, date] = dateString.split('-').map(Number);

  return new Date(year, month - 1, date);
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const addMonths = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
};

const formatCompactDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${year.slice(2)}.${month}.${day}`;
};

const formatFullDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');

  return `${year}.${month}.${day}`;
};

const formatMonthLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');

  return `${year}.${month}`;
};

const buildCalendarDays = (visibleMonth: Date) => {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDate = new Date(year, month, 1);
  const firstDay = firstDate.getDay();
  const calendarStartDate = new Date(year, month, 1 - firstDay);

  return Array.from({ length: 42 }).map((_, index) => {
    const date = new Date(calendarStartDate);

    date.setDate(calendarStartDate.getDate() + index);

    const dateString = toDateString(date);

    return {
      date,
      dateString,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    };
  });
};

const getPresetRange = (preset: DatePreset) => {
  const todayDateString = getTodayDateString();
  const todayDate = parseDateString(todayDateString);

  if (preset === 'today') {
    return {
      startDate: todayDateString,
      endDate: todayDateString,
    };
  }

  if (preset === 'last7') {
    const startDate = new Date(todayDate);

    startDate.setDate(todayDate.getDate() - 6);

    return {
      startDate: toDateString(startDate),
      endDate: todayDateString,
    };
  }

  return {
    startDate: toDateString(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)),
    endDate: todayDateString,
  };
};

export default function GlobalDateFilter() {
  const isDark = useThemeStore((state) => state.isDark);

  const {
    startDate,
    endDate,
    isOpen,
    openDateFilter,
    closeDateFilter,
    setDateRange,
  } = useDateFilterStore();

  const [draftStartDate, setDraftStartDate] = useState(startDate);
  const [draftEndDate, setDraftEndDate] = useState(endDate);
  const [activeTarget, setActiveTarget] = useState<CalendarTarget>('start');
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateString(startDate));

  const today = useMemo(() => getTodayDateString(), []);

  const appliedRangeLabel = `${formatCompactDate(startDate)} - ${formatCompactDate(endDate)}`;
  const draftRangeLabel = `${formatCompactDate(draftStartDate)} - ${formatCompactDate(draftEndDate)}`;

  const calendarDays = useMemo(() => {
    return buildCalendarDays(visibleMonth);
  }, [visibleMonth]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setDraftStartDate(startDate);
    setDraftEndDate(endDate);
    setActiveTarget('start');
    setVisibleMonth(parseDateString(startDate));
  }, [endDate, isOpen, startDate]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDateFilter();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [closeDateFilter, isOpen]);

  const handleSelectDate = (selectedDate: string) => {
    if (activeTarget === 'start') {
      setDraftStartDate(selectedDate);

      if (selectedDate > draftEndDate) {
        setDraftEndDate(selectedDate);
      }

      setActiveTarget('end');
      setVisibleMonth(parseDateString(selectedDate));
      return;
    }

    if (selectedDate < draftStartDate) {
      setDraftStartDate(selectedDate);
      setDraftEndDate(selectedDate);
      setActiveTarget('end');
      setVisibleMonth(parseDateString(selectedDate));
      return;
    }

    setDraftEndDate(selectedDate);
    setVisibleMonth(parseDateString(selectedDate));
  };

  const handleSelectPreset = (preset: DatePreset) => {
    const nextRange = getPresetRange(preset);

    setDraftStartDate(nextRange.startDate);
    setDraftEndDate(nextRange.endDate);
    setActiveTarget('end');
    setVisibleMonth(parseDateString(nextRange.startDate));
  };

  const isPresetActive = (preset: DatePreset) => {
    const presetRange = getPresetRange(preset);

    return (
      presetRange.startDate === draftStartDate && presetRange.endDate === draftEndDate
    );
  };

  const handleSelectToday = () => {
    handleSelectPreset('today');
    setActiveTarget('start');
  };

  const handleApply = () => {
    setDateRange(draftStartDate, draftEndDate);
    closeDateFilter();
  };

  return (
    <DateFilterScope $isDark={isDark}>
      <DateFilterWrap>
        <DateFilterCard
          type="button"
          aria-label={`날짜 필터 열기: ${appliedRangeLabel}`}
          onClick={openDateFilter}
        >
          <CardLeft>
            <CalendarIcon aria-hidden="true" />
            <CardTextGroup>
              <CardLabel>날짜 필터</CardLabel>
              <CardRange>{appliedRangeLabel}</CardRange>
            </CardTextGroup>
          </CardLeft>

          <CardAction aria-hidden="true">기간 변경</CardAction>
        </DateFilterCard>
      </DateFilterWrap>

      {isOpen && (
        <ModalOverlay onClick={closeDateFilter}>
          <ModalCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-date-filter-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitleGroup>
                <ModalEyebrow>DATE FILTER</ModalEyebrow>
                <ModalTitle id="global-date-filter-title">조회 기간 선택</ModalTitle>
                <ModalDescription>
                  시작일과 종료일을 선택하면 전체 화면에 공통 적용됩니다.
                </ModalDescription>
              </ModalTitleGroup>

              <CloseButton type="button" aria-label="날짜 필터 닫기" onClick={closeDateFilter}>
                ×
              </CloseButton>
            </ModalHeader>

            <SelectedRangePanel>
              <DateFieldButton
                type="button"
                aria-pressed={activeTarget === 'start'}
                $active={activeTarget === 'start'}
                onClick={() => setActiveTarget('start')}
              >
                <DateFieldLabel>시작일</DateFieldLabel>
                <DateFieldValue>{formatFullDate(draftStartDate)}</DateFieldValue>
              </DateFieldButton>

              <RangeArrow aria-hidden="true">—</RangeArrow>

              <DateFieldButton
                type="button"
                aria-pressed={activeTarget === 'end'}
                $active={activeTarget === 'end'}
                onClick={() => setActiveTarget('end')}
              >
                <DateFieldLabel>종료일</DateFieldLabel>
                <DateFieldValue>{formatFullDate(draftEndDate)}</DateFieldValue>
              </DateFieldButton>
            </SelectedRangePanel>

            <PresetRow aria-label="빠른 날짜 선택">
              <PresetButton
                type="button"
                $active={isPresetActive('today')}
                onClick={() => handleSelectPreset('today')}
              >
                오늘
              </PresetButton>
              <PresetButton
                type="button"
                $active={isPresetActive('last7')}
                onClick={() => handleSelectPreset('last7')}
              >
                최근 7일
              </PresetButton>
              <PresetButton
                type="button"
                $active={isPresetActive('thisMonth')}
                onClick={() => handleSelectPreset('thisMonth')}
              >
                이번 달
              </PresetButton>
            </PresetRow>

            <CalendarPanel>
              <CalendarTop>
                <MonthNavButton
                  type="button"
                  aria-label="이전 달"
                  onClick={() => setVisibleMonth((prev) => addMonths(prev, -1))}
                >
                  ‹
                </MonthNavButton>

                <MonthTitle>{formatMonthLabel(visibleMonth)}</MonthTitle>

                <MonthNavButton
                  type="button"
                  aria-label="다음 달"
                  onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}
                >
                  ›
                </MonthNavButton>
              </CalendarTop>

              <WeekGrid>
                {DAY_LABELS.map((label) => (
                  <WeekCell key={label}>{label}</WeekCell>
                ))}
              </WeekGrid>

              <DayGrid>
                {calendarDays.map((item) => {
                  const isStart = item.dateString === draftStartDate;
                  const isEnd = item.dateString === draftEndDate;
                  const isSelected = isStart || isEnd;
                  const isInRange = item.dateString > draftStartDate && item.dateString < draftEndDate;
                  const isToday = item.dateString === today;

                  return (
                    <DayButton
                      key={item.dateString}
                      type="button"
                      aria-pressed={isSelected}
                      $isMuted={!item.isCurrentMonth}
                      $isToday={isToday}
                      $isSelected={isSelected}
                      $isStart={isStart}
                      $isEnd={isEnd}
                      $isInRange={isInRange}
                      onClick={() => handleSelectDate(item.dateString)}
                    >
                      {item.day}
                    </DayButton>
                  );
                })}
              </DayGrid>
            </CalendarPanel>

            <ModalBottom>
              <SelectedSummary>
                선택 기간 <strong>{draftRangeLabel}</strong>
              </SelectedSummary>

              <ButtonGroup>
                <SecondaryButton type="button" onClick={handleSelectToday}>
                  오늘
                </SecondaryButton>

                <SecondaryButton type="button" onClick={closeDateFilter}>
                  취소
                </SecondaryButton>

                <PrimaryButton type="button" onClick={handleApply}>
                  적용
                </PrimaryButton>
              </ButtonGroup>
            </ModalBottom>
          </ModalCard>
        </ModalOverlay>
      )}
    </DateFilterScope>
  );
}

const DateFilterScope = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) =>
    createDateFilterVars($isDark ? DATE_FILTER_THEME.dark : DATE_FILTER_THEME.light)}

  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
`;

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

const DateFilterWrap = styled.div`
  width: 358px;
  max-width: 100%;

  @media (max-width: 640px) {
    width: 100%;
  }
`;


const CardAction = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--date-filter-border);
  border-radius: 8px;
  background: var(--date-filter-surface-muted);
  color: var(--date-filter-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  @media (max-width: 420px) {
    display: none;
  }
`;


const DateFilterCard = styled.button`
  ${buttonReset};

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 7px 8px 7px 12px;
  overflow: hidden;
  border: 1px solid var(--date-filter-border);
  border-radius: 10px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  box-shadow: var(--date-filter-shadow);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &::before {
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: 0;
    width: 4px;
    border-radius: 0 999px 999px 0;
    background: var(--date-filter-accent);
    content: '';
  }

  &:hover {
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
  }

  &:hover ${CardAction} {
    border-color: var(--date-filter-accent);
    background: var(--date-filter-accent);
    color: var(--date-filter-on-accent);
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const CalendarIcon = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border: 1px solid var(--date-filter-border);
  border-radius: 8px;
  background: var(--date-filter-surface-muted);

  &::before {
    position: absolute;
    top: 7px;
    right: 7px;
    left: 7px;
    height: 2px;
    border-radius: 999px;
    background: var(--date-filter-accent);
    content: '';
  }

  &::after {
    position: absolute;
    right: 8px;
    bottom: 8px;
    left: 8px;
    height: 8px;
    border-top: 1px solid var(--date-filter-border-strong);
    content: '';
  }
`;

const CardTextGroup = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
  text-align: left;
`;

const CardLabel = styled.span`
  color: var(--date-filter-text-secondary);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
`;

const CardRange = styled.span`
  overflow: hidden;
  color: var(--date-filter-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.03em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow-y: auto;
  background: var(--date-filter-overlay);

  @media (max-width: 640px) {
    align-items: start;
    padding: 14px;
  }
`;

const ModalCard = styled.div`
  display: grid;
  gap: 18px;
  width: min(580px, 100%);
  max-height: min(840px, calc(100dvh - 48px));
  padding: 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--date-filter-border);
  border-radius: 16px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  /* box-shadow: var(--date-filter-modal-shadow); */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--date-filter-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 640px) {
    max-height: calc(100dvh - 28px);
    padding: 18px;
    border-radius: 14px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
`;

const ModalTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const ModalEyebrow = styled.div`
  color: var(--date-filter-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: var(--date-filter-text-primary);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

const ModalDescription = styled.p`
  margin: 0;
  color: var(--date-filter-text-secondary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.55;
  word-break: keep-all;
`;

const CloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid var(--date-filter-border);
  border-radius: 10px;
  background: var(--date-filter-surface-muted);
  color: var(--date-filter-text-secondary);
  font-size: 28px;
  line-height: 1;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
    color: var(--date-filter-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const SelectedRangePanel = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const DateFieldButton = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: grid;
  gap: 7px;
  min-height: 74px;
  padding: 13px 14px;
  border: 2px solid
    ${({ $active }) =>
      $active ? 'var(--date-filter-accent)' : 'var(--date-filter-border)'};
  border-radius: 10px;
  background: ${({ $active }) =>
    $active ? 'var(--date-filter-surface-active)' : 'var(--date-filter-surface-muted)'};
  text-align: left;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    border-color: ${({ $active }) =>
      $active ? 'var(--date-filter-accent)' : 'var(--date-filter-border-strong)'};
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const DateFieldLabel = styled.span`
  color: var(--date-filter-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
`;

const DateFieldValue = styled.strong`
  color: var(--date-filter-text-primary);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.2;
`;

const RangeArrow = styled.div`
  color: var(--date-filter-text-tertiary);
  font-size: 18px;
  font-weight: 700;

  @media (max-width: 560px) {
    display: none;
  }
`;

const PresetRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PresetButton = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--date-filter-accent)' : 'var(--date-filter-border)'};
  border-radius: 9px;
  background: ${({ $active }) =>
    $active ? 'var(--date-filter-accent)' : 'var(--date-filter-surface-muted)'};
  color: ${({ $active }) =>
    $active ? 'var(--date-filter-on-accent)' : 'var(--date-filter-text-secondary)'};
  font-size: 14px;
  font-weight: 700;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--date-filter-accent);
    color: ${({ $active }) =>
      $active ? 'var(--date-filter-on-accent)' : 'var(--date-filter-text-primary)'};
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const CalendarPanel = styled.div`
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--date-filter-border);
  border-radius: 12px;
  background: var(--date-filter-surface-muted);
`;

const CalendarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MonthNavButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--date-filter-border);
  border-radius: 9px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  font-size: 25px;
  font-weight: 700;
  line-height: 1;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
    color: var(--date-filter-accent);
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const MonthTitle = styled.div`
  color: var(--date-filter-text-primary);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

const WeekCell = styled.div`
  display: grid;
  place-items: center;
  height: 28px;
  color: var(--date-filter-text-tertiary);
  font-size: 13px;
  font-weight: 700;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

const DayButton = styled.button<{
  $isMuted: boolean;
  $isToday: boolean;
  $isSelected: boolean;
  $isStart: boolean;
  $isEnd: boolean;
  $isInRange: boolean;
}>`
  ${buttonReset};

  position: relative;
  display: grid;
  place-items: center;
  height: 40px;
  border: 1px solid
    ${({ $isSelected, $isToday }) => {
      if ($isSelected) {
        return 'var(--date-filter-accent)';
      }

      if ($isToday) {
        return 'var(--date-filter-border-strong)';
      }

      return 'transparent';
    }};
  border-radius: ${({ $isInRange }) => ($isInRange ? '6px' : '9px')};
  background: ${({ $isSelected, $isInRange }) => {
    if ($isSelected) {
      return 'var(--date-filter-accent)';
    }

    if ($isInRange) {
      return 'var(--date-filter-accent-soft)';
    }

    return 'transparent';
  }};
  color: ${({ $isSelected, $isMuted, $isToday }) => {
    if ($isSelected) {
      return 'var(--date-filter-on-accent)';
    }

    if ($isToday) {
      return 'var(--date-filter-accent)';
    }

    if ($isMuted) {
      return 'var(--date-filter-text-tertiary)';
    }

    return 'var(--date-filter-text-primary)';
  }};
  font-size: 16px;
  font-weight: ${({ $isSelected, $isToday }) =>
    $isSelected || $isToday ? 700 : 600};
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease;

  &::after {
    position: absolute;
    bottom: 5px;
    left: 50%;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: ${({ $isSelected }) =>
      $isSelected ? 'var(--date-filter-on-accent)' : 'var(--date-filter-accent)'};
    opacity: ${({ $isToday }) => ($isToday ? 1 : 0)};
    content: '';
    transform: translateX(-50%);
  }

  &:hover {
    border-color: ${({ $isSelected }) =>
      $isSelected ? 'var(--date-filter-accent)' : 'var(--date-filter-border-strong)'};
    background: ${({ $isSelected }) =>
      $isSelected ? 'var(--date-filter-accent)' : 'var(--date-filter-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }

  @media (max-height: 760px) and (min-width: 561px) {
    height: 36px;
    font-size: 15px;
  }
`;

const ModalBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-top: 2px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SelectedSummary = styled.div`
  color: var(--date-filter-text-secondary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;

  strong {
    color: var(--date-filter-text-primary);
    font-size: 16px;
    font-weight: 700;
    margin-left: 6px;
    white-space: nowrap;
  }
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  @media (max-width: 560px) {
    width: 100%;
  }
`;

const ModalButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  min-height: 42px;
  padding: 0 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }

  @media (max-width: 560px) {
    flex: 1;
  }
`;

const SecondaryButton = styled(ModalButtonBase)`
  border: 1px solid var(--date-filter-border);
  background: var(--date-filter-surface-muted);
  color: var(--date-filter-text-secondary);

  &:hover {
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
    color: var(--date-filter-text-primary);
  }
`;

const PrimaryButton = styled(ModalButtonBase)`
  border: 1px solid var(--date-filter-accent);
  background: var(--date-filter-accent);
  color: var(--date-filter-on-accent);

  &:hover {
    border-color: var(--date-filter-accent);
    background: #1d4ed8;
  }
`;
