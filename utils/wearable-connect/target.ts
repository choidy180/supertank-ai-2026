import { DEFAULT_NETWORK_PREFIX, DEFAULT_STREAM_PORT } from "@/constants/wearable-connect/constants";
import { ConnectionStatus, StreamTarget } from "@/types/wearable-connect/types";

export const createTargetId = (host: string, port: number) => {
  return `${host}:${port}`;
};

export const getDeviceLabel = (host: string) => {
  const prefix = `${DEFAULT_NETWORK_PREFIX}.`;

  if (host.startsWith(prefix)) {
    return `장비 ${host.replace(prefix, '')}`;
  }

  return `장비 ${host}`;
};

export const createStreamTarget = (
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

export const getStreamHost = (target: StreamTarget) => {
  return target.host;
};

export const getAccessLabel = (target: StreamTarget) => {
  return `${getStreamHost(target)}:${target.port}`;
};

export const getStreamUrl = (target: StreamTarget) => {
  return `http://${getAccessLabel(target)}`;
};

export const getStatusLabel = (status: ConnectionStatus) => {
  const labels: Record<ConnectionStatus, string> = {
    idle: '대기',
    checking: '확인 중',
    ok: '연결 가능',
    error: '연결 불가',
  };

  return labels[status];
};

export const getStatusDescription = (status: ConnectionStatus) => {
  const descriptions: Record<ConnectionStatus, string> = {
    idle: '상태 확인이 필요합니다.',
    checking: '디바이스 응답을 확인하고 있습니다.',
    ok: '스트림 서버가 응답했습니다.',
    error: '현재 응답이 없습니다.',
  };

  return descriptions[status];
};

export const formatCheckedAt = () => {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
};

const getHostSortParts = (host: string) => {
  return host.split('.').map((part) => Number(part));
};

export const sortTargets = (items: StreamTarget[]) => {
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

export const mergeTargets = (
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
