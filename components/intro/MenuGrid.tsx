import type { FactoryMenuItem } from '@/model/intro/types';
import {
  MenuGrid as MenuGridContainer,
  MenuGridShell,
  SectionDescription,
  SectionHeader,
  SectionKicker,
  SectionTitle,
  SectionTitleGroup,
} from '@/styles/intro/styles';
import MenuCard from './MenuCard';

interface MenuGridProps {
  items: FactoryMenuItem[];
  activeId: string;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
}

const MenuGrid = ({ items, activeId, onActivate, onDeactivate }: MenuGridProps) => {
  return (
    <MenuGridShell>
      <SectionHeader>
        <SectionTitleGroup>
          <SectionKicker>Core Modules</SectionKicker>
          <SectionTitle>업무별 진입점</SectionTitle>
        </SectionTitleGroup>
      </SectionHeader>

      <MenuGridContainer>
        {items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onActivate={onActivate}
            onDeactivate={onDeactivate}
          />
        ))}
      </MenuGridContainer>
    </MenuGridShell>
  );
};

export default MenuGrid;
