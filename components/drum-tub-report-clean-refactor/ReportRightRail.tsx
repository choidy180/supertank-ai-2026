import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Download,
  Printer,
} from 'lucide-react';

import { getToneLabel } from '@/model/drum-tub-report-clean-refactor/helpers';
import type { ActivityLog, ApprovalStep } from '@/model/drum-tub-report-clean-refactor/types';
import {
  ActionStack,
  ActivityItem,
  ActivityList,
  ActivityTop,
  ApprovalTimeline,
  Badge,
  CardHeader,
  CardTitle,
  RightRail,
  SideCard,
  TimelineDot,
  TimelineItem,
  WideButton,
  WideGhostButton,
} from '@/styles/drum-tub-report-clean-refactor/styles';

type ReportRightRailProps = {
  approvalSteps: ApprovalStep[];
  activityLogs: ActivityLog[];
  onPrint: () => void;
  onCsvDownload: () => void;
};

const ReportRightRail = ({
  approvalSteps,
  activityLogs,
  onPrint,
  onCsvDownload,
}: ReportRightRailProps) => {
  return (
    <RightRail>
      <SideCard>
        <CardHeader>
          <CardTitle>승인 상태</CardTitle>
          <Badge $tone="warn">검토 중</Badge>
        </CardHeader>

        <ApprovalTimeline>
          {approvalSteps.map((step) => (
            <TimelineItem key={step.label} $done={step.status === 'done'}>
              <TimelineDot>
                {step.status === 'done' ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertTriangle size={14} />
                )}
              </TimelineDot>
              <div>
                <strong>{step.label}</strong>
                <span>
                  {step.name} · {step.role}
                </span>
              </div>
            </TimelineItem>
          ))}
        </ApprovalTimeline>
      </SideCard>

      <SideCard $scroll>
        <CardHeader>
          <CardTitle>실시간 입력 이력</CardTitle>
          <Badge $tone="info">Live</Badge>
        </CardHeader>

        <ActivityList>
          {activityLogs.map((log) => (
            <ActivityItem key={log.id} $tone={log.tone}>
              <ActivityTop>
                <span>{log.time}</span>
                <Badge $tone={log.tone}>{getToneLabel(log.tone)}</Badge>
              </ActivityTop>
              <strong>{log.title}</strong>
              <p>{log.desc}</p>
            </ActivityItem>
          ))}
        </ActivityList>
      </SideCard>

      <SideCard style={{minHeight:'140px'}}>
        <CardHeader>
          <CardTitle>보고서 액션</CardTitle>
          <BadgeCheck size={17} />
        </CardHeader>

        <ActionStack>
          <WideButton type="button" onClick={onPrint}>
            <Printer size={17} />
            PDF 다운로드 / 인쇄
          </WideButton>
          <WideGhostButton type="button" onClick={onCsvDownload}>
            <Download size={17} />
            Summary CSV 다운로드
          </WideGhostButton>
        </ActionStack>
      </SideCard>
    </RightRail>
  );
};

export default ReportRightRail;
