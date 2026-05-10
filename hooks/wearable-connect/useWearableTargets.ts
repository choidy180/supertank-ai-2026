
import { DEFAULT_NETWORK_PREFIX, DEFAULT_SCAN_END_HOST, DEFAULT_SCAN_START_HOST, DEFAULT_SCAN_THIRD_OCTET, DEFAULT_STREAM_PORT, DEFAULT_TARGET_HOSTS, MAX_SCAN_COUNT } from '@/constants/wearable-connect/constants';
import { StreamTarget } from '@/types/wearable-connect/types';
import { checkTargetConnection } from '@/utils/wearable-connect/connection';
import { isValidHostOctet, isValidPort, isValidThirdOctet, normalizeOctet, parseStreamAddress } from '@/utils/wearable-connect/network';
import { createStreamTarget, formatCheckedAt, getStreamUrl, mergeTargets, sortTargets } from '@/utils/wearable-connect/target';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';



const createDefaultTargets = () => {
  return DEFAULT_TARGET_HOSTS.map((host) => createStreamTarget(host));
};

export const useWearableTargets = () => {
  const [targets, setTargets] = useState<StreamTarget[]>(createDefaultTargets);
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

  const updateTarget = useCallback(
    (targetId: string, patch: Partial<Omit<StreamTarget, 'id'>>) => {
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
    },
    [],
  );

  const handleCheckTarget = useCallback(
    async (target: StreamTarget) => {
      updateTarget(target.id, {
        status: 'checking',
      });

      const nextStatus = await checkTargetConnection(target);

      updateTarget(target.id, {
        status: nextStatus,
        lastCheckedAt: formatCheckedAt(),
      });

      if (nextStatus !== 'ok') {
        setSelectedTargetId((prev) => (prev === target.id ? null : prev));
      }

      return nextStatus;
    },
    [updateTarget],
  );

  const handleCheckAllTargets = useCallback(() => {
    targets.forEach((target) => {
      void handleCheckTarget(target);
    });
  }, [handleCheckTarget, targets]);

  const handleConnectTarget = useCallback(
    async (target: StreamTarget) => {
      if (target.status === 'ok') {
        setSelectedTargetId(target.id);
        return;
      }

      const checkedStatus = await handleCheckTarget(target);

      if (checkedStatus === 'ok') {
        setSelectedTargetId(target.id);
      }
    },
    [handleCheckTarget],
  );

  const handleDeleteTarget = useCallback((targetId: string) => {
    setTargets((prev) => {
      return prev.filter((target) => target.id !== targetId);
    });

    setSelectedTargetId((prev) => (prev === targetId ? null : prev));
  }, []);

  const handleAddressInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setAddressInput(event.target.value);
      setFormError('');
    },
    [],
  );

  const handleScanThirdOctetInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[^0-9]/g, '');

      setScanThirdOctetInput(value);
      setScanError('');
    },
    [],
  );

  const handleScanStartInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[^0-9]/g, '');

      setScanStartInput(value);
      setScanError('');
    },
    [],
  );

  const handleScanEndInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[^0-9]/g, '');

      setScanEndInput(value);
      setScanError('');
    },
    [],
  );

  const handleScanPortInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[^0-9]/g, '');

      setScanPortInput(value);
      setScanError('');
    },
    [],
  );

  const handleAddTarget = useCallback(() => {
    const parsedAddress = parseStreamAddress(addressInput);

    if (!parsedAddress) {
      setFormError(
        '주소는 http://192.168.xx.xx:xxxx 또는 192.168.xx.xx:xxxx 형식으로 입력해주세요.',
      );
      return false;
    }

    const nextTarget = createStreamTarget(
      parsedAddress.host,
      parsedAddress.port,
    );

    const isDuplicated = targets.some((target) => target.id === nextTarget.id);

    if (isDuplicated) {
      setFormError('이미 등록된 스트림 주소입니다.');
      return false;
    }

    setTargets((prev) => sortTargets([...prev, nextTarget]));
    setAddressInput('');
    setFormError('');

    void handleCheckTarget(nextTarget);

    return true;
  }, [addressInput, handleCheckTarget, targets]);

  const handleScanNearbyTargets = useCallback(async () => {
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

    try {
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
    } finally {
      setIsScanning(false);
    }
  }, [scanEndInput, scanPortInput, scanStartInput, scanThirdOctetInput]);

  const handleUseScanResult = useCallback((target: StreamTarget) => {
    setTargets((prev) => mergeTargets(prev, [target]));
    setSelectedTargetId(target.id);
  }, []);

  useEffect(() => {
    createDefaultTargets().forEach((target) => {
      void handleCheckTarget(target);
    });
  }, [handleCheckTarget]);

  return {
    targets,
    selectedTargetId,
    selectedTarget,
    selectedStreamUrl,
    onlineCount,
    checkingCount,
    addressInput,
    formError,
    scanThirdOctetInput,
    scanStartInput,
    scanEndInput,
    scanPortInput,
    scanError,
    scanResults,
    activeScanResults,
    isScanning,
    scanCompletedCount,
    scanTotalCount,
    scanProgressPercent,
    scanExampleRange,
    handleCheckTarget,
    handleCheckAllTargets,
    handleConnectTarget,
    handleDeleteTarget,
    handleAddressInputChange,
    handleScanThirdOctetInputChange,
    handleScanStartInputChange,
    handleScanEndInputChange,
    handleScanPortInputChange,
    handleAddTarget,
    handleScanNearbyTargets,
    handleUseScanResult,
  };
};
