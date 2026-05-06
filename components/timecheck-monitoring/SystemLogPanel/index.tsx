'use client';

import type { RefObject } from 'react';

import styled, { css } from 'styled-components';

import { SystemLogItem } from '../model/types';

interface SystemLogPanelProps {
  logs: SystemLogItem[];
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

type LogTone = SystemLogItem['tone'];

type LogToneKey =
  | 'green'
  | 'blue'
  | 'amber'
  | 'red'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'neutral';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const LOG_TONE_VARS: Record<LogToneKey, ToneVars> = {
  green: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
  success: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
  blue: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
  info: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
  amber: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  warning: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  red: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
  error: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
  neutral: {
    color: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    background: 'var(--color-surface-muted)',
  },
};

const getLogToneVars = (tone: LogTone) => {
  const toneKey = String(tone) as LogToneKey;

  return LOG_TONE_VARS[toneKey] ?? LOG_TONE_VARS.neutral;
};

export default function SystemLogPanel({
  logs,
  autoScroll,
  onToggleAutoScroll,
  scrollRef,
}: SystemLogPanelProps) {
  return (
    <Panel>
      <Header>
        <Title>
          <Chevron />
          SYSTEM LOG
          <SubTitle>Auto-Scroll {autoScroll ? 'ON' : 'OFF'}</SubTitle>
        </Title>

        <ToggleButton
          type="button"
          $active={autoScroll}
          aria-pressed={autoScroll}
          onClick={onToggleAutoScroll}
        >
          <ToggleDot $active={autoScroll} />
          Auto-Scroll {autoScroll ? 'ON' : 'OFF'}
        </ToggleButton>
      </Header>

      <Divider />

      <LogScroll ref={scrollRef}>
        {logs.length === 0 ? (
          <EmptyState>표시할 시스템 로그가 없습니다.</EmptyState>
        ) : (
          <LogList>
            {logs.map((log) => (
              <LogItemRow key={log.id}>
                <TimeText>[{log.time}]</TimeText>

                <ActorBadge $tone={log.tone}>
                  <ActorDot $tone={log.tone} />
                  {log.actor}
                </ActorBadge>

                <MessageText>{log.message}</MessageText>
              </LogItemRow>
            ))}
          </LogList>
        )}
      </LogScroll>
    </Panel>
  );
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
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 14px;
  min-height: 0;
  padding: 18px 18px 16px;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.35;
  letter-spacing: -0.02em;
`;

const Chevron = styled.span`
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  border-right: 2px solid var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
  transform: rotate(-45deg);
`;

const SubTitle = styled.span`
  color: var(--color-text-secondary);
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: ${({ $active }) =>
    $active ? 'var(--color-accent)' : 'var(--color-text-secondary)'};
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease,
    color 150ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const ToggleDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
`;

const Divider = styled.div`
  height: 1px;
  background: var(--color-border);
`;

const LogScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--color-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const LogList = styled.div`
  display: grid;
`;

const LogItemRow = styled.div`
  display: grid;
  grid-template-columns: 82px 96px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 76px minmax(0, 1fr);
    align-items: start;
  }
`;

const TimeText = styled.div`
  color: var(--color-text-tertiary);
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
  font-size: 18px;
  line-height: 1.45;
  letter-spacing: -0.05em;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ActorBadge = styled.div<{ $tone: LogTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: fit-content;
  min-height: 30px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => getLogToneVars($tone).border};
  border-radius: 999px;
  background: ${({ $tone }) => getLogToneVars($tone).background};
  color: ${({ $tone }) => getLogToneVars($tone).color};
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ActorDot = styled.span<{ $tone: LogTone }>`
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => getLogToneVars($tone).color};
`;

const MessageText = styled.div`
  min-width: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    grid-column: 2 / -1;
  }
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 260px;
  padding: 24px;
  border: 1px dashed var(--color-border-strong);
  border-radius: 16px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  text-align: center;
  font-size: 15px;
  line-height: 1.7;
  word-break: keep-all;
`;