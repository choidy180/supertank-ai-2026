import { ArrowUpRight } from 'lucide-react';

import type { FactoryMenuItem } from '@/model/intro//types';
import {
  HeroActionRow,
  HeroCopy,
  HeroDescription,
  HeroKicker,
  HeroLayout,
  HeroPreview,
  HeroTitle,
  PreviewDescription,
  PreviewEyebrow,
  PreviewFooter,
  PreviewIconFrame,
  PreviewIndex,
  PreviewLabelGroup,
  PreviewLink,
  PreviewMeta,
  PreviewTitle,
  PreviewTop,
  PrimaryHeroLink,
  SecondaryHeroButton,
} from '@/styles/intro/styles';

interface DashboardHeroProps {
  activeItem: FactoryMenuItem;
  activeIndex: number;
  totalCount: number;
  onScrollToMenu: () => void;
}

const DashboardHero = ({
  activeItem,
  activeIndex,
  totalCount,
  onScrollToMenu,
}: DashboardHeroProps) => {
  const ActiveIcon = activeItem.Icon;
  const formattedIndex = String(activeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalCount).padStart(2, '0');

  return (
    <HeroLayout>
      <HeroCopy>
        <HeroKicker>Smart Factory</HeroKicker>

        <HeroTitle>
          현장 운영을 <span>한 화면</span>에서.
        </HeroTitle>

        <HeroDescription>
          불량, 점검, 안전, 입고, 운영 지표까지 핵심 업무를 빠르게 진입할 수
          있는 스마트팩토리 커맨드 페이지입니다.
        </HeroDescription>

        <HeroActionRow>
          <PrimaryHeroLink href={activeItem.href}>
            현재 선택 모듈 열기
            <ArrowUpRight size={17} />
          </PrimaryHeroLink>

          <SecondaryHeroButton type="button" onClick={onScrollToMenu}>
            전체 모듈 보기
          </SecondaryHeroButton>
        </HeroActionRow>
      </HeroCopy>

      <HeroPreview aria-label="선택된 모듈 미리보기">
        <PreviewTop>
          <PreviewLabelGroup>
            <PreviewEyebrow>{activeItem.eyebrow}</PreviewEyebrow>
            <PreviewTitle>{activeItem.title}</PreviewTitle>
          </PreviewLabelGroup>

          <PreviewIndex>
            {formattedIndex}/{formattedTotal}
          </PreviewIndex>
        </PreviewTop>

        <PreviewIconFrame aria-hidden="true">
          <ActiveIcon size={38} strokeWidth={1.7} />
        </PreviewIconFrame>

        <PreviewDescription>{activeItem.description}</PreviewDescription>

        <PreviewFooter>
          <PreviewMeta>
            <span>Module</span>
            <strong>{activeItem.metricLabel}</strong>
          </PreviewMeta>

          <PreviewLink href={activeItem.href}>
            진입
            <ArrowUpRight size={16} />
          </PreviewLink>
        </PreviewFooter>
      </HeroPreview>
    </HeroLayout>
  );
};

export default DashboardHero;
