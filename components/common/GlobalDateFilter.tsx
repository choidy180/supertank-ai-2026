'use client';

import { useEffect, useMemo, useState } from 'react';

import styled, { css } from 'styled-components';

import { useDateFilterStore, getTodayDateString } from '@/store/useDateFilterStore';
import { useThemeStore } from '@/store/useThemeStore';

type CalendarTarget = 'start' | 'end';

type DateFilterTheme = {
  surface: string;
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
  overlay: string;
  focus: string;
  shadow: string;
};

const DATE_FILTER_THEME = {
  light: {
    surface: '#ffffff',
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
    overlay: 'rgba(15, 23, 42, 0.56)',
    focus: 'rgba(37, 99, 235, 0.18)',
    shadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
  },
  dark: {
    surface: '#111827',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.34)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    onAccent: '#0f172a',
    overlay: 'rgba(2, 6, 23, 0.74)',
    focus: 'rgba(147, 197, 253, 0.24)',
    shadow: '0 18px 40px rgba(0, 0, 0, 0.24)',
  },
} as const satisfies Record<'light' | 'dark', DateFilterTheme>;

const createDateFilterVars = (theme: DateFilterTheme) => css`
  --date-filter-surface: ${theme.surface};
  --date-filter-surface-muted: ${theme.surfaceMuted};
  --date-filter-surface-hover: ${theme.surfaceHover};
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
  const draftRangeLabel = `${formatCompactDate(draftStartDate)}-${formatCompactDate(draftEndDate)}`;

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

  const handleSelectToday = () => {
    const todayDate = getTodayDateString();

    setDraftStartDate(todayDate);
    setDraftEndDate(todayDate);
    setActiveTarget('start');
    setVisibleMonth(parseDateString(todayDate));
  };

  const handleApply = () => {
    setDateRange(draftStartDate, draftEndDate);
    closeDateFilter();
  };

  return (
    <DateFilterScope $isDark={isDark}>
      <DateFilterWrap>
        <DateFilterCard type="button" onClick={openDateFilter}>
          <CardLeft>
            <CalendarIcon />
            <CardTextGroup>
              <CardLabel>날짜 필터</CardLabel>
              <CardRange>{appliedRangeLabel}</CardRange>
            </CardTextGroup>
          </CardLeft>

          <CardRight>
            <CardBadge>일 단위</CardBadge>
          </CardRight>
        </DateFilterCard>
      </DateFilterWrap>

      {isOpen && (
        <ModalOverlay onClick={closeDateFilter}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalHeader>
              <ModalTitleGroup>
                <ModalEyebrow>Date Filter</ModalEyebrow>
                <ModalTitle>조회 기간 선택</ModalTitle>
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
                $active={activeTarget === 'start'}
                onClick={() => setActiveTarget('start')}
              >
                <DateFieldLabel>시작일</DateFieldLabel>
                <DateFieldValue>{formatFullDate(draftStartDate)}</DateFieldValue>
              </DateFieldButton>

              <RangeArrow>—</RangeArrow>

              <DateFieldButton
                type="button"
                $active={activeTarget === 'end'}
                onClick={() => setActiveTarget('end')}
              >
                <DateFieldLabel>종료일</DateFieldLabel>
                <DateFieldValue>{formatFullDate(draftEndDate)}</DateFieldValue>
              </DateFieldButton>
            </SelectedRangePanel>

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
                  const isInRange =
                    item.dateString > draftStartDate && item.dateString < draftEndDate;
                  const isToday = item.dateString === today;

                  return (
                    <DayButton
                      key={item.dateString}
                      type="button"
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
  width: 500px;
  max-width: 100%;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const DateFilterCard = styled.button`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 18px; */
  width: 100%;
  min-height: 72px;
  padding: 0 18px;
  border: 1px solid var(--date-filter-border);
  border-radius: 20px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  box-shadow: var(--date-filter-shadow);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const CardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

const CalendarIcon = styled.span`
  position: relative;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--date-filter-border);
  border-radius: 12px;
  background: var(--date-filter-surface-muted);

  &::before {
    position: absolute;
    top: 8px;
    right: 8px;
    left: 8px;
    height: 3px;
    border-radius: 999px;
    background: var(--date-filter-accent);
    content: '';
  }

  &::after {
    position: absolute;
    top: 16px;
    right: 10px;
    left: 10px;
    bottom: 8px;
    border: 1.5px solid var(--date-filter-text-tertiary);
    border-top: 0;
    border-radius: 0 0 8px 8px;
    content: '';
    opacity: 0.7;
  }
`;

const CardTextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  text-align: left;
`;

const CardLabel = styled.span`
  color: var(--date-filter-text-secondary);
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
`;

const CardRange = styled.span`
  color: var(--date-filter-text-primary);
  font-size: 25px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
`;

const CardRight = styled.div`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
`;

const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid var(--date-filter-border);
  border-radius: 999px;
  background: var(--date-filter-surface-muted);
  color: var(--date-filter-text-secondary);
  font-size: 20px;
  font-weight: 600;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--date-filter-overlay);
  backdrop-filter: blur(8px);
`;

const ModalCard = styled.div`
  display: grid;
  gap: 24px;
  width: min(640px, 100%);
  padding: 30px;
  border: 1px solid var(--date-filter-border);
  border-radius: 30px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  box-shadow: var(--date-filter-shadow);

  @media (max-width: 640px) {
    padding: 22px;
    border-radius: 24px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  /* gap: 18px; */
`;

const ModalTitleGroup = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const ModalEyebrow = styled.div`
  color: var(--date-filter-accent);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: var(--date-filter-text-primary);
  font-size: 34px;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.04em;
`;

const ModalDescription = styled.p`
  margin: 0;
  color: var(--date-filter-text-secondary);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  word-break: keep-all;
`;

const CloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--date-filter-surface-muted);
  color: var(--date-filter-text-secondary);
  font-size: 28px;
  line-height: 1;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
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
  gap: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const DateFieldButton = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: grid;
  gap: 8px;
  min-height: 86px;
  padding: 16px 18px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--date-filter-accent)' : 'var(--date-filter-border)'};
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? 'var(--date-filter-accent-soft)' : 'var(--date-filter-surface-muted)'};
  text-align: left;
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const DateFieldLabel = styled.span`
  color: var(--date-filter-text-secondary);
  font-size: 20px;
  font-weight: 600;
`;

const DateFieldValue = styled.strong`
  color: var(--date-filter-text-primary);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
`;

const RangeArrow = styled.div`
  color: var(--date-filter-text-tertiary);
  font-size: 22px;
  font-weight: 700;

  @media (max-width: 560px) {
    display: none;
  }
`;

const CalendarPanel = styled.div`
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid var(--date-filter-border);
  border-radius: 24px;
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
  width: 42px;
  height: 42px;
  border: 1px solid var(--date-filter-border);
  border-radius: 999px;
  background: var(--date-filter-surface);
  color: var(--date-filter-text-primary);
  font-size: 28px;
  line-height: 1;
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    border-color: var(--date-filter-border-strong);
    background: var(--date-filter-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const MonthTitle = styled.div`
  color: var(--date-filter-text-primary);
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.03em;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
`;

const WeekCell = styled.div`
  display: grid;
  place-items: center;
  height: 32px;
  color: var(--date-filter-text-tertiary);
  font-size: 20px;
  font-weight: 600;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
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
  height: 48px;
  border: 1px solid
    ${({ $isSelected, $isInRange }) => {
      if ($isSelected) {
        return 'var(--date-filter-accent)';
      }

      if ($isInRange) {
        return 'transparent';
      }

      return 'transparent';
    }};
  border-radius: 14px;
  background: ${({ $isSelected, $isInRange }) => {
    if ($isSelected) {
      return 'var(--date-filter-accent)';
    }

    if ($isInRange) {
      return 'var(--date-filter-accent-soft)';
    }

    return 'transparent';
  }};
  color: ${({ $isSelected, $isMuted }) => {
    if ($isSelected) {
      return 'var(--date-filter-on-accent)';
    }

    if ($isMuted) {
      return 'var(--date-filter-text-tertiary)';
    }

    return 'var(--date-filter-text-primary)';
  }};
  font-size: 22px;
  font-weight: ${({ $isSelected, $isToday }) =>
    $isSelected || $isToday ? 900 : 700};
  transition:
    background 140ms ease,
    border-color 140ms ease,
    color 140ms ease;

  &::after {
    position: absolute;
    bottom: 7px;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: ${({ $isSelected }) =>
      $isSelected ? 'var(--date-filter-on-accent)' : 'var(--date-filter-accent)'};
    opacity: ${({ $isToday }) => ($isToday ? 1 : 0)};
    content: '';
  }

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? 'var(--date-filter-accent)' : 'var(--date-filter-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--date-filter-focus);
    outline-offset: 2px;
  }
`;

const ModalBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SelectedSummary = styled.div`
  color: var(--date-filter-text-secondary);
  font-size: 20px;
  font-weight: 700;

  strong {
    color: var(--date-filter-text-primary);
    font-size: 22px;
    font-weight: 600;
    margin-left: 8px;
  }
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  @media (max-width: 560px) {
    width: 100%;
  }
`;

const ModalButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

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
`;