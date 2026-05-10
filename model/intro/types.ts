import type { LucideIcon } from 'lucide-react';

export type FactoryMenuItem = {
  id: string;
  href: string;
  title: string;
  eyebrow: string;
  description: string;
  metric: string;
  metricLabel: string;
  Icon: LucideIcon;
};

export type LandingThemeMode = 'light' | 'dark';

export type LandingThemeStyle = {
  colorScheme: LandingThemeMode;
  background: string;
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
  shadow: string;
  shadowStrong: string;
  focus: string;
};
