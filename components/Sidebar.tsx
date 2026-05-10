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
  exact?: boolean;
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
        href: '/no-work',
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
        exact: true,
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
  accent: string;
  accentSoft: string;
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
    border: '#e6e6e6',
    surfaceHover: '#f7f7f8',
    activeSurface: '#f8f9fb',
    activeStrongSurface: '#f2f5fb',
    childSurface: '#ffffff',
    childActiveSurface: '#f7f8fa',
    textPrimary: '#111111',
    textSecondary: '#525252',
    textMuted: '#9a9a9a',
    icon: '#707070',
    iconActive: '#2563eb',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    logoBg: '#111111',
    logoMark: '#ffffff',
    toggleBg: '#f3f4f6',
    toggleBorder: '#dedede',
    toggleThumb: '#ffffff',
    toggleIconActive: '#2563eb',
    focus: 'rgba(37, 99, 235, 0.18)',
  },
  dark: {
    background: '#141414',
    border: '#2a2a2a',
    surfaceHover: '#1b1b1b',
    activeSurface: '#1a1a1a',
    activeStrongSurface: '#202020',
    childSurface: '#141414',
    childActiveSurface: '#1a1a1a',
    textPrimary: '#f5f5f5',
    textSecondary: '#b8b8b8',
    textMuted: '#777777',
    icon: '#888888',
    iconActive: '#2563eb',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.14)',
    logoBg: '#2563eb',
    logoMark: '#ffffff',
    toggleBg: '#1a1a1a',
    toggleBorder: '#303030',
    toggleThumb: '#f5f5f5',
    toggleIconActive: '#2563eb',
    focus: 'rgba(37, 99, 235, 0.32)',
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

  --sidebar-accent: ${theme.accent};
  --sidebar-accent-soft: ${theme.accentSoft};

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

  const isPathMatched = item.exact
    ? pathname === matchPath
    : pathname === matchPath || pathname.startsWith(`${matchPath}/`);

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
  width: ${({ $isExpanded }) => ($isExpanded ? '286px' : '76px')};
  min-width: ${({ $isExpanded }) => ($isExpanded ? '286px' : '76px')};
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  border-right: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
  color: var(--sidebar-text-primary);
  transition:
    width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    min-width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background 160ms ease,
    border-color 160ms ease;
`;

const Header = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  height: 86px;
  flex-shrink: 0;
  padding: ${({ $isExpanded }) => ($isExpanded ? '26px 18px' : '26px 0')};
  border-bottom: 1px solid var(--sidebar-border);
  transition:
    padding 180ms ease,
    justify-content 180ms ease;
`;

const LogoWrapper = styled(Link)<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: ${({ $isExpanded }) => ($isExpanded ? '210px' : '0')};
  min-width: 0;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
  transition:
    width 180ms ease,
    opacity 140ms ease;
`;

const LogoIcon = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border: 1px solid var(--sidebar-border);
  border-radius: 8px;
  background: var(--sidebar-bg);

  &::before {
    position: absolute;
    top: 7px;
    bottom: 7px;
    left: 8px;
    width: 3px;
    border-radius: 3px;
    background: var(--sidebar-accent);
    content: '';
  }

  &::after {
    position: absolute;
    top: 7px;
    right: 8px;
    bottom: 7px;
    left: 15px;
    border: 1px solid var(--sidebar-text-muted);
    border-radius: 3px;
    content: '';
    opacity: 0.7;
  }
`;

const LogoText = styled.span`
  color: var(--sidebar-text-primary);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.045em;
`;

const CollapseButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--sidebar-icon);
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease;

  &:hover {
    border-color: var(--sidebar-border);
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
  padding-top: 14px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px 20px;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '48px')};
  height: 54px;
  margin: 0 auto;
  border: 1px solid ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-border)' : 'transparent'};
  border-radius: 10px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-active-surface)' : 'transparent'};
  transition:
    border-color 140ms ease,
    background 140ms ease;

  &::before {
    position: absolute;
    top: 13px;
    bottom: 13px;
    left: ${({ $isExpanded }) => ($isExpanded ? '0' : '5px')};
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--sidebar-accent);
    content: '';
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
    transition: opacity 140ms ease;
  }

  &:hover {
    border-color: var(--sidebar-border);
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
  gap: ${({ $isExpanded }) => ($isExpanded ? '13px' : '0')};
  width: ${({ $isExpanded, $hasChildren }) => {
    if (!$isExpanded) {
      return '48px';
    }

    return $hasChildren ? 'calc(100% - 40px)' : '100%';
  }};
  height: 100%;
  min-width: 0;
  padding: ${({ $isExpanded }) => ($isExpanded ? '0 12px 0 17px' : '0')};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-text-primary)' : 'var(--sidebar-text-secondary)'};
  text-decoration: none;
  transition: color 140ms ease;

  &:focus-visible {
    border-radius: 9px;
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
  transition: color 140ms ease;
`;

const TopMenuText = styled.span<{ $isExpanded: boolean }>`
  max-width: ${({ $isExpanded }) => ($isExpanded ? '178px' : '0')};
  overflow: hidden;
  color: inherit;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.04em;
  white-space: nowrap;
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition:
    max-width 180ms ease,
    opacity 140ms ease;
`;

const DropdownButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  margin-right: 4px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: var(--sidebar-icon);
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease;

  &[aria-expanded='true'] {
    color: var(--sidebar-text-primary);

    svg {
      transform: rotate(180deg);
    }
  }

  svg {
    transition: transform 160ms ease;
  }

  &:hover {
    border-color: var(--sidebar-border);
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
  gap: 3px;
  max-height: ${({ $isOpen, $isExpanded, $itemCount }) =>
    $isOpen && $isExpanded ? `${$itemCount * 42 + 14}px` : '0'};
  padding: ${({ $isOpen, $isExpanded }) =>
    $isOpen && $isExpanded ? '7px 0 8px 24px' : '0 0 0 24px'};
  margin: 0 0 0 18px;
  overflow: hidden;
  border-left: ${({ $isOpen, $isExpanded }) =>
    $isOpen && $isExpanded ? '1px solid var(--sidebar-border)' : '0'};
  list-style: none;
  opacity: ${({ $isOpen, $isExpanded }) => ($isOpen && $isExpanded ? 1 : 0)};
  transition:
    max-height 200ms cubic-bezier(0.22, 1, 0.36, 1),
    padding 180ms ease,
    opacity 140ms ease;
`;

const SubMenuItem = styled.li`
  width: 100%;
`;

const SubMenuLink = styled(Link)<{
  $isActive: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 38px;
  padding: 0 11px;
  border: 1px solid ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-border)' : 'transparent'};
  border-radius: 9px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-child-active-surface)' : 'transparent'};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--sidebar-text-primary)' : 'var(--sidebar-text-secondary)'};
  text-decoration: none;
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease;

  &:hover {
    border-color: var(--sidebar-border);
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
  transition: color 140ms ease;
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
  padding: ${({ $isExpanded }) => ($isExpanded ? '14px 12px' : '14px 10px')};
  border-top: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
`;

const ThemeToggleButton = styled.button<{ $isExpanded: boolean }>`
  ${buttonReset};

  display: flex;
  align-items: center;
  justify-content: ${({ $isExpanded }) =>
    $isExpanded ? 'space-between' : 'center'};
  width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '56px')};
  min-height: 50px;
  padding: ${({ $isExpanded }) => ($isExpanded ? '8px 10px 8px 12px' : '0')};
  border: 1px solid transparent;
  border-radius: 12px;
  color: var(--sidebar-text-primary);
  transition:
    border-color 140ms ease,
    background 140ms ease,
    color 140ms ease;

  &:hover {
    border-color: var(--sidebar-border);
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
    max-width 180ms ease,
    opacity 140ms ease;
`;

const ThemeToggleTitle = styled.span`
  color: var(--sidebar-text-primary);
  font-size: 14px;
  font-weight: 800;
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
  width: 54px;
  height: 30px;
  flex: 0 0 auto;
  padding: 0 7px;
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
  transition: color 140ms ease;
`;

const ThemeSwitchThumb = styled.span<{ $isDark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  border: 1px solid var(--sidebar-toggle-border);
  border-radius: 999px;
  background: var(--sidebar-toggle-thumb);
  transform: translateX(${({ $isDark }) => ($isDark ? '24px' : '0')});
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 140ms ease,
    border-color 140ms ease;
`;
