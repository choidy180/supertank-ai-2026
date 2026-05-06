'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled, { css } from 'styled-components';
import {
  Activity,
  ChevronLeft,
  Clock,
  Flame,
  History,
  LineChart,
  Menu,
  Moon,
  Package,
  PauseCircle,
  Sun,
  Truck,
  Watch,
} from 'lucide-react';

import { useThemeStore } from '@/store/useThemeStore';

type SidebarMenuItem =
  | {
      id: string;
      label: string;
      icon: ReactNode;
      path: string;
      isDivider?: false;
    }
  | {
      id: string;
      isDivider: true;
    };

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'realtime-defect-status',
    label: '불량역추적',
    icon: <Activity size={22} />,
    path: '/realtime-defect-status',
  },
  {
    id: 'time',
    label: '타임체크',
    icon: <Clock size={22} />,
    path: '/timecheck',
  },
  {
    id: 'fire',
    label: '소방관리',
    icon: <Flame size={22} />,
    path: '/fire',
  },
  {
    id: 'idle',
    label: '무작업관리',
    icon: <PauseCircle size={22} />,
    path: '/no-work',
  },
  {
    id: 'receiving-material',
    label: '자재입고',
    icon: <Package size={22} />,
    path: '/receiving-material',
  },
  {
    id: 'divider-1',
    isDivider: true,
  },
  {
    id: 'smes',
    label: 'SMES',
    icon: <Truck size={22} />,
    path: '/smes',
  },
  {
    id: 'divider-2',
    isDivider: true,
  },
  {
    id: 'insight',
    label: '인사이트',
    icon: <LineChart size={22} />,
    path: '/insight',
  },
  {
    id: 'action-history',
    label: '조치이력',
    icon: <History size={22} />,
    path: '/action-history',
  },
  {
    id: 'wearable-connect',
    label: '웨어러블 연결',
    icon: <Watch size={22} />,
    path: '/wearable-connect',
  },
];

type SidebarThemeStyle = {
  background: string;
  border: string;
  surfaceHover: string;
  activeSurface: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  icon: string;
  iconActive: string;
  logoBg: string;
  logoMark: string;
  toggleBg: string;
  toggleBorder: string;
  toggleThumb: string;
  toggleIconActive: string;
  focus: string;
};

const SIDEBAR_THEME_STYLES: Record<'light' | 'dark', SidebarThemeStyle> = {
  light: {
    background: '#ffffff',
    border: '#e5e7eb',
    surfaceHover: '#f8fafc',
    activeSurface: '#f1f5f9',
    textPrimary: '#111827',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    icon: '#64748b',
    iconActive: '#111827',
    logoBg: '#111827',
    logoMark: '#ffffff',
    toggleBg: '#e5e7eb',
    toggleBorder: '#d1d5db',
    toggleThumb: '#ffffff',
    toggleIconActive: '#d97706',
    focus: 'rgba(37, 99, 235, 0.18)',
  },
  dark: {
    background: '#111827',
    border: 'rgba(148, 163, 184, 0.2)',
    surfaceHover: '#1f2937',
    activeSurface: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    icon: '#94a3b8',
    iconActive: '#f8fafc',
    logoBg: '#f8fafc',
    logoMark: '#111827',
    toggleBg: 'rgba(147, 197, 253, 0.22)',
    toggleBorder: 'rgba(147, 197, 253, 0.32)',
    toggleThumb: '#93c5fd',
    toggleIconActive: '#f8fafc',
    focus: 'rgba(147, 197, 253, 0.28)',
  },
};

const getSidebarTheme = (isDark: boolean) =>
  isDark ? SIDEBAR_THEME_STYLES.dark : SIDEBAR_THEME_STYLES.light;

