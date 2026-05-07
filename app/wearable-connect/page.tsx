'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import {
  LuMaximize2,
  LuPlus,
  LuRadar,
  LuRefreshCw,
  LuTriangle,
  LuX,
} from 'react-icons/lu';
import styled, { css, keyframes } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type ConnectionStatus = 'idle' | 'checking' | 'ok' | 'error';

type WearableContext = 'defect-tracking' | 'no-work' | 'timecheck' | 'default';

type StreamTarget = {
  id: string;
  label: string;
  host: string;
  port: number;
  status: ConnectionStatus;
  lastCheckedAt?: string;
};

type ContextMeta = {
  badge: string;
  title: string;
  description: string;
  helperText: string;
};

type WearableThemeStyle = {
  background: string;
  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  shadow: string;
  focus: string;
  overlay: string;
};

const DEFAULT_NETWORK_PREFIX = '192.168';
const DEFAULT_SCAN_THIRD_OCTET = '10';
const DEFAULT_SCAN_START_HOST = '60';
const DEFAULT_SCAN_END_HOST = '80';
const DEFAULT_STREAM_PORT = 8080;
const CONNECTION_TIMEOUT_MS = 3000;
const MAX_SCAN_COUNT = 40;

const CONTEXT_META: Record<WearableContext, ContextMeta> = {
  'defect-tracking': {
    badge: '불량역추적',
    title: '불량역추적 웨어러블 연결',
    description:
      '불량 발생 지점의 현장 작업자 웨어러블 스트림을 연결해 조치 상황을 확인합니다.',
    helperText: '불량 조치 현장 카메라 또는 작업자 디바이스를 선택하세요.',
  },
  'no-work': {
    badge: '무작업관리',
    title: '무작업관리 웨어러블 연결',
    description:
      '무작업 알람 발생 위치의 웨어러블 스트림을 연결해 현장 상태를 확인합니다.',
    helperText: '무작업 감지 구역 또는 담당자 디바이스를 선택하세요.',
  },
  timecheck: {
    badge: '타임체크',
    title: '타임체크 웨어러블 연결',
    description:
      '순회 점검자의 웨어러블 스트림을 연결해 타임체크 진행 상황을 확인합니다.',
    helperText: '타임체크 점검자 디바이스를 선택하세요.',
  },
  default: {
    badge: '웨어러블',
    title: '웨어러블 연결',
    description:
      '현장 웨어러블 디바이스의 스트림 상태를 확인하고 연결할 장비를 선택합니다.',
    helperText: '연결 가능한 웨어러블 디바이스를 선택하세요.',
  },
};

const WEARABLE_THEME_STYLES: Record<'light' | 'dark', WearableThemeStyle> = {
  light: {
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    onAccent: '#ffffff',
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',
    error: '#dc2626',
    errorSoft: 'rgba(220, 38, 38, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
    overlay: 'rgba(15, 23, 42, 0.52)',
  },
  dark: {
    background: '#0f172a',
    surface: '#111827',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    onAccent: '#0f172a',
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',
    error: '#fca5a5',
    errorSoft: 'rgba(252, 165, 165, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',
    overlay: 'rgba(2, 6, 23, 0.72)',
  },
};

const STATUS_TONE_VARS: Record<
  ConnectionStatus,
  {
    color: string;
    border: string;
    background: string;
  }
> = {
  idle: {
    color: 'var(--wearable-text-secondary)',
    border: 'var(--wearable-border)',
    background: 'var(--wearable-surface-muted)',
  },
  checking: {
    color: 'var(--wearable-accent)',
    border: 'var(--wearable-accent)',
    background: 'var(--wearable-accent-soft)',
  },
  ok: {
    color: 'var(--wearable-success)',
    border: 'var(--wearable-success)',
    background: 'var(--wearable-success-soft)',
  },
  error: {
    color: 'var(--wearable-error)',
    border: 'var(--wearable-error)',
    background: 'var(--wearable-error-soft)',
  },
};

const createWearableThemeVars = (theme: WearableThemeStyle) => css`
  --wearable-bg: ${theme.background};

  --wearable-surface: ${theme.surface};
  --wearable-surface-muted: ${theme.surfaceMuted};
  --wearable-surface-hover: ${theme.surfaceHover};

  --wearable-border: ${theme.border};
  --wearable-border-strong: ${theme.borderStrong};

  --wearable-text-primary: ${theme.textPrimary};
  --wearable-text-secondary: ${theme.textSecondary};
  --wearable-text-tertiary: ${theme.textTertiary};

  --wearable-accent: ${theme.accent};
  --wearable-accent-soft: ${theme.accentSoft};
  --wearable-on-accent: ${theme.onAccent};

  --wearable-success: ${theme.success};
  --wearable-success-soft: ${theme.successSoft};

  --wearable-warning: ${theme.warning};
  --wearable-warning-soft: ${theme.warningSoft};

  --wearable-error: ${theme.error};
  --wearable-error-soft: ${theme.errorSoft};

  --wearable-shadow: ${theme.shadow};
  --wearable-focus: ${theme.focus};
  --wearable-overlay: ${theme.overlay};
`;

