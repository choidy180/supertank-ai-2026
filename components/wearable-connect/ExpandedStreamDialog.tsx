import type { MouseEvent } from 'react';

import { LuX } from 'react-icons/lu';

import {
  ExpandedCloseButton,
  ExpandedEyebrow,
  ExpandedFrameBox,
  ExpandedHeader,
  ExpandedModal,
  ExpandedOverlay,
  ExpandedTitle,
  ExpandedTitleGroup,
  StyledIframe,
} from '@/styles/wearable-connect/styles';

type ExpandedStreamDialogProps = {
  selectedStreamUrl: string;
  onClose: () => void;
};

export function ExpandedStreamDialog({
  selectedStreamUrl,
  onClose,
}: ExpandedStreamDialogProps) {
  return (
    <ExpandedOverlay onClick={onClose}>
      <ExpandedModal
        role="dialog"
        aria-modal="true"
        aria-label="웨어러블 스트림 확대 화면"
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <ExpandedHeader>
          <ExpandedTitleGroup>
            <ExpandedEyebrow>Wearable Live Stream</ExpandedEyebrow>
            <ExpandedTitle>{selectedStreamUrl}</ExpandedTitle>
          </ExpandedTitleGroup>

          <ExpandedCloseButton
            type="button"
            aria-label="확대 화면 닫기"
            onClick={onClose}
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
  );
}