const createSidebarThemeVars = (theme: SidebarThemeStyle) => css`
  --sidebar-bg: ${theme.background};
  --sidebar-border: ${theme.border};
  --sidebar-surface-hover: ${theme.surfaceHover};
  --sidebar-active-surface: ${theme.activeSurface};

  --sidebar-text-primary: ${theme.textPrimary};
  --sidebar-text-secondary: ${theme.textSecondary};
  --sidebar-text-muted: ${theme.textMuted};

  --sidebar-icon: ${theme.icon};
  --sidebar-icon-active: ${theme.iconActive};

  --sidebar-logo-bg: ${theme.logoBg};
  --sidebar-logo-mark: ${theme.logoMark};

  --sidebar-toggle-bg: ${theme.toggleBg};
  --sidebar-toggle-border: ${theme.toggleBorder};
  --sidebar-toggle-thumb: ${theme.toggleThumb};
  --sidebar-toggle-icon-active: ${theme.toggleIconActive};

  --sidebar-focus: ${theme.focus};
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

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const { isDark, toggleTheme } = useThemeStore();

  if (pathname === '/') {
    return null;
  }

  return (
    <SidebarWrapper $isExpanded={isExpanded} $isDark={isDark}>
      <Header $isExpanded={isExpanded}>
        <LogoWrapper href="/" $isExpanded={isExpanded}>
          <LogoIcon />
          <LogoText>스마트팩토리</LogoText>
        </LogoWrapper>

        <CollapseButton
          type="button"
          aria-label={isExpanded ? '사이드바 접기' : '사이드바 펼치기'}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </CollapseButton>
      </Header>

      <ScrollableMenu>
        <MenuList>
          {MENU_ITEMS.map((item) => {
            if (item.isDivider) {
              return <MenuDivider key={item.id} />;
            }

            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <MenuItem key={item.id}>
                <MenuLink
                  href={item.path}
                  title={isExpanded ? undefined : item.label}
                  aria-current={isActive ? 'page' : undefined}
                  $isActive={isActive}
                  $isExpanded={isExpanded}
                >
                  <IconWrapper $isActive={isActive}>{item.icon}</IconWrapper>

                  <MenuText $isExpanded={isExpanded} $isActive={isActive}>
                    {item.label}
                  </MenuText>
                </MenuLink>
              </MenuItem>
            );
          })}
        </MenuList>
      </ScrollableMenu>

      <BottomSection $isExpanded={isExpanded}>
        <ThemeToggleButton
          type="button"
          aria-label={isDark ? '라이트 모드로 변경' : '다크 모드로 변경'}
          aria-pressed={isDark}
          $isExpanded={isExpanded}
          onClick={toggleTheme}
        >
          <ThemeToggleTextGroup $isExpanded={isExpanded}>
            <ThemeToggleTitle>화면 테마</ThemeToggleTitle>
            <ThemeToggleCaption>
              {isDark ? '다크 모드' : '라이트 모드'}
            </ThemeToggleCaption>
          </ThemeToggleTextGroup>

          <ThemeSwitchTrack>
            <ThemeSwitchIcon $active={!isDark}>
              <Sun size={14} />
            </ThemeSwitchIcon>

            <ThemeSwitchIcon $active={isDark}>
              <Moon size={14} />
            </ThemeSwitchIcon>

            <ThemeSwitchThumb $isDark={isDark} />
          </ThemeSwitchTrack>
        </ThemeToggleButton>
      </BottomSection>
    </SidebarWrapper>
  );
}

const SidebarWrapper = styled.aside<{
  $isExpanded: boolean;
  $isDark: boolean;
}>`
  ${({ $isDark }) => createSidebarThemeVars(getSidebarTheme($isDark))}

  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: ${({ $isExpanded }) => ($isExpanded ? '280px' : '80px')};
  min-width: ${({ $isExpanded }) => ($isExpanded ? '280px' : '80px')};
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  border-right: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
  color: var(--sidebar-text-primary);
  transition:
    width 260ms cubic-bezier(0.22, 1, 0.36, 1),
    min-width 260ms cubic-bezier(0.22, 1, 0.36, 1),
    background 160ms ease,
    border-color 160ms ease;
`;

const Header = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  height: 84px;
  flex-shrink: 0;
  padding: ${({ $isExpanded }) => ($isExpanded ? '24px 20px' : '24px 0')};
  transition:
    padding 220ms ease,
    justify-content 220ms ease;
`;

const LogoWrapper = styled(Link)<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: ${({ $isExpanded }) => ($isExpanded ? '200px' : '0')};
  overflow: hidden;
  text-decoration: none;
  white-space: nowrap;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
  transition:
    width 220ms ease,
    opacity 160ms ease;