const createTargetId = (host: string, port: number) => {
  return `${host}:${port}`;
};

const getDeviceLabel = (host: string) => {
  const prefix = `${DEFAULT_NETWORK_PREFIX}.`;

  if (host.startsWith(prefix)) {
    return `장비 ${host.replace(prefix, '')}`;
  }

  return `장비 ${host}`;
};

const createStreamTarget = (
  host: string,
  port = DEFAULT_STREAM_PORT,
): StreamTarget => {
  return {
    id: createTargetId(host, port),
    label: getDeviceLabel(host),
    host,
    port,
    status: 'idle',
  };
};

const DEFAULT_TARGETS: StreamTarget[] = [
  createStreamTarget('192.168.10.65'),
  createStreamTarget('192.168.10.66'),
  createStreamTarget('192.168.10.67'),
];

const getStreamHost = (target: StreamTarget) => {
  return target.host;
};

const getAccessLabel = (target: StreamTarget) => {
  return `${getStreamHost(target)}:${target.port}`;
};

const getStreamUrl = (target: StreamTarget) => {
  return `http://${getAccessLabel(target)}`;
};

const getStatusLabel = (status: ConnectionStatus) => {
  const labels: Record<ConnectionStatus, string> = {
    idle: '대기',
    checking: '확인 중',
    ok: '연결 가능',
    error: '연결 불가',
  };

  return labels[status];
};

const getStatusDescription = (status: ConnectionStatus) => {
  const descriptions: Record<ConnectionStatus, string> = {
    idle: '상태 확인이 필요합니다.',
    checking: '디바이스 응답을 확인하고 있습니다.',
    ok: '스트림 서버가 응답했습니다.',
    error: '현재 응답이 없습니다.',
  };

  return descriptions[status];
};

const formatCheckedAt = () => {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
};

const isNumericString = (value: string) => {
  return /^\d+$/.test(value.trim());
};

const isValidOctet = (
  value: string,
  options: { min?: number; max?: number } = {},
) => {
  if (!isNumericString(value)) {
    return false;
  }

  const { min = 0, max = 255 } = options;
  const numericValue = Number(value);

  return (
    Number.isInteger(numericValue) &&
    numericValue >= min &&
    numericValue <= max
  );
};

const isValidThirdOctet = (value: string) => {
  return isValidOctet(value, { min: 0, max: 255 });
};

const isValidHostOctet = (value: string) => {
  return isValidOctet(value, { min: 1, max: 254 });
};

const isValidPort = (value: string) => {
  const trimmedValue = value.trim();

  if (!isNumericString(trimmedValue)) {
    return false;
  }

  const numericValue = Number(trimmedValue);

  return (
    Number.isInteger(numericValue) &&
    numericValue >= 1 &&
    numericValue <= 65535
  );
};

const normalizeOctet = (value: string) => {
  return String(Number(value));
};

const normalizePrivateHost = (host: string) => {
  const parts = host.trim().split('.');

  if (parts.length !== 4 || parts[0] !== '192' || parts[1] !== '168') {
    return null;
  }

  const [, , thirdOctet, hostOctet] = parts;

  if (!isValidThirdOctet(thirdOctet) || !isValidHostOctet(hostOctet)) {
    return null;
  }

  return `${DEFAULT_NETWORK_PREFIX}.${normalizeOctet(thirdOctet)}.${normalizeOctet(
    hostOctet,
  )}`;
};

const parseStreamAddress = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const matchedAddress = /^(?:http:\/\/)?(192\.168\.\d{1,3}\.\d{1,3}):(\d{1,5})(?:\/.*)?$/i.exec(
    trimmedValue,
  );

  if (!matchedAddress) {
    return null;
  }

  const [, rawHost, rawPort] = matchedAddress;
  const host = normalizePrivateHost(rawHost);

  if (!host || !isValidPort(rawPort)) {
    return null;
  }

  return {
    host,
    port: Number(rawPort),
  };
};

const getHostSortParts = (host: string) => {
  return host.split('.').map((part) => Number(part));
};

const sortTargets = (items: StreamTarget[]) => {
  return [...items].sort((a, b) => {
    const aParts = getHostSortParts(a.host);
    const bParts = getHostSortParts(b.host);

    for (let index = 0; index < 4; index += 1) {
      const diff = (aParts[index] ?? 0) - (bParts[index] ?? 0);

      if (diff !== 0) {
        return diff;
      }
    }

    return a.port - b.port;
  });
};

const mergeTargets = (
  currentTargets: StreamTarget[],
  nextTargets: StreamTarget[],
) => {
  const targetMap = new Map<string, StreamTarget>();

  currentTargets.forEach((target) => {
    targetMap.set(target.id, target);
  });

  nextTargets.forEach((target) => {
    const previousTarget = targetMap.get(target.id);

    targetMap.set(target.id, {
      ...previousTarget,
      ...target,
    });
  });

  return sortTargets(Array.from(targetMap.values()));
};

const checkTargetConnection = async (
  target: StreamTarget,
): Promise<ConnectionStatus> => {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, CONNECTION_TIMEOUT_MS);

  try {
    await fetch(getStreamUrl(target), {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    });

    return 'ok';
  } catch {
    return 'error';
  } finally {
    window.clearTimeout(timeoutId);
  }
};

