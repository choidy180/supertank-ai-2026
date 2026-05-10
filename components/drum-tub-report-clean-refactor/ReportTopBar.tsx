import { Download, Printer, Search } from 'lucide-react';

import type { ReportMeta } from '@/model/drum-tub-report-clean-refactor/types';
import {
  Eyebrow,
  GhostActionButton,
  HeroBlock,
  HeroText,
  PageDescription,
  PageTitle,
  PrimaryActionButton,
  SearchBox,
  TopActions,
  TopBar,
} from '@/styles/drum-tub-report-clean-refactor/styles';

type ReportTopBarProps = {
  reportMeta: ReportMeta;
  onPrint: () => void;
  onCsvDownload: () => void;
};

const ReportTopBar = ({ reportMeta, onPrint, onCsvDownload }: ReportTopBarProps) => {
  return (
    <TopBar>
      <HeroBlock>
        <HeroText>
          <Eyebrow>Inspection Report</Eyebrow>
          <PageTitle>{reportMeta.title}</PageTitle>
          <PageDescription>
            종이 검사 Sheet를 웹 화면에서 바로 확인하고 입력할 수 있도록 구성한 보고서 화면입니다.
          </PageDescription>
        </HeroText>
      </HeroBlock>

      <TopActions>
        <SearchBox>
          <Search size={16} />
          <span>검사항목 검색</span>
        </SearchBox>

        <GhostActionButton type="button" onClick={onCsvDownload}>
          <Download size={16} />
          CSV
        </GhostActionButton>

        <PrimaryActionButton type="button" onClick={onPrint}>
          <Printer size={16} />
          PDF 저장
        </PrimaryActionButton>
      </TopActions>
    </TopBar>
  );
};

export default ReportTopBar;