`;

const LogoIcon = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 10px;
  background: var(--sidebar-logo-bg);

  &::after {
    position: absolute;
    inset: 9px;
    border-radius: 4px;
    background: var(--sidebar-logo-mark);
    content: '';
  }
`;

const LogoText = styled.span`
  color: var(--sidebar-text-primary);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const CollapseButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 12px;
  color: var(--sidebar-icon);
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: var(--sidebar-surface-hover);
    color: var(--sidebar-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--sidebar-focus);
    outline-offset: 2px;
  }
`;

const ScrollableMenu = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 16px 20px;
  margin: 0;
  list-style: none;
`;

const MenuItem = styled.li`
  width: 100%;
`;

const MenuDivider = styled.li`
  height: 1px;
  margin: 8px 12px;
  list-style: none;
  background: var(--sidebar-border);
`;

const MenuLink = styled(Link)<{
  $isActive: boolean;
  $isExpanded: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'flex-start' : 'center'};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '46px')};
  height: 46px;
  margin: 0 auto;
  padding: ${({ $isExpanded }) => ($isExpanded ? '0 14px' : '0')};
  border-radius: 14px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-active-surface)' : 'transparent'};
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive
        ? 'var(--sidebar-active-surface)'
        : 'var(--sidebar-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--sidebar-focus);
    outline-offset: 2px;
  }
`;

const IconWrapper = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  min-width: 22px;
  height: 22px;
  flex: 0 0 auto;
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)'};
  transition: color 160ms ease;
`;

const MenuText = styled.span<{
  $isExpanded: boolean;
  $isActive: boolean;
}>`
  max-width: ${({ $isExpanded }) => ($isExpanded ? '200px' : '0')};
  margin-left: ${({ $isExpanded }) => ($isExpanded ? '14px' : '0')};
  overflow: hidden;
  color: ${({ $isActive }) =>
    $isActive
      ? 'var(--sidebar-text-primary)'
      : 'var(--sidebar-text-secondary)'};
  font-size: 15px;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 600)};
  letter-spacing: -0.03em;
  white-space: nowrap;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
  transition:
    max-width 220ms ease,
    margin-left 220ms ease,
    opacity 160ms ease,
    color 160ms ease;
`;

const BottomSection = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  padding: ${({ $isExpanded }) => ($isExpanded ? '16px' : '16px 11px')};
  border-top: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
`;

const ThemeToggleButton = styled.button<{ $isExpanded: boolean }>`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '58px')};
  min-height: 48px;
  padding: ${({ $isExpanded }) => ($isExpanded ? '8px 10px 8px 12px' : '0')};
  border-radius: 16px;
  color: var(--sidebar-text-primary);
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: var(--sidebar-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--sidebar-focus);
    outline-offset: 2px;
  }
`;

const ThemeToggleTextGroup = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  gap: 3px;
  max-width: ${({ $isExpanded }) => ($isExpanded ? '160px' : '0')};
  overflow: hidden;
  text-align: left;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: none;
  transition:
    max-width 220ms ease,
    opacity 160ms ease;
`;

const ThemeToggleTitle = styled.span`
  color: var(--sidebar-text-primary);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  white-space: nowrap;
`;

const ThemeToggleCaption = styled.span`
  color: var(--sidebar-text-muted);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

const ThemeSwitchTrack = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 58px;
  height: 32px;
  flex: 0 0 auto;
  padding: 0 8px;
  border: 1px solid var(--sidebar-toggle-border);
  border-radius: 999px;
  background: var(--sidebar-toggle-bg);
`;

const ThemeSwitchIcon = styled.span<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) =>
    $active ? 'var(--sidebar-toggle-icon-active)' : 'var(--sidebar-text-muted)'};
  transition: color 160ms ease;
`;

const ThemeSwitchThumb = styled.span<{ $isDark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border: 1px solid var(--sidebar-toggle-border);
  border-radius: 999px;
  background: var(--sidebar-toggle-thumb);
  transform: translateX(${({ $isDark }) => ($isDark ? '26px' : '0')});
  transition:
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
    background 160ms ease,
    border-color 160ms ease;
`;