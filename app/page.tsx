'use client';

import { useMemo, useRef, useState } from 'react';

import { useThemeStore } from '@/store/useThemeStore';

import DashboardHero from '@/components/intro/DashboardHero';
import MenuGrid from '@/components/intro/MenuGrid';
import SystemStatusStrip from '@/components/intro/SystemStatusStrip';
import { FACTORY_MENU_ITEMS } from '@/model/intro/menuItems';
import { ContentFrame, FooterNote, LandingThemeScope, PageShell } from '@/styles/intro/styles';

export default function FactoryDashboardPage() {
  const isDark = useThemeStore((state) => state.isDark);
  const menuSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState(FACTORY_MENU_ITEMS[0]?.id ?? '');

  const activeIndex = useMemo(() => {
    const foundIndex = FACTORY_MENU_ITEMS.findIndex((item) => item.id === activeId);

    return foundIndex >= 0 ? foundIndex : 0;
  }, [activeId]);

  const activeItem = FACTORY_MENU_ITEMS[activeIndex] ?? FACTORY_MENU_ITEMS[0];

  const handleDeactivate = () => {
    setActiveId(FACTORY_MENU_ITEMS[0]?.id ?? '');
  };

  const handleScrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <LandingThemeScope $isDark={isDark}>
      <PageShell>
        <ContentFrame>
          <DashboardHero
            activeItem={activeItem}
            activeIndex={activeIndex}
            totalCount={FACTORY_MENU_ITEMS.length}
            onScrollToMenu={handleScrollToMenu}
          />

          <SystemStatusStrip />

          <div ref={menuSectionRef}>
            <MenuGrid
              items={FACTORY_MENU_ITEMS}
              activeId={activeId}
              onActivate={setActiveId}
              onDeactivate={handleDeactivate}
            />
          </div>

          <FooterNote>
            <span>
              <strong>Smart Factory OS</strong> · make by DXS
            </span>
          </FooterNote>
        </ContentFrame>
      </PageShell>
    </LandingThemeScope>
  );
}
