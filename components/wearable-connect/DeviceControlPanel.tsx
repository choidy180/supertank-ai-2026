import { LuPlus, LuRadar, LuRefreshCw } from 'react-icons/lu';


import {
  ControlPanel,
  PanelActions,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  PrimaryToolButton,
  SecondaryButton,
  TargetList,
  ToolButton,
} from '@/styles/wearable-connect/styles';
import { TargetCard } from './TargetCard';
import { ContextMeta, StreamTarget } from '@/types/wearable-connect/types';

type DeviceControlPanelProps = {
  pageMeta: ContextMeta;
  targets: StreamTarget[];
  selectedTargetId: string | null;
  onOpenScanner: () => void;
  onOpenAdd: () => void;
  onCheckAll: () => void;
  onCheckTarget: (target: StreamTarget) => Promise<unknown>;
  onConnectTarget: (target: StreamTarget) => Promise<void>;
  onDeleteTarget: (targetId: string) => void;
};

export function DeviceControlPanel({
  pageMeta,
  targets,
  selectedTargetId,
  onOpenScanner,
  onOpenAdd,
  onCheckAll,
  onCheckTarget,
  onConnectTarget,
  onDeleteTarget,
}: DeviceControlPanelProps) {
  return (
    <ControlPanel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>스트림 장비 선택</PanelTitle>
          <PanelCaption>{pageMeta.helperText}</PanelCaption>
        </PanelTitleGroup>

        <PanelActions>
          <ToolButton type="button" onClick={onOpenScanner}>
            <LuRadar size={16} />
            근처 활성 IP 찾기
          </ToolButton>

          <PrimaryToolButton type="button" onClick={onOpenAdd}>
            <LuPlus size={16} />
            장비 직접 추가
          </PrimaryToolButton>

          <SecondaryButton type="button" onClick={onCheckAll}>
            <LuRefreshCw size={15} />
            전체 확인
          </SecondaryButton>
        </PanelActions>
      </PanelHeader>

      <TargetList>
        {targets.map((target) => (
          <TargetCard
            key={target.id}
            target={target}
            isSelected={selectedTargetId === target.id}
            disableDelete={targets.length <= 1}
            onCheck={(nextTarget) => void onCheckTarget(nextTarget)}
            onConnect={(nextTarget) => void onConnectTarget(nextTarget)}
            onDelete={onDeleteTarget}
          />
        ))}
      </TargetList>
    </ControlPanel>
  );
}
