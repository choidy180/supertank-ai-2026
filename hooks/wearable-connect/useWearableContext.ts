import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';
import { WearableContext } from '@/types/wearable-connect/types';




export const useWearableContext = () => {
  const searchParams = useSearchParams();

  return useMemo<WearableContext>(() => {
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
};
