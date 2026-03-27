'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { getLogToneColor } from '../model/helpers';
import { SystemLogItem } from '../model/types';

interface SystemLogPanelProps {
  logs: SystemLogItem[];
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const Panel = styled.aside`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 14px;
  padding: 18px 18px 16px;
  border-radius: 24px;
  border: 1px solid rgba(106, 143, 220, 0.16);
  background:
    radial-gradient(circle at 100% 0%, rgba(70, 104, 184, 0.12) 0%, rgba(70, 104, 184, 0) 28%),
    linear-gradient(180deg, rgba(10, 18, 36, 0.98) 0%, rgba(5, 11, 24, 0.98) 100%);
  box-shadow:
    0 24px 68px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 900;
  color: var(--monitor-white);
`;

const Chevron = styled.span`
  width: 12px;
  height: 12px;
  border-right: 2px solid rgba(255, 255, 255, 0.9);
  border-bottom: 2px solid rgba(255, 255, 255, 0.9);
  transform: rotate(-45deg);
`;

const SubTitle = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.82);
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(98, 163, 255, 0.26)' : 'rgba(112, 150, 220, 0.14)')};
  background: ${({ $active }) => ($active ? 'rgba(98, 163, 255, 0.12)' : 'rgba(20, 36, 69, 0.74)')};
  color: ${({ $active }) => ($active ? 'var(--monitor-white)' : 'var(--monitor-text-secondary)')};
  font-size: 14px;
  font-weight: 800;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(110, 145, 217, 0.16);
`;

const LogScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const LogList = styled.div`
  display: grid;
  gap: 0;
`;

const LogItemRow = styled.div`
  display: grid;
  grid-template-columns: 82px 82px minmax(0, 1fr);
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(110, 145, 217, 0.08);
`;

const TimeText = styled.div`
  font-size: 18px;
  font-family: 'SFMono-Regular', ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: rgba(160, 181, 226, 0.56);
  letter-spacing: -.8px;
`;

const ActorText = styled.div<{ $tone: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $tone }) => $tone};
  margin-left: 14px;
  letter-spacing: -.6px;
`;

const MessageText = styled.div<{ $tone: string }>`
  font-size: 14px;
  line-height: 1.55;
  color: ${({ $tone }) => $tone};
  margin-left: 10px;
`;

export default function SystemLogPanel({
  logs,
  autoScroll,
  onToggleAutoScroll,
  scrollRef
}: SystemLogPanelProps) {
  return (
    <Panel>
      <Header>
        <Title>
          <Chevron />
          SYSTEM LOG
          <SubTitle>Auto-Scroll {autoScroll ? 'ON' : 'OFF'}</SubTitle>
        </Title>

        <ToggleButton type="button" $active={autoScroll} onClick={onToggleAutoScroll}>
          Auto-Scroll {autoScroll ? 'ON' : 'OFF'}
        </ToggleButton>
      </Header>

      <Divider />

      <LogScroll ref={scrollRef}>
        <LogList>
          {logs.map((log) => {
            const toneColor = getLogToneColor(log.tone);

            return (
              <LogItemRow key={log.id}>
                <TimeText>[{log.time}]</TimeText>
                <ActorText $tone={toneColor}>{log.actor}</ActorText>
                <MessageText $tone={toneColor}>{log.message}</MessageText>
              </LogItemRow>
            );
          })}
        </LogList>
      </LogScroll>
    </Panel>
  );
}
