import type { ChangeEvent, MouseEvent } from 'react';

import { LuRadar, LuX } from 'react-icons/lu';

import type { StreamTarget } from '@/types/wearable-connect/types';

import {
  DialogBody,
  DialogCloseButton,
  DialogDescription,
  DialogEyebrow,
  DialogHeader,
  DialogModal,
  DialogOverlay,
  DialogTitle,
  DialogTitleGroup,
  FormError,
  InputGroup,
  InputLabel,
  InputRow,
  NumberInput,
  PrefixText,
  ProgressFill,
  ProgressText,
  ProgressTrack,
  ScanButton,
  ScanEmptyText,
  ScannerCard,
  ScannerDesc,
  ScannerIcon,
  ScannerTextGroup,
  ScannerTitle,
  ScannerTop,
  ScanHelp,
  ScanInputGrid,
  ScanProgress,
  ScanResultBox,
  ScanResultItem,
  ScanResultList,
  ScanResultTitle,
} from '@/styles/wearable-connect/styles';
import { DEFAULT_NETWORK_PREFIX, DEFAULT_STREAM_PORT, MAX_SCAN_COUNT } from '@/constants/wearable-connect/constants';
import { getStreamUrl } from '@/utils/wearable-connect/target';

type ScannerDialogProps = {
  scanThirdOctetInput: string;
  scanStartInput: string;
  scanEndInput: string;
  scanPortInput: string;
  scanError: string;
  scanResults: StreamTarget[];
  activeScanResults: StreamTarget[];
  isScanning: boolean;
  scanCompletedCount: number;
  scanTotalCount: number;
  scanProgressPercent: number;
  scanExampleRange: string;
  onClose: () => void;
  onScanThirdOctetInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScanStartInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScanEndInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScanPortInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onScanNearbyTargets: () => Promise<void>;
  onUseScanResult: (target: StreamTarget) => void;
};

export function ScannerDialog({
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
  onClose,
  onScanThirdOctetInputChange,
  onScanStartInputChange,
  onScanEndInputChange,
  onScanPortInputChange,
  onScanNearbyTargets,
  onUseScanResult,
}: ScannerDialogProps) {
  return (
    <DialogOverlay onClick={onClose}>
      <DialogModal
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-dialog-title"
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitleGroup>
            <DialogEyebrow>Network Discovery</DialogEyebrow>
            <DialogTitle id="scanner-dialog-title">근처 활성 IP 찾기</DialogTitle>
            <DialogDescription>
              {DEFAULT_NETWORK_PREFIX}.XX.XXX 대역에서 HTTP 포트 응답이 있는
              장비만 찾아 목록에 반영합니다.
            </DialogDescription>
          </DialogTitleGroup>

          <DialogCloseButton
            type="button"
            aria-label="근처 활성 IP 찾기 닫기"
            onClick={onClose}
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
                    onChange={onScanThirdOctetInputChange}
                  />
                </InputRow>
              </InputGroup>

              <InputGroup>
                <InputLabel>시작 끝번호</InputLabel>
                <NumberInput
                  value={scanStartInput}
                  inputMode="numeric"
                  placeholder="60"
                  onChange={onScanStartInputChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>종료 끝번호</InputLabel>
                <NumberInput
                  value={scanEndInput}
                  inputMode="numeric"
                  placeholder="80"
                  onChange={onScanEndInputChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>포트</InputLabel>
                <NumberInput
                  value={scanPortInput}
                  inputMode="numeric"
                  placeholder="8080"
                  onChange={onScanPortInputChange}
                />
              </InputGroup>

              <ScanButton
                type="button"
                disabled={isScanning}
                onClick={() => void onScanNearbyTargets()}
              >
                {isScanning ? '스캔 중' : '스캔 시작'}
              </ScanButton>
            </ScanInputGrid>

            <ScanHelp>
              예: {scanExampleRange} / 포트 {scanPortInput || DEFAULT_STREAM_PORT}
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
                          onClick={() => {
                            onUseScanResult(target);
                            onClose();
                          }}
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
  );
}