export default function WearableConnectPage() {
  const searchParams = useSearchParams();
  const isDark = useThemeStore((state) => state.isDark);

  const context = useMemo<WearableContext>(() => {
    const value = searchParams.get('context');

    if (
      value === 'defect-tracking' ||
      value === 'no-work' ||
      value === 'timecheck'
    ) {
      return value;
    }

    return 'default';
  }, [searchParams]);

  const pageMeta = CONTEXT_META[context];

  const [targets, setTargets] = useState<StreamTarget[]>(DEFAULT_TARGETS);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const [addressInput, setAddressInput] = useState('');
  const [formError, setFormError] = useState('');

  const [scanThirdOctetInput, setScanThirdOctetInput] = useState(
    DEFAULT_SCAN_THIRD_OCTET,
  );
  const [scanStartInput, setScanStartInput] = useState(DEFAULT_SCAN_START_HOST);
  const [scanEndInput, setScanEndInput] = useState(DEFAULT_SCAN_END_HOST);
  const [scanPortInput, setScanPortInput] = useState(
    String(DEFAULT_STREAM_PORT),
  );
  const [scanError, setScanError] = useState('');
  const [scanResults, setScanResults] = useState<StreamTarget[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompletedCount, setScanCompletedCount] = useState(0);
  const [scanTotalCount, setScanTotalCount] = useState(0);

  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStreamExpanded, setIsStreamExpanded] = useState(false);

  const selectedTarget = useMemo(() => {
    return (
      targets.find(
        (target) => target.id === selectedTargetId && target.status === 'ok',
      ) ?? null
    );
  }, [selectedTargetId, targets]);

  const selectedStreamUrl = selectedTarget ? getStreamUrl(selectedTarget) : null;
  const scanExampleThirdOctet =
    scanThirdOctetInput || DEFAULT_SCAN_THIRD_OCTET;
  const scanExampleStartHost = scanStartInput || DEFAULT_SCAN_START_HOST;
  const scanExampleEndHost = scanEndInput || DEFAULT_SCAN_END_HOST;
  const scanExampleRange = `${DEFAULT_NETWORK_PREFIX}.${scanExampleThirdOctet}.${scanExampleStartHost} ~ ${DEFAULT_NETWORK_PREFIX}.${scanExampleThirdOctet}.${scanExampleEndHost}`;

  const onlineCount = targets.filter((target) => target.status === 'ok').length;
  const checkingCount = targets.filter(
    (target) => target.status === 'checking',
  ).length;

  const activeScanResults = scanResults.filter(
    (target) => target.status === 'ok',
  );

  const scanProgressPercent =
    scanTotalCount > 0
      ? Math.round((scanCompletedCount / scanTotalCount) * 100)
      : 0;

  const updateTarget = (
    targetId: string,
    patch: Partial<Omit<StreamTarget, 'id'>>,
  ) => {
    setTargets((prev) => {
      return prev.map((target) => {
        if (target.id !== targetId) {
          return target;
        }

        return {
          ...target,
          ...patch,
        };
      });
    });
  };

  const handleCheckTarget = async (target: StreamTarget) => {
    updateTarget(target.id, {
      status: 'checking',
    });

    const nextStatus = await checkTargetConnection(target);

    updateTarget(target.id, {
      status: nextStatus,
      lastCheckedAt: formatCheckedAt(),
    });

    if (nextStatus !== 'ok' && selectedTargetId === target.id) {
      setSelectedTargetId(null);
    }

    return nextStatus;
  };

  const handleCheckAllTargets = () => {
    targets.forEach((target) => {
      void handleCheckTarget(target);
    });
  };

  const handleConnectTarget = async (target: StreamTarget) => {
    if (target.status === 'ok') {
      setSelectedTargetId(target.id);
      return;
    }

    const checkedStatus = await handleCheckTarget(target);

    if (checkedStatus === 'ok') {
      setSelectedTargetId(target.id);
    }
  };

  const handleDeleteTarget = (targetId: string) => {
    setTargets((prev) => {
      return prev.filter((target) => target.id !== targetId);
    });

    if (selectedTargetId === targetId) {
      setSelectedTargetId(null);
    }
  };

  const handleAddressInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddressInput(event.target.value);
    setFormError('');
  };

  const handleScanThirdOctetInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/[^0-9]/g, '');

    setScanThirdOctetInput(value);
    setScanError('');
  };

  const handleScanStartInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');

    setScanStartInput(value);
    setScanError('');
  };

  const handleScanEndInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');

    setScanEndInput(value);
    setScanError('');
  };

  const handleScanPortInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');

    setScanPortInput(value);
    setScanError('');
  };

  const handleAddTarget = () => {
    const parsedAddress = parseStreamAddress(addressInput);

    if (!parsedAddress) {
      setFormError(
        '주소는 http://192.168.xx.xx:xxxx 또는 192.168.xx.xx:xxxx 형식으로 입력해주세요.',
      );
      return;
    }

    const nextTarget = createStreamTarget(
      parsedAddress.host,
      parsedAddress.port,
    );

    const isDuplicated = targets.some((target) => target.id === nextTarget.id);

    if (isDuplicated) {
      setFormError('이미 등록된 스트림 주소입니다.');
      return;
    }

    setTargets((prev) => sortTargets([...prev, nextTarget]));
    setAddressInput('');
    setFormError('');
    setIsAddModalOpen(false);

    void handleCheckTarget(nextTarget);
  };

  const handleScanNearbyTargets = async () => {
    if (
      !isValidThirdOctet(scanThirdOctetInput) ||
      !isValidHostOctet(scanStartInput) ||
      !isValidHostOctet(scanEndInput)
    ) {
      setScanError(
        '스캔 범위는 192.168.0~255.1~254 형식에 맞춰 입력해주세요.',
      );
      return;
    }

    if (!isValidPort(scanPortInput)) {
      setScanError('스캔 포트는 1부터 65535 사이의 숫자로 입력해주세요.');
      return;
    }

    const scanThirdOctet = normalizeOctet(scanThirdOctetInput);
    const startHostOctet = Number(scanStartInput);
    const endHostOctet = Number(scanEndInput);
    const fromHostOctet = Math.min(startHostOctet, endHostOctet);
    const toHostOctet = Math.max(startHostOctet, endHostOctet);
    const scanCount = toHostOctet - fromHostOctet + 1;

    if (scanCount > MAX_SCAN_COUNT) {
      setScanError(`한 번에 최대 ${MAX_SCAN_COUNT}개 IP까지만 스캔할 수 있습니다.`);
      return;
    }

    setScanError('');
    setScanResults([]);
    setIsScanning(true);
    setScanCompletedCount(0);
    setScanTotalCount(scanCount);

    const scanPort = Number(scanPortInput);

    const candidates = Array.from({ length: scanCount }).map((_, index) => {
      const host = `${DEFAULT_NETWORK_PREFIX}.${scanThirdOctet}.${
        fromHostOctet + index
      }`;

      return createStreamTarget(host, scanPort);
    });

    const checkedResults = await Promise.all(
      candidates.map(async (target) => {
        const status = await checkTargetConnection(target);

        const checkedTarget: StreamTarget = {
          ...target,
          status,
          lastCheckedAt: formatCheckedAt(),
        };

        setScanCompletedCount((prev) => prev + 1);

        return checkedTarget;
      }),
    );

    setScanResults(checkedResults);

    setTargets((prev) => {
      const shouldMergeTargets = checkedResults.filter((target) => {
        const alreadyExists = prev.some((item) => item.id === target.id);

        return alreadyExists || target.status === 'ok';
      });

      return mergeTargets(prev, shouldMergeTargets);
    });

    setIsScanning(false);
  };

  const handleUseScanResult = (target: StreamTarget) => {
    setTargets((prev) => mergeTargets(prev, [target]));
    setSelectedTargetId(target.id);
    setIsScannerModalOpen(false);
  };

  useEffect(() => {
    DEFAULT_TARGETS.forEach((target) => {
      void handleCheckTarget(target);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isStreamExpanded) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStreamExpanded(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isStreamExpanded]);

  return (
    <ThemeScope $isDark={isDark}>
      <PageShell>
        <Header>
          <TitleBlock>
            <Eyebrow>{pageMeta.badge}</Eyebrow>
            <Title>{pageMeta.title}</Title>
            <Description>{pageMeta.description}</Description>
          </TitleBlock>

          <HeaderMeta>
            <MetaPill>
              등록 장비 <strong>{targets.length}</strong>
            </MetaPill>
            <MetaPill>
              연결 가능 <strong>{onlineCount}</strong>
            </MetaPill>
            <MetaPill>
              확인 중 <strong>{checkingCount}</strong>
            </MetaPill>
          </HeaderMeta>
        </Header>

        <ContentGrid>
          <ControlPanel>
            <PanelHeader>
              <PanelTitleGroup>
                <PanelTitle>스트림 장비 선택</PanelTitle>
                <PanelCaption>{pageMeta.helperText}</PanelCaption>
              </PanelTitleGroup>

              <PanelActions>
                <ToolButton
                  type="button"
                  onClick={() => setIsScannerModalOpen(true)}
                >
                  <LuRadar size={16} />
                  근처 활성 IP 찾기
                </ToolButton>

                <PrimaryToolButton
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <LuPlus size={16} />
                  장비 직접 추가
                </PrimaryToolButton>

                <SecondaryButton type="button" onClick={handleCheckAllTargets}>
                  <LuRefreshCw size={15} />
                  전체 확인
                </SecondaryButton>
              </PanelActions>
            </PanelHeader>

            <TargetList>
              {targets.map((target) => {
                const isSelected = selectedTargetId === target.id;

                return (
                  <TargetCard
                    key={target.id}
                    $status={target.status}
                    $selected={isSelected}
                  >
                    <TargetMain>
                      <TargetTop>
                        <TargetTitleGroup>
                          <TargetName>
                            {/* <StatusDot $status={target.status} /> */}
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
                      <GhostButton
                        type="button"
                        onClick={() => handleCheckTarget(target)}
                      >
                        <LuRefreshCw size={14} />
                        확인
                      </GhostButton>

                      <ConnectButton
                        type="button"
                        disabled={target.status === 'checking'}
                        onClick={() => handleConnectTarget(target)}
                      >
                        {isSelected ? '연결됨' : '선택'}
                      </ConnectButton>

                      <DeleteButton
                        type="button"
                        aria-label={`${getAccessLabel(target)} 삭제`}
                        disabled={targets.length <= 1}
                        onClick={() => handleDeleteTarget(target.id)}
                      >
                        <LuX size={14} />
                        삭제
                      </DeleteButton>
                    </TargetActions>
                  </TargetCard>
                );
              })}
            </TargetList>
          </ControlPanel>

          <StreamPanel>
            <StreamHeader>
              <StreamTitleGroup>
                <StreamTitle>Live Stream</StreamTitle>
                <StreamCaption>
                  {selectedTarget
                    ? `${selectedStreamUrl} 스트림을 표시 중입니다.`
                    : '연결 가능한 장비를 확인한 뒤 연결할 스트림을 선택해주세요.'}
                </StreamCaption>
              </StreamTitleGroup>

              <StreamHeaderActions>
                <CurrentAccess>
                  <span>ACCESS</span>
                  <strong>
                    {selectedStreamUrl ?? '-'}
                  </strong>
                </CurrentAccess>

                <ExpandButton
                  type="button"
                  disabled={!selectedStreamUrl}
                  onClick={() => setIsStreamExpanded(true)}
                >
                  <LuMaximize2 size={18} />
                  화면 확대
                </ExpandButton>
              </StreamHeaderActions>
            </StreamHeader>

            <StreamContent>
              {selectedStreamUrl ? (
                <FrameBox>
                  <StyledIframe
                    key={selectedStreamUrl}
                    src={selectedStreamUrl}
                    allow="fullscreen"
                    allowFullScreen
                  />
                </FrameBox>
              ) : (
                <EmptyStreamState>
                  <EmptyIcon>
                    <LuTriangle size={34} />
                  </EmptyIcon>

                  <EmptyTitle>선택된 스트림이 없습니다</EmptyTitle>

                  <EmptyDesc>
                    왼쪽 장비 목록에서 상태가 <strong>연결 가능</strong>인
                    항목을 선택하면 이 영역에 웨어러블 화면이 표시됩니다.
                  </EmptyDesc>
                </EmptyStreamState>
              )}
            </StreamContent>
          </StreamPanel>
        </ContentGrid>
      </PageShell>

      {isScannerModalOpen && (
        <DialogOverlay onClick={() => setIsScannerModalOpen(false)}>
          <DialogModal
            role="dialog"
            aria-modal="true"
            aria-labelledby="scanner-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitleGroup>
                <DialogEyebrow>Network Discovery</DialogEyebrow>
                <DialogTitle id="scanner-dialog-title">
                  근처 활성 IP 찾기
                </DialogTitle>
                <DialogDescription>
                  {DEFAULT_NETWORK_PREFIX}.XX.XXX 대역에서 HTTP 포트 응답이 있는
                  장비만 찾아 목록에 반영합니다.
                </DialogDescription>
              </DialogTitleGroup>

              <DialogCloseButton
                type="button"
                aria-label="근처 활성 IP 찾기 닫기"
                onClick={() => setIsScannerModalOpen(false)}
              >
                <LuX size={22} />
              </DialogCloseButton>
            </DialogHeader>

            <DialogBody>
              <ScannerCard>
                <ScannerTop>
                  <ScannerIcon>
                    <LuRadar size={22} />
                  </ScannerIcon>

                  <ScannerTextGroup>
                    <ScannerTitle>응답 중인 웨어러블 장비 탐색</ScannerTitle>
                    <ScannerDesc>
                      한 번에 최대 {MAX_SCAN_COUNT}개 IP까지 확인합니다. 활성
                      장비는 자동으로 장비 목록에 추가됩니다.
                    </ScannerDesc>
                  </ScannerTextGroup>
                </ScannerTop>

                <ScanInputGrid>
                  <InputGroup>
                    <InputLabel>대역</InputLabel>
                    <InputRow>
                      <PrefixText>{DEFAULT_NETWORK_PREFIX}.</PrefixText>
                      <NumberInput
                        value={scanThirdOctetInput}
                        inputMode="numeric"
                        placeholder="10"
                        onChange={handleScanThirdOctetInputChange}
                      />
                    </InputRow>
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>시작 끝번호</InputLabel>
                    <NumberInput
                      value={scanStartInput}
                      inputMode="numeric"
                      placeholder="60"
                      onChange={handleScanStartInputChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>종료 끝번호</InputLabel>
                    <NumberInput
                      value={scanEndInput}
                      inputMode="numeric"
                      placeholder="80"
                      onChange={handleScanEndInputChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLabel>포트</InputLabel>
                    <NumberInput
                      value={scanPortInput}
                      inputMode="numeric"
                      placeholder="8080"
                      onChange={handleScanPortInputChange}
                    />
                  </InputGroup>

                  <ScanButton
                    type="button"
                    disabled={isScanning}
                    onClick={handleScanNearbyTargets}
                  >
                    {isScanning ? '스캔 중' : '스캔 시작'}
                  </ScanButton>
                </ScanInputGrid>

                <ScanHelp>
                  예: {scanExampleRange} / 포트{' '}
                  {scanPortInput || DEFAULT_STREAM_PORT}
                </ScanHelp>

                {isScanning && (
                  <ScanProgress>
                    <ProgressText>
                      {scanCompletedCount}/{scanTotalCount} 확인 중
                    </ProgressText>
                    <ProgressTrack>
                      <ProgressFill $percent={scanProgressPercent} />
                    </ProgressTrack>
                  </ScanProgress>
                )}

                {scanError && <FormError>{scanError}</FormError>}

                {!isScanning && scanResults.length > 0 && (
                  <ScanResultBox>
                    <ScanResultTitle>
                      최근 스캔 결과 · 활성 {activeScanResults.length}개
                    </ScanResultTitle>

                    {activeScanResults.length === 0 ? (
                      <ScanEmptyText>
                        현재 범위에서 응답하는 장비를 찾지 못했습니다.
                      </ScanEmptyText>
                    ) : (
                      <ScanResultList>
                        {activeScanResults.map((target) => (
                          <ScanResultItem key={target.id}>
                            <span>{getStreamUrl(target)}</span>
                            <button
                              type="button"
                              onClick={() => handleUseScanResult(target)}
                            >
                              연결 선택
                            </button>
                          </ScanResultItem>
                        ))}
                      </ScanResultList>
                    )}
                  </ScanResultBox>
                )}
              </ScannerCard>
            </DialogBody>
          </DialogModal>
        </DialogOverlay>
      )}

      {isAddModalOpen && (
        <DialogOverlay onClick={() => setIsAddModalOpen(false)}>
          <DialogModal
            $compact
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitleGroup>
                <DialogEyebrow>Manual Device</DialogEyebrow>
                <DialogTitle id="add-dialog-title">장비 직접 추가</DialogTitle>
                <DialogDescription>
                  http://192.168.xx.xx:xxxx 또는 192.168.xx.xx:xxxx 형식으로
                  입력하면 장비를 추가한 뒤 바로 상태를 확인합니다.
                </DialogDescription>
              </DialogTitleGroup>

              <DialogCloseButton
                type="button"
                aria-label="장비 직접 추가 닫기"
                onClick={() => setIsAddModalOpen(false)}
              >
                <LuX size={22} />
              </DialogCloseButton>
            </DialogHeader>

            <DialogBody>
              <AddCard>
                <AddTitle>스트림 주소 입력</AddTitle>

                <AddInputGrid>
                  <InputGroup>
                    <InputLabel>스트림 주소</InputLabel>
                    <TextInput
                      value={addressInput}
                      inputMode="url"
                      placeholder="http://192.168.10.65:8080"
                      onChange={handleAddressInputChange}
                    />
                  </InputGroup>

                  <AddButton type="button" onClick={handleAddTarget}>
                    추가 후 확인
                  </AddButton>
                </AddInputGrid>

                {formError && <FormError>{formError}</FormError>}
              </AddCard>
            </DialogBody>
          </DialogModal>
        </DialogOverlay>
      )}

      {isStreamExpanded && selectedStreamUrl && selectedTarget && (
        <ExpandedOverlay onClick={() => setIsStreamExpanded(false)}>
          <ExpandedModal
            role="dialog"
            aria-modal="true"
            aria-label="웨어러블 스트림 확대 화면"
            onClick={(event) => event.stopPropagation()}
          >
            <ExpandedHeader>
              <ExpandedTitleGroup>
                <ExpandedEyebrow>Wearable Live Stream</ExpandedEyebrow>
                <ExpandedTitle>{selectedStreamUrl}</ExpandedTitle>
              </ExpandedTitleGroup>

              <ExpandedCloseButton
                type="button"
                aria-label="확대 화면 닫기"
                onClick={() => setIsStreamExpanded(false)}
              >
                <LuX size={24} />
              </ExpandedCloseButton>
            </ExpandedHeader>

            <ExpandedFrameBox>
              <StyledIframe
                key={`expanded-${selectedStreamUrl}`}
                src={selectedStreamUrl}
                allow="fullscreen"
                allowFullScreen
              />
            </ExpandedFrameBox>
          </ExpandedModal>
        </ExpandedOverlay>
      )}
    </ThemeScope>
  );
}

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ThemeScope = styled.div<{ $isDark: boolean }>`
  height: 100%;
  min-height: 100dvh;

  ${({ $isDark }) =>
    createWearableThemeVars(
      $isDark ? WEARABLE_THEME_STYLES.dark : WEARABLE_THEME_STYLES.light,
    )}
`;

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

const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 22px;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  padding: 28px;
  background:
    radial-gradient(circle at 12% 0%, var(--wearable-accent-soft), transparent 30%),
    var(--wearable-bg);
  color: var(--wearable-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;

  @media (max-width: 768px) {
    gap: 16px;
    padding: 16px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-height: 0;
  flex: 0 0 auto;

  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 999px;
  background: var(--wearable-surface);
  color: var(--wearable-accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: clamp(30px, 2.7vw, 42px);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.05em;
`;

const Description = styled.p`
  max-width: 760px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  word-break: keep-all;
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  flex: 0 0 auto;
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--wearable-border);
  border-radius: 999px;
  background: var(--wearable-surface);
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  strong {
    color: var(--wearable-text-primary);
    font-weight: 900;
  }
`;

const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(460px, 520px) minmax(0, 1fr);
  gap: 22px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(220px, 36vh) minmax(0, 1fr);
  }
`;

const ControlPanel = styled.aside`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

const StreamPanel = styled.section`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
  overflow: hidden;
  padding: 20px;
  border: 1px solid var(--wearable-border);
  border-radius: 28px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

const PanelHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
  max-width: 100%;
`;

const PanelTitle = styled.h2`
  margin: 0;
  overflow-wrap: normal;
  color: var(--wearable-text-primary);
  font-size: 24px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;

const PanelCaption = styled.p`
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
`;

const PanelActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;

  > button {
    flex: 1 1 128px;
    min-height: 38px;
    padding: 0 12px;
  }
`;

const ScannerCard = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--wearable-border);
  border-radius: 24px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

const ScannerTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

const ScannerIcon = styled.div`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--wearable-accent);
  border-radius: 14px;
  background: var(--wearable-accent-soft);
  color: var(--wearable-accent);
`;

const ScannerTextGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const ScannerTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 17px;
  font-weight: 900;
  line-height: 1.3;
`;

const ScannerDesc = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  word-break: keep-all;
`;

const ScanInputGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(132px, 1.2fr) repeat(2, minmax(88px, 0.8fr)) minmax(82px, 0.7fr) auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const ScanHelp = styled.div`
  color: var(--wearable-text-tertiary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

const ScanProgress = styled.div`
  display: grid;
  gap: 8px;
`;

const ProgressText = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 800;
`;

const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 999px;
  background: var(--wearable-surface-muted);
`;

const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: var(--wearable-accent);
  transition: width 180ms ease;
`;

const ScanResultBox = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 18px;
  background: var(--wearable-surface-muted);
`;

const ScanResultTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 14px;
  font-weight: 900;
`;

const ScanEmptyText = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

const ScanResultList = styled.div`
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ScanResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 36px;
  padding: 0 8px 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 999px;
  background: var(--wearable-surface);

  span {
    min-width: 0;
    overflow: hidden;
    color: var(--wearable-text-primary);
    font-family:
      'SFMono-Regular',
      ui-monospace,
      Menlo,
      Monaco,
      Consolas,
      'Liberation Mono',
      'Courier New',
      monospace;
    font-size: 13px;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    ${buttonReset};

    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: var(--wearable-accent);
    color: var(--wearable-on-accent);
    font-size: 12px;
    font-weight: 900;
    white-space: nowrap;
  }
`;

const AddCard = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--wearable-border);
  border-radius: 24px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

const AddTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.03em;
`;

const AddInputGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.label`
  display: grid;
  gap: 7px;
  min-width: 0;
`;

const InputLabel = styled.span`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 800;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  height: 44px;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 14px;
  background: var(--wearable-surface-muted);
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-within {
    border-color: var(--wearable-accent);
    background: var(--wearable-surface);
  }
`;

const PrefixText = styled.span`
  padding-left: 12px;
  color: var(--wearable-text-tertiary);
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
`;

const NumberInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 14px;
  outline: none;
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-primary);
  font-size: 15px;
  font-weight: 800;
  transition:
    border-color 160ms ease,
    background 160ms ease;

  ${InputRow} & {
    height: 100%;
    padding-left: 4px;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  &:focus {
    border-color: var(--wearable-accent);
    background: var(--wearable-surface);
  }

  &::placeholder {
    color: var(--wearable-text-tertiary);
  }
`;

const TextInput = styled(NumberInput)`
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
`;

const FormError = styled.div`
  padding: 10px 12px;
  border: 1px solid var(--wearable-error);
  border-radius: 14px;
  background: var(--wearable-error-soft);
  color: var(--wearable-error);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

const TargetList = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px 4px 2px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const TargetCard = styled.article<{
  $status: ConnectionStatus;
  $selected: boolean;
}>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 9px 10px 9px 12px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'var(--wearable-accent)' : 'var(--wearable-border)'};
  border-radius: 16px;
  background: ${({ $selected }) =>
    $selected ? 'var(--wearable-accent-soft)' : 'var(--wearable-surface)'};
  box-shadow: var(--wearable-shadow);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $selected }) =>
      $selected ? 'var(--wearable-accent)' : 'var(--wearable-border-strong)'};
    background: ${({ $selected }) =>
      $selected ? 'var(--wearable-accent-soft)' : 'var(--wearable-surface-hover)'};
  }

  @container (max-width: 430px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const TargetMain = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const TargetTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
`;

const TargetTitleGroup = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

const TargetName = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--wearable-text-primary);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.2;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const TargetAddress = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--wearable-text-secondary);
  font-size: 12px;
  font-weight: 600;
  margin: 4px 0;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TargetDescription = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--wearable-text-tertiary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TargetActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: nowrap;

  @container (max-width: 430px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

const StatusDot = styled.span<{ $status: ConnectionStatus }>`
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  animation: ${({ $status }) => ($status === 'checking' ? spin : 'none')} 900ms
    linear infinite;
`;

const StatusBadge = styled.span<{ $status: ConnectionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  /* border: 1px solid ${({ $status }) => STATUS_TONE_VARS[$status].border}; */
  border-radius: 4px;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].background};
  color: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const ButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  min-height: 30px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }

  &:focus-visible {
    outline: 3px solid var(--wearable-focus);
    outline-offset: 2px;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface);
  color: var(--wearable-text-secondary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-border-strong);
    background: var(--wearable-surface-hover);
    color: var(--wearable-text-primary);
  }
`;

const ToolButton = styled(SecondaryButton)`
  flex: 1 1 132px;
  min-height: 38px;
  padding: 0 13px;
`;

const PrimaryToolButton = styled(ButtonBase)`
  flex: 1 1 132px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

const GhostButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-secondary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-border-strong);
    background: var(--wearable-surface-hover);
    color: var(--wearable-text-primary);
  }
`;

const ConnectButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

const DeleteButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: transparent;
  color: var(--wearable-text-tertiary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-error);
    background: var(--wearable-error-soft);
    color: var(--wearable-error);
  }
