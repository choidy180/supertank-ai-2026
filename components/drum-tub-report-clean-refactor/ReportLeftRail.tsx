import { Layers3 } from 'lucide-react';

import {
  AnchorButton,
  AnchorList,
  Badge,
  CardHeader,
  CardTitle,
  InfoItem,
  InfoList,
  LeftRail,
  ProgressBlock,
  ProgressCaption,
  ProgressFill,
  ProgressTrack,
  SideCard,
} from '@/styles/drum-tub-report-clean-refactor/styles';
import { ReportMeta } from '@/model/drum-tub-report-clean-refactor/types';

type ReportLeftRailProps = {
  reportMeta: ReportMeta;
  completionRate: number;
  sectionAnchors: string[];
};

const ReportLeftRail = ({
  reportMeta,
  completionRate,
  sectionAnchors,
}: ReportLeftRailProps) => {
  return (
    <LeftRail>
      <SideCard>
        <CardHeader>
          <CardTitle>검사 개요</CardTitle>
          <Badge $tone="info">{reportMeta.revision}</Badge>
        </CardHeader>

        <InfoList>
          <InfoItem>
            <span>문서번호</span>
            <strong>{reportMeta.documentNo}</strong>
          </InfoItem>
          <InfoItem>
            <span>모델</span>
            <strong>{reportMeta.model}</strong>
          </InfoItem>
          <InfoItem>
            <span>라인</span>
            <strong>{reportMeta.line}</strong>
          </InfoItem>
          <InfoItem>
            <span>검사자</span>
            <strong>{reportMeta.inspector}</strong>
          </InfoItem>
        </InfoList>
      </SideCard>

      <SideCard>
        <CardHeader>
          <CardTitle>작성 진행률</CardTitle>
          <Badge $tone="ok">{completionRate}%</Badge>
        </CardHeader>

        <ProgressBlock>
          <ProgressTrack>
            <ProgressFill $percent={completionRate} />
          </ProgressTrack>
          <ProgressCaption>
            기준값 입력 후 미입력 항목은 자동으로 표시됩니다.
          </ProgressCaption>
        </ProgressBlock>
      </SideCard>

      <SideCard>
        <CardHeader>
          <CardTitle>섹션 이동</CardTitle>
          <Layers3 size={17} />
        </CardHeader>

        <AnchorList>
          {sectionAnchors.map((section) => (
            <AnchorButton key={section} type="button">
              {section}
            </AnchorButton>
          ))}
        </AnchorList>
      </SideCard>
    </LeftRail>
  );
};

export default ReportLeftRail;
