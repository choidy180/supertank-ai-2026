'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styled, { css } from 'styled-components';
import {
  Activity,
  ChevronDown,
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
import FloatingChatbotAssistant from './FloatingChatbotAssistant';

type SidebarRouteItem = {
  href: string;
  matchPath?: string;
  matchQuery?: Record<string, string>;
};

type SidebarChildItem = SidebarRouteItem & {
  id: string;
  label: string;
  icon: ReactNode;
};

type SidebarMenuGroup = SidebarRouteItem & {
  id: string;
  label: string;
  icon: ReactNode;
  children?: SidebarChildItem[];
};

const WEARABLE_CONTEXT = {
  defectTracking: 'defect-tracking',
  noWork: 'no-work',
  timecheck: 'timecheck',
} as const;

const MENU_GROUPS: SidebarMenuGroup[] = [
  {
    id: 'defect-tracking',
    label: '불량역추적',
    icon: <Activity size={22} />,
    href: '/realtime-defect-status',
    children: [
      {
        id: 'defect-insight',
        label: '인사이트',
        icon: <LineChart size={18} />,
        href: '/insight',
      },
      {
        id: 'defect-action-history',
        label: '조치 이력',
        icon: <History size={18} />,
        href: `/action-history?context=${WEARABLE_CONTEXT.defectTracking}`,
        matchPath: '/action-history',
        matchQuery: {
          context: WEARABLE_CONTEXT.defectTracking,
        },
      },
      {
        id: 'defect-wearable-connect',
        label: '웨어러블 연결',
        icon: <Watch size={18} />,
        href: `/wearable-connect?context=${WEARABLE_CONTEXT.defectTracking}`,
        matchPath: '/wearable-connect',
        matchQuery: {
          context: WEARABLE_CONTEXT.defectTracking,
        },
      },
    ],
  },
  {
    id: 'no-work',
    label: '무작업관리',
    icon: <PauseCircle size={22} />,
    href: '/no-work',
    children: [
      {
        id: 'no-work-insight',
        label: '알람 인사이트',
        icon: <LineChart size={18} />,
        href: '/no-work/insight',
      },
      {
        id: 'no-work-action-history',
        label: '조치 이력',
        icon: <History size={18} />,
        href: `/action-history?context=${WEARABLE_CONTEXT.noWork}`,
        matchPath: '/action-history',
        matchQuery: {
          context: WEARABLE_CONTEXT.noWork,
        },
      },
      {
        id: 'no-work-wearable-connect',
        label: '웨어러블 연결',
        icon: <Watch size={18} />,
        href: `/wearable-connect?context=${WEARABLE_CONTEXT.noWork}`,
        matchPath: '/wearable-connect',
        matchQuery: {
          context: WEARABLE_CONTEXT.noWork,
        },
      },
    ],
  },
  {
    id: 'timecheck',
    label: '타임체크',
    icon: <Clock size={22} />,
    href: '/timecheck',
    children: [
      {
        id: 'timecheck-dashboard',
        label: '타임체크 현황',
        icon: <Clock size={18} />,
        href: '/timecheck',
      },
      {
        id: 'timecheck-history',
        label: '타임체크 이력',
        icon: <History size={18} />,
        href: '/timecheck/history',
      },
      {
        id: 'timecheck-wearable-connect',
        label: '웨어러블 연결',
        icon: <Watch size={18} />,
        href: `/wearable-connect?context=${WEARABLE_CONTEXT.timecheck}`,
        matchPath: '/wearable-connect',
        matchQuery: {
          context: WEARABLE_CONTEXT.timecheck,
        },
      },
    ],
  },
  {
    id: 'fire',
    label: '소방관리',
    icon: <Flame size={22} />,
    href: '/fire',
  },
  {
    id: 'receiving-material',
    label: '자재입고',
    icon: <Package size={22} />,
    href: '/receiving-material',
  },
  {
    id: 'smes',
    label: 'SMES',
    icon: <Truck size={22} />,
    href: '/smes',
  },
];

type SidebarThemeStyle = {
  background: string;
  border: string;
  surfaceHover: string;
  activeSurface: string;
  activeStrongSurface: string;
  childSurface: string;
  childActiveSurface: string;
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
    activeStrongSurface: '#eef2f7',
    childSurface: '#ffffff',
    childActiveSurface: '#f8fafc',
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
    activeStrongSurface: '#273449',
    childSurface: '#111827',
    childActiveSurface: '#1f2937',
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
  --sidebar-active-strong-surface: ${theme.activeStrongSurface};

  --sidebar-child-surface: ${theme.childSurface};
  --sidebar-child-active-surface: ${theme.childActiveSurface};

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

const getPathnameFromHref = (href: string) => {
  return href.split('?')[0];
};

const isQueryMatched = (
  searchParams: URLSearchParams,
  matchQuery?: Record<string, string>,
) => {
  if (!matchQuery) {
    return true;
  }

  return Object.entries(matchQuery).every(([key, value]) => {
    return searchParams.get(key) === value;
  });
};

const isRouteActive = (
  pathname: string,
  searchParams: URLSearchParams,
  item: SidebarRouteItem,
) => {
  const matchPath = item.matchPath ?? getPathnameFromHref(item.href);

  const isPathMatched =
    pathname === matchPath || pathname.startsWith(`${matchPath}/`);

  if (!isPathMatched) {
    return false;
  }

  return isQueryMatched(searchParams, item.matchQuery);
};

const hasActiveChild = (
  pathname: string,
  searchParams: URLSearchParams,
  children?: SidebarChildItem[],
) => {
  return (
    children?.some((child) => isRouteActive(pathname, searchParams, child)) ??
    false
  );
};

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
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const currentSearchParams = useMemo(() => {
    return new URLSearchParams(searchParamsString);
  }, [searchParamsString]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [openGroupMap, setOpenGroupMap] = useState<Record<string, boolean>>({});
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    setOpenGroupMap((prev) => {
      let changed = false;
      const next = { ...prev };

      MENU_GROUPS.forEach((group) => {
        if (!group.children?.length) {
          return;
        }

        const isGroupActive =
          isRouteActive(pathname, currentSearchParams, group) ||
          hasActiveChild(pathname, currentSearchParams, group.children);

        if (isGroupActive && next[group.id] !== true) {
          next[group.id] = true;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [currentSearchParams, pathname]);

  if (pathname === '/') {
    return null;
  }

  const handleToggleGroup = (groupId: string, isOpen: boolean) => {
    setOpenGroupMap((prev) => ({
      ...prev,
      [groupId]: !isOpen,
    }));
  };

  return (
    <>
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
          {MENU_GROUPS.map((group) => {
            const hasChildren = Boolean(group.children?.length);

            const isParentActive = isRouteActive(
              pathname,
              currentSearchParams,
              group,
            );

            const isChildActive = hasActiveChild(
              pathname,
              currentSearchParams,
              group.children,
            );

            const isGroupActive = isParentActive || isChildActive;

            const isOpen =
              isExpanded &&
              hasChildren &&
              (openGroupMap[group.id] ?? isGroupActive);

            return (
              <MenuGroupItem key={group.id}>
                <TopMenuRow
                  $isActive={isGroupActive}
                  $isExpanded={isExpanded}
                  title={isExpanded ? undefined : group.label}
                >
                  <TopMenuLink
                    href={group.href}
                    aria-current={isParentActive ? 'page' : undefined}
                    $isActive={isGroupActive}
                    $isExpanded={isExpanded}
                    $hasChildren={hasChildren}
                  >
                    <TopIconWrapper $isActive={isGroupActive}>
                      {group.icon}
                    </TopIconWrapper>

                    <TopMenuText $isExpanded={isExpanded}>
                      {group.label}
                    </TopMenuText>
                  </TopMenuLink>

                  {hasChildren && isExpanded && (
                    <DropdownButton
                      type="button"
                      aria-label={`${group.label} 하위 메뉴 ${
                        isOpen ? '닫기' : '열기'
                      }`}
                      aria-expanded={isOpen}
                      onClick={() => handleToggleGroup(group.id, isOpen)}
                    >
                      <ChevronDown size={18} />
                    </DropdownButton>
                  )}
                </TopMenuRow>

                {hasChildren && (
                  <SubMenu
                    $isOpen={isOpen}
                    $isExpanded={isExpanded}
                    $itemCount={group.children?.length ?? 0}
                  >
                    {group.children?.map((child) => {
                      const isActive = isRouteActive(
                        pathname,
                        currentSearchParams,
                        child,
                      );

                      return (
                        <SubMenuItem key={child.id}>
                          <SubMenuLink
                            href={child.href}
                            aria-current={isActive ? 'page' : undefined}
                            $isActive={isActive}
                          >
                            <SubIconWrapper $isActive={isActive}>
                              {child.icon}
                            </SubIconWrapper>

                            <SubMenuText>{child.label}</SubMenuText>
                          </SubMenuLink>
                        </SubMenuItem>
                      );
                    })}
                  </SubMenu>
                )}
              </MenuGroupItem>
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

      <FloatingChatbotAssistant />
    </>
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
  width: ${({ $isExpanded }) => ($isExpanded ? '292px' : '80px')};
  min-width: ${({ $isExpanded }) => ($isExpanded ? '292px' : '80px')};
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
  width: ${({ $isExpanded }) => ($isExpanded ? '210px' : '0')};
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

const ScrollableMenu = styled.nav`
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
  gap: 8px;
  padding: 0 14px 20px;
  margin: 0;
  list-style: none;
`;

const MenuGroupItem = styled.li`
  width: 100%;
`;

const TopMenuRow = styled.div<{
  $isActive: boolean;
  $isExpanded: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '46px')};
  height: 54px;
  margin: 0 auto;
  border-radius: 16px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-active-surface)' : 'transparent'};
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive
        ? 'var(--sidebar-active-strong-surface)'
        : 'var(--sidebar-surface-hover)'};
  }
`;

const TopMenuLink = styled(Link)<{
  $isActive: boolean;
  $isExpanded: boolean;
  $hasChildren: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'flex-start' : 'center'};
  gap: ${({ $isExpanded }) => ($isExpanded ? '14px' : '0')};
  width: ${({ $isExpanded, $hasChildren }) => {
    if (!$isExpanded) {
      return '46px';
    }

    return $hasChildren ? 'calc(100% - 42px)' : '100%';
  }};
  height: 100%;
  min-width: 0;
  padding: ${({ $isExpanded }) => ($isExpanded ? '0 14px' : '0')};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-text-primary)' : 'var(--sidebar-text-secondary)'};
  text-decoration: none;
  transition: color 160ms ease;

  &:focus-visible {
    border-radius: 14px;
    outline: 3px solid var(--sidebar-focus);
    outline-offset: -2px;
  }
`;

const TopIconWrapper = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  min-width: 24px;
  height: 24px;
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)'};
  transition: color 160ms ease;
`;

const TopMenuText = styled.span<{ $isExpanded: boolean }>`
  max-width: ${({ $isExpanded }) => ($isExpanded ? '180px' : '0')};
  overflow: hidden;
  color: inherit;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.04em;
  white-space: nowrap;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition:
    max-width 220ms ease,
    opacity 160ms ease;
`;

const DropdownButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  margin-right: 6px;
  border-radius: 12px;
  color: var(--sidebar-icon);
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &[aria-expanded='true'] {
    color: var(--sidebar-icon-active);

    svg {
      transform: rotate(180deg);
    }
  }

  svg {
    transition: transform 180ms ease;
  }

  &:hover {
    background: var(--sidebar-surface-hover);
    color: var(--sidebar-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--sidebar-focus);
    outline-offset: 2px;
  }
`;

const SubMenu = styled.ul<{
  $isOpen: boolean;
  $isExpanded: boolean;
  $itemCount: number;
}>`
  display: grid;
  gap: 4px;
  max-height: ${({ $isOpen, $isExpanded, $itemCount }) =>
    $isOpen && $isExpanded ? `${$itemCount * 44 + 12}px` : '0'};
  padding: ${({ $isOpen, $isExpanded }) =>
    $isOpen && $isExpanded ? '6px 0 4px 34px' : '0 0 0 34px'};
  margin: 0;
  overflow: hidden;
  border-left: ${({ $isOpen, $isExpanded }) =>
    $isOpen && $isExpanded ? '1px solid var(--sidebar-border)' : '0'};
  list-style: none;
  opacity: ${({ $isOpen, $isExpanded }) => ($isOpen && $isExpanded ? 1 : 0)};
  transition:
    max-height 220ms cubic-bezier(0.22, 1, 0.36, 1),
    padding 220ms ease,
    opacity 160ms ease;
`;

const SubMenuItem = styled.li`
  width: 100%;
`;

const SubMenuLink = styled(Link)<{
  $isActive: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 13px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-child-active-surface)' : 'transparent'};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-text-primary)' : 'var(--sidebar-text-secondary)'};
  text-decoration: none;
  transition:
    background 160ms ease,
    color 160ms ease;

  &:hover {
    background: ${({ $isActive }) =>
      $isActive
        ? 'var(--sidebar-child-active-surface)'
        : 'var(--sidebar-surface-hover)'};
    color: var(--sidebar-text-primary);
  }

  &:focus-visible {
    outline: 3px solid var(--sidebar-focus);
    outline-offset: 2px;
  }
`;

const SubIconWrapper = styled.div<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  min-width: 18px;
  height: 18px;
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)'};
  transition: color 160ms ease;
`;

const SubMenuText = styled.span`
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BottomSection = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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