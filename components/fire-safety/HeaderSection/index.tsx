import {
  Eyebrow,
  HeaderPill,
  LiveDot,
  MainTitle,
  Subtitle,
  TitleBlock,
  TopBar,
  TopStats
} from './styles';

interface HeaderSectionProps {
  inspectionCount: number;
  stableCount: number;
  dueSoonCount: number;
  replaceNowCount: number;
}

const HeaderSection = ({
  inspectionCount,
  stableCount,
  dueSoonCount,
  replaceNowCount
}: HeaderSectionProps) => {
  return (
    <TopBar>
      <TitleBlock>
        {/* <MainTitle>소방 설비 점검 대시보드</MainTitle> */}
      </TitleBlock>

      <TopStats>
        <HeaderPill $tone="blue">
          <LiveDot />
          실시간 점검 {inspectionCount}건
        </HeaderPill>
        <HeaderPill $tone="green">정상 {stableCount}</HeaderPill>
        <HeaderPill $tone="amber">교체도래 {dueSoonCount}</HeaderPill>
        <HeaderPill $tone="red">교체필요 {replaceNowCount}</HeaderPill>
      </TopStats>
    </TopBar>
  );
};

export default HeaderSection;