`;

const AddButton = styled(ButtonBase)`
  min-height: 44px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

const ScanButton = styled(ButtonBase)`
  min-height: 44px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

const StreamHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  min-height: 0;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StreamTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

const StreamTitle = styled.h2`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

const StreamCaption = styled.p`
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;

const StreamHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

const CurrentAccess = styled.div`
  display: grid;
  justify-items: end;
  gap: 3px;
  flex: 0 0 auto;

  span {
    color: var(--wearable-text-tertiary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  strong {
    color: var(--wearable-text-primary);
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    justify-items: start;
  }
`;

const ExpandButton = styled(ButtonBase)`
  gap: 7px;
  min-height: 40px;
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-primary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-accent);
    background: var(--wearable-accent-soft);
    color: var(--wearable-accent);
  }
`;

const StreamContent = styled.div`
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 24px;
  background: var(--wearable-surface-muted);
`;

const FrameBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #000000;
`;

const StyledIframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`;

const EmptyStreamState = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 36px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const EmptyIcon = styled.div`
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border: 1px solid var(--wearable-warning);
  border-radius: 999px;
  background: var(--wearable-warning-soft);
  color: var(--wearable-warning);
`;

const EmptyTitle = styled.h3`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.04em;
`;

const EmptyDesc = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  word-break: keep-all;

  strong {
    color: var(--wearable-success);
    font-weight: 900;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 28px;
  background: var(--wearable-overlay);
  backdrop-filter: blur(18px) saturate(1.1);
  animation: ${fadeIn} 180ms ease;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const DialogModal = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: ${({ $compact }) => ($compact ? 'min(540px, 94vw)' : 'min(760px, 94vw)')};
  max-height: min(760px, 88vh);
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 28px;
  background: var(--wearable-surface);
  box-shadow:
    0 24px 70px rgba(15, 23, 42, 0.2),
    var(--wearable-shadow);
  animation: ${popIn} 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 22px 18px;
  border-bottom: 1px solid var(--wearable-border);
`;

const DialogTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

const DialogEyebrow = styled.div`
  color: var(--wearable-accent);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 24px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

const DialogDescription = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
  word-break: keep-all;
`;

const DialogCloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid var(--wearable-border);
  border-radius: 999px;
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-secondary);
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--wearable-surface-hover);
    color: var(--wearable-error);
  }

  &:focus-visible {
    outline: 3px solid var(--wearable-focus);
    outline-offset: 2px;
  }
`;

const DialogBody = styled.div`
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 18px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ExpandedOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  padding: 0;
  background: #000000;
  animation: ${fadeIn} 180ms ease;
`;

const ExpandedModal = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #000000;
  box-shadow: none;
  animation: ${fadeIn} 180ms ease;
`;

const ExpandedHeader = styled.div`
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  left: max(16px, env(safe-area-inset-left));
  right: max(16px, env(safe-area-inset-right));
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 0 14px 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.62);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px) saturate(1.15);

  @media (max-width: 640px) {
    top: max(10px, env(safe-area-inset-top));
    left: max(10px, env(safe-area-inset-left));
    right: max(10px, env(safe-area-inset-right));
    min-height: 56px;
    padding: 0 10px 0 14px;
    border-radius: 18px;
  }
`;

const ExpandedTitleGroup = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const ExpandedEyebrow = styled.div`
  overflow: hidden;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

const ExpandedTitle = styled.div`
  min-width: 0;
  overflow: hidden;
  color: #ffffff;
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

const ExpandedCloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.24);
    color: #ffffff;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.28);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
  }
`;

const ExpandedFrameBox = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #000000;
`;