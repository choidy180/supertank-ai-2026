import { CalendarDays, FileText, PenLine, SunMedium } from 'lucide-react';

import { getValueTone } from '@/model/drum-tub-report-clean-refactor/helpers';
import type { ApprovalStep, ReportMeta, ReportRowWithMeta } from '@/model/drum-tub-report-clean-refactor/types';
import {
  ApprovalCell,
  ApprovalPanel,
  DocumentSubtitle,
  DocumentTitle,
  DocumentTitleBlock,
  EmptyReference,
  FooterNote,
  FooterStamp,
  GroupCell,
  GroupName,
  ItemCell,
  LotNotice,
  MemoCell,
  MetaCell,
  MetaPanel,
  MiniLabel,
  ReferenceCell,
  ReferenceGrid,
  ReportFooter,
  ReportHeader,
  ReportPaper,
  ReportTable,
  ReportTableShell,
  ReportWorkspace,
  SpecCell,
  ValueCell,
  ValuePill,
} from '@/styles/drum-tub-report-clean-refactor/styles';
import ReportReferencePreview from './ReportReferencePreview';

type ReportDocumentProps = {
  reportMeta: ReportMeta;
  approvalSteps: ApprovalStep[];
  rows: ReportRowWithMeta[];
};

const ReportDocument = ({ reportMeta, approvalSteps, rows }: ReportDocumentProps) => {
  return (
    <ReportWorkspace>
      <ReportPaper>
        <ReportHeader>
          <DocumentTitleBlock>
            <MiniLabel>표준 검사 양식</MiniLabel>
            <DocumentTitle>{reportMeta.title}</DocumentTitle>
            <DocumentSubtitle>{reportMeta.subtitle}</DocumentSubtitle>
          </DocumentTitleBlock>

          <MetaPanel>
            <MetaCell>
              <CalendarDays size={16} />
              <span>일자</span>
              <strong>{reportMeta.date}</strong>
            </MetaCell>
            <MetaCell>
              <PenLine size={16} />
              <span>작업자</span>
              <strong>{reportMeta.inspector}</strong>
            </MetaCell>
            <MetaCell>
              <SunMedium size={16} />
              <span>근무</span>
              <strong>{reportMeta.shift}</strong>
            </MetaCell>
          </MetaPanel>

          <ApprovalPanel>
            {approvalSteps.map((step) => (
              <ApprovalCell key={step.label} $status={step.status}>
                <span>{step.label}</span>
                <strong>{step.name}</strong>
                <small>{step.role}</small>
              </ApprovalCell>
            ))}
          </ApprovalPanel>
        </ReportHeader>

        <LotNotice>
          <FileText size={16} />
          <span>Lot별 검사수량: {reportMeta.lotNo}</span>
        </LotNotice>

        <ReportTableShell>
          <ReportTable>
            <colgroup>
              <col style={{ width: '112px' }} />
              <col style={{ width: '184px' }} />
              <col style={{ width: '250px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '112px' }} />
              <col style={{ width: '112px' }} />
              <col style={{ width: '112px' }} />
              <col style={{ width: '112px' }} />
              <col style={{ width: '200px' }} />
            </colgroup>

            <thead>
              <tr>
                <th>구분</th>
                <th>검사 항목</th>
                <th>규격 / 기준</th>
                <th>참조 이미지</th>
                <th>1차</th>
                <th>2차</th>
                <th>3차</th>
                <th>4차</th>
                <th>비고</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {row.isFirstInGroup && (
                    <GroupCell rowSpan={row.groupSpan}>
                      <GroupName>{row.group}</GroupName>
                    </GroupCell>
                  )}

                  <ItemCell>
                    <strong>{row.item}</strong>
                  </ItemCell>

                  <SpecCell>
                    {row.spec.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </SpecCell>

                  <ReferenceCell>
                    {row.refs?.length ? (
                      <ReferenceGrid>
                        {row.refs.map((ref) => (
                          <ReportReferencePreview key={ref} label={ref} />
                        ))}
                      </ReferenceGrid>
                    ) : (
                      <EmptyReference>-</EmptyReference>
                    )}
                  </ReferenceCell>

                  {row.values.map((value, index) => (
                    <ValueCell key={`${row.id}-${index}`}>
                      <ValuePill $tone={getValueTone(value)}>{value}</ValuePill>
                    </ValueCell>
                  ))}

                  <MemoCell>{row.memo ?? '기준 내 확인'}</MemoCell>
                </tr>
              ))}
            </tbody>
          </ReportTable>
        </ReportTableShell>

        <ReportFooter>
          <FooterNote>* The best quality company</FooterNote>
          <FooterStamp>QMS DIGITAL SHEET</FooterStamp>
        </ReportFooter>
      </ReportPaper>
    </ReportWorkspace>
  );
};

export default ReportDocument;
