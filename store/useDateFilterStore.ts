import { create } from 'zustand';

const getTodayDateString = () => {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const normalizeDateRange = (startDate: string, endDate: string) => {
  if (startDate <= endDate) {
    return {
      startDate,
      endDate,
    };
  }

  return {
    startDate: endDate,
    endDate: startDate,
  };
};

interface DateFilterRange {
  startDate: string;
  endDate: string;
  startDateTime: string;
  endDateTime: string;
  apiStartDateTime: string;
  apiEndDateTime: string;
}

interface DateFilterState {
  startDate: string;
  endDate: string;
  isOpen: boolean;

  openDateFilter: () => void;
  closeDateFilter: () => void;
  setDateRange: (startDate: string, endDate: string) => void;
  resetToday: () => void;
  getDateRange: () => DateFilterRange;
}

export const useDateFilterStore = create<DateFilterState>((set, get) => {
  const today = getTodayDateString();

  return {
    startDate: today,
    endDate: today,
    isOpen: false,

    openDateFilter: () => {
      set({ isOpen: true });
    },

    closeDateFilter: () => {
      set({ isOpen: false });
    },

    setDateRange: (startDate, endDate) => {
      const normalizedRange = normalizeDateRange(startDate, endDate);

      set({
        startDate: normalizedRange.startDate,
        endDate: normalizedRange.endDate,
      });
    },

    resetToday: () => {
      const todayDate = getTodayDateString();

      set({
        startDate: todayDate,
        endDate: todayDate,
      });
    },

    getDateRange: () => {
      const { startDate, endDate } = get();

      return {
        startDate,
        endDate,
        startDateTime: `${startDate} 00:00:00`,
        endDateTime: `${endDate} 23:59:59`,
        apiStartDateTime: `${startDate}T00:00:00`,
        apiEndDateTime: `${endDate}T23:59:59`,
      };
    },
  };
});

export { getTodayDateString };