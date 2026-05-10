import type { RefObject } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

import { CloseButton, ModalDim, VideoModal } from '@/styles/action-history/styles';

interface VideoHistoryModalProps {
  isOpen?: boolean;
  title: string;
  src: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  onClose: () => void;
}

const VideoHistoryModal = ({ isOpen = true, title, src, videoRef, onClose }: VideoHistoryModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalDim onClick={onClose}>
      <VideoModal onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>

          <CloseButton type="button" aria-label="영상 모달 닫기" onClick={onClose}>
            <IoCloseSharp size={30} />
          </CloseButton>
        </div>

        <div className="modal-body">
          <div className="video-container">
            <video ref={videoRef} controls autoPlay>
              <source src={src} type="video/mp4" />
              브라우저가 비디오 재생을 지원하지 않습니다.
            </video>
          </div>
        </div>
      </VideoModal>
    </ModalDim>
  );
};

export default VideoHistoryModal;
