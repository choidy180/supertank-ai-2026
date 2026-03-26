import type { FC } from 'react';

import {
  AutoRunButton,
  Eyebrow,
  HeaderActions,
  HeaderBar,
  HeaderPill,
  LiveDot,
  MainTitle,
  SubText,
  TitleBlock
} from './styles';

interface HeaderSectionProps {
  okCount: number;
  warningCount: number;
  errorCount: number;
  autoRun: boolean;
  onToggleAutoRun: () => void;
}

const HeaderSection: FC<HeaderSectionProps> = ({
  okCount,
  warningCount,
  errorCount,
  autoRun,
  onToggleAutoRun
}) => {
  return (
    <HeaderBar>
      <TitleBlock>
        <MainTitle>타임체크 대시보드</MainTitle>
      </TitleBlock>

      <HeaderActions>
        <HeaderPill $tone="live">
          <LiveDot />
          실시간 모니터링
        </HeaderPill>
        <HeaderPill $tone="ok">정상 {okCount}</HeaderPill>
        <HeaderPill $tone="warning">주의 {warningCount}</HeaderPill>
        <HeaderPill $tone="error">중단 {errorCount}</HeaderPill>

        <AutoRunButton
          type="button"
          $active={autoRun}
          onClick={onToggleAutoRun}
        >
          {autoRun ? '자동 시뮬레이션 ON' : '자동 시뮬레이션 OFF'}
        </AutoRunButton>
      </HeaderActions>
    </HeaderBar>
  );
};

export default HeaderSection;
