import { ArrowUpRight } from 'lucide-react';

import type { FactoryMenuItem } from '@/model/intro//types';
import {
  CardArrow,
  CardBottom,
  CardCode,
  CardDescription,
  CardEyebrow,
  CardIcon,
  CardMetric,
  CardText,
  CardTitle,
  CardTop,
  MenuCardLink,
} from '@/styles/intro/styles';

interface MenuCardProps {
  item: FactoryMenuItem;
  isActive: boolean;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
}

const MenuCard = ({ item, isActive, onActivate, onDeactivate }: MenuCardProps) => {
  const Icon = item.Icon;

  return (
    <MenuCardLink
      href={item.href}
      $isActive={isActive}
      aria-current={isActive ? 'true' : undefined}
      onMouseEnter={() => onActivate(item.id)}
      onMouseLeave={onDeactivate}
      onFocus={() => onActivate(item.id)}
      onBlur={onDeactivate}
      onTouchStart={() => onActivate(item.id)}
      onTouchEnd={onDeactivate}
    >
      <CardTop>
        <CardIcon $isActive={isActive} aria-hidden="true">
          <Icon size={26} strokeWidth={1.8} />
        </CardIcon>

        <CardCode>{item.metric}</CardCode>
      </CardTop>

      <CardText>
        <CardEyebrow>{item.eyebrow}</CardEyebrow>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardText>

      <CardBottom>
        <CardMetric>
          <span>Entry</span>
          <strong>{item.metricLabel}</strong>
        </CardMetric>

        <CardArrow $isActive={isActive} aria-hidden="true">
          <ArrowUpRight size={20} />
        </CardArrow>
      </CardBottom>
    </MenuCardLink>
  );
};

export default MenuCard;
