import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false, // 기본값: 애플 스타일의 화이트 테마
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}));