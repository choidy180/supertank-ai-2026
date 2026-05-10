'use client';

import { useCallback, useState } from 'react';

import { useThemeStore } from '@/store/useThemeStore';


import { AddDeviceDialog } from './AddDeviceDialog';
import { DeviceControlPanel } from './DeviceControlPanel';
import { ExpandedStreamDialog } from './ExpandedStreamDialog';
import { PageHeader } from './PageHeader';
import { ScannerDialog } from './ScannerDialog';
import { StreamPanel } from './StreamPanel';
import { useWearableContext } from '@/hooks/wearable-connect/useWearableContext';
import { useWearableTargets } from '@/hooks/wearable-connect/useWearableTargets';
import { useBodyScrollLock } from '@/hooks/wearable-connect/useBodyScrollLock';
import { ContentGrid, PageShell, ThemeScope } from '@/styles/wearable-connect/styles';
import { CONTEXT_META } from '@/constants/wearable-connect/constants';

export default function WearableConnectPage() {
  const isDark = useThemeStore((state) => state.isDark);
  const context = useWearableContext();
  const pageMeta = CONTEXT_META[context];

  const wearableTargets = useWearableTargets();

  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStreamExpanded, setIsStreamExpanded] = useState(false);

  const closeExpandedStream = useCallback(() => {
    setIsStreamExpanded(false);
  }, []);

  useBodyScrollLock(isStreamExpanded, closeExpandedStream);

  return (
    <ThemeScope $isDark={isDark}>
      <PageShell>
        <PageHeader
          pageMeta={pageMeta}
          targetCount={wearableTargets.targets.length}
          onlineCount={wearableTargets.onlineCount}
          checkingCount={wearableTargets.checkingCount}
        />

        <ContentGrid>
          <DeviceControlPanel
            pageMeta={pageMeta}
            targets={wearableTargets.targets}
            selectedTargetId={wearableTargets.selectedTargetId}
            onOpenScanner={() => setIsScannerModalOpen(true)}
            onOpenAdd={() => setIsAddModalOpen(true)}
            onCheckAll={wearableTargets.handleCheckAllTargets}
            onCheckTarget={wearableTargets.handleCheckTarget}
            onConnectTarget={wearableTargets.handleConnectTarget}
            onDeleteTarget={wearableTargets.handleDeleteTarget}
          />

          <StreamPanel
            selectedStreamUrl={wearableTargets.selectedStreamUrl}
            onExpand={() => setIsStreamExpanded(true)}
          />
        </ContentGrid>
      </PageShell>

      {isScannerModalOpen && (
        <ScannerDialog
          scanThirdOctetInput={wearableTargets.scanThirdOctetInput}
          scanStartInput={wearableTargets.scanStartInput}
          scanEndInput={wearableTargets.scanEndInput}
          scanPortInput={wearableTargets.scanPortInput}
          scanError={wearableTargets.scanError}
          scanResults={wearableTargets.scanResults}
          activeScanResults={wearableTargets.activeScanResults}
          isScanning={wearableTargets.isScanning}
          scanCompletedCount={wearableTargets.scanCompletedCount}
          scanTotalCount={wearableTargets.scanTotalCount}
          scanProgressPercent={wearableTargets.scanProgressPercent}
          scanExampleRange={wearableTargets.scanExampleRange}
          onClose={() => setIsScannerModalOpen(false)}
          onScanThirdOctetInputChange={
            wearableTargets.handleScanThirdOctetInputChange
          }
          onScanStartInputChange={wearableTargets.handleScanStartInputChange}
          onScanEndInputChange={wearableTargets.handleScanEndInputChange}
          onScanPortInputChange={wearableTargets.handleScanPortInputChange}
          onScanNearbyTargets={wearableTargets.handleScanNearbyTargets}
          onUseScanResult={wearableTargets.handleUseScanResult}
        />
      )}

      {isAddModalOpen && (
        <AddDeviceDialog
          addressInput={wearableTargets.addressInput}
          formError={wearableTargets.formError}
          onClose={() => setIsAddModalOpen(false)}
          onAddressInputChange={wearableTargets.handleAddressInputChange}
          onAddTarget={wearableTargets.handleAddTarget}
        />
      )}

      {isStreamExpanded && wearableTargets.selectedStreamUrl && (
        <ExpandedStreamDialog
          selectedStreamUrl={wearableTargets.selectedStreamUrl}
          onClose={closeExpandedStream}
        />
      )}
    </ThemeScope>
  );
}
