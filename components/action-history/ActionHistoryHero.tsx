import type { ActionContextMeta, ActionHistoryContext } from '@/model/action-history/types';
import {
  ContextLink,
  ContextSwitch,
  Eyebrow,
  HeroTextGroup,
  PageDescription,
  PageHero,
  PageTitle,
} from '@/styles/action-history/styles';

interface ActionHistoryHeroProps {
  context: ActionHistoryContext;
  meta: ActionContextMeta;
}

const ActionHistoryHero = ({ context, meta }: ActionHistoryHeroProps) => {
  return (
    <PageHero>
      <HeroTextGroup>
        <Eyebrow>{meta.badge}</Eyebrow>
        <PageTitle>{meta.title}</PageTitle>
        <PageDescription>{meta.description}</PageDescription>
      </HeroTextGroup>

      <ContextSwitch aria-label="조치 이력 컨텍스트 선택">
        <ContextLink
          href="/action-history?context=defect-tracking"
          $active={context === 'defect-tracking'}
        >
          불량역추적
        </ContextLink>
        <ContextLink href="/action-history?context=no-work" $active={context === 'no-work'}>
          무작업관리
        </ContextLink>
      </ContextSwitch>
    </PageHero>
  );
};

export default ActionHistoryHero;
