import { LuRefreshCw, LuX } from 'react-icons/lu';

import type { StreamTarget } from '@/types/wearable-connect/types';
import {
  getAccessLabel,
  getStatusDescription,
  getStatusLabel,
  getStreamUrl,
} from '@/utils/wearable-connect/target';
import {
  ConnectButton,
  DeleteButton,
  GhostButton,
  StatusBadge,
  TargetActions,
  TargetAddress,
  TargetCard as TargetCardShell,
  TargetDescription,
  TargetMain,
  TargetName,
  TargetTitleGroup,
  TargetTop,
} from '@/styles/wearable-connect/styles';

type TargetCardProps = {
  target: StreamTarget;
  isSelected: boolean;
  disableDelete: boolean;
  onCheck: (target: StreamTarget) => void;
  onConnect: (target: StreamTarget) => void;
  onDelete: (targetId: string) => void;
};

export function TargetCard({
  target,
  isSelected,
  disableDelete,
  onCheck,
  onConnect,
  onDelete,
}: TargetCardProps) {
  return (
    <TargetCardShell $status={target.status} $selected={isSelected}>
      <TargetMain>
        <TargetTop>
          <TargetTitleGroup>
            <TargetName>
              <StatusBadge $status={target.status}>
                {getStatusLabel(target.status)}
              </StatusBadge>
              <span>{target.label}</span>
            </TargetName>

            <TargetAddress>{getStreamUrl(target)}</TargetAddress>
          </TargetTitleGroup>
        </TargetTop>

        <TargetDescription>
          {target.lastCheckedAt
            ? `마지막 확인 ${target.lastCheckedAt}`
            : getStatusDescription(target.status)}
        </TargetDescription>
      </TargetMain>

      <TargetActions>
        <GhostButton type="button" onClick={() => onCheck(target)}>
          <LuRefreshCw size={14} />
          확인
        </GhostButton>

        <ConnectButton
          type="button"
          disabled={target.status === 'checking'}
          onClick={() => onConnect(target)}
        >
          {isSelected ? '연결됨' : '선택'}
        </ConnectButton>

        <DeleteButton
          type="button"
          aria-label={`${getAccessLabel(target)} 삭제`}
          disabled={disableDelete}
          onClick={() => onDelete(target.id)}
        >
          <LuX size={14} />
          삭제
        </DeleteButton>
      </TargetActions>
    </TargetCardShell>
  );
}
