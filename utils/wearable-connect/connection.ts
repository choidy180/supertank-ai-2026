
import { ConnectionStatus, StreamTarget } from '@/types/wearable-connect/types';
import { getStreamUrl } from './target';
import { CONNECTION_TIMEOUT_MS } from '@/constants/wearable-connect/constants';

export const checkTargetConnection = async (
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
