import { FaFilePdf } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

import { formatDateTime, formatDuration } from '@/model/action-history/helpers';
import type { ActionContextMeta, ActionHistoryItem } from '@/model/action-history/types';
import {
  CloseButton,
  DetailGrid,
  DetailItem,
  DetailModal,
  DetailSection,
  DetailSectionTitle,
  DetailText,
  GhostButton,
  ModalActions,
  ModalBody,
  ModalDim,
  ModalEyebrow,
  ModalHeader,
  ModalTitle,
  ModalTitleGroup,
  PrimaryButton,
  StatusPill,
  VideoBox,
} from '@/styles/action-history/styles';

interface DetailHistoryModalProps {
  item: ActionHistoryItem | null;
  meta: ActionContextMeta;
  onClose: () => void;
  onDownloadReport: (item: ActionHistoryItem) => void;
}

const DetailHistoryModal = ({ item, meta, onClose, onDownloadReport }: DetailHistoryModalProps) => {
  if (!item) {
    return null;
  }

  return (
    <ModalDim onClick={onClose}>
      <DetailModal
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitleGroup>
            <ModalEyebrow>{meta.badge}</ModalEyebrow>
            <ModalTitle id="history-detail-title">{item.reportTitle}</ModalTitle>
          </ModalTitleGroup>

          <CloseButton type="button" aria-label="상세 팝업 닫기" onClick={onClose}>
            <IoCloseSharp size={30} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <DetailGrid>
            <DetailItem>
              <span>발생시각</span>
              <strong>{formatDateTime(item.occurredAt)}</strong>
            </DetailItem>
            <DetailItem>
              <span>완료시각</span>
              <strong>{item.completedAt ? formatDateTime(item.completedAt) : '-'}</strong>
            </DetailItem>
            <DetailItem>
              <span>조치시간</span>
              <strong>{formatDuration(item.durationMinutes)}</strong>
            </DetailItem>
            <DetailItem>
              <span>상태</span>
              <StatusPill $status={item.status}>{item.status}</StatusPill>
            </DetailItem>
            <DetailItem>
              <span>설비명</span>
              <strong>{item.facilityName}</strong>
            </DetailItem>
            <DetailItem>
              <span>알람명</span>
              <strong>{item.alarmName}</strong>
            </DetailItem>
          </DetailGrid>

          <DetailSection>
            <DetailSectionTitle>현상</DetailSectionTitle>
            <DetailText>{item.phenomenon || '-'}</DetailText>
          </DetailSection>

          <DetailSection>
            <DetailSectionTitle>조치내용</DetailSectionTitle>
            <DetailText>{item.actionContent || '-'}</DetailText>
          </DetailSection>

          {item.fullLogText && (
            <DetailSection>
              <DetailSectionTitle>원문 로그</DetailSectionTitle>
              <DetailText>{item.fullLogText}</DetailText>
            </DetailSection>
          )}

          <DetailSection>
            <DetailSectionTitle>조치 영상</DetailSectionTitle>
            {item.videoReady ? (
              <VideoBox controls>
                <source src={item.videoSrc} type="video/mp4" />
                브라우저가 비디오 재생을 지원하지 않습니다.
              </VideoBox>
            ) : (
              <DetailText>영상 생성 중입니다. 잠시 후 다시 확인해주세요.</DetailText>
            )}
          </DetailSection>
        </ModalBody>

        <ModalActions>
          <GhostButton type="button" onClick={onClose}>
            닫기
          </GhostButton>
          <PrimaryButton type="button" onClick={() => onDownloadReport(item)}>
            <FaFilePdf size={14} />
            {meta.reportButtonLabel}
          </PrimaryButton>
        </ModalActions>
      </DetailModal>
    </ModalDim>
  );
};

export default DetailHistoryModal;
