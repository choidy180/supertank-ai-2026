import { IoAlertCircle } from 'react-icons/io5';

import type { NetworkErrorState } from '@/model/action-history/types';
import {
  GhostButton,
  NetworkActions,
  NetworkDetail,
  NetworkIcon,
  NetworkModal,
  NetworkModalDim,
  NetworkText,
  NetworkTitle,
  PrimaryButton,
} from '@/styles/action-history/styles';

interface NetworkErrorModalProps {
  networkError: NetworkErrorState;
  onClose: () => void;
  onRetry: () => void;
}

const NetworkErrorModal = ({ networkError, onClose, onRetry }: NetworkErrorModalProps) => {
  return (
    <NetworkModalDim onClick={onClose}>
      <NetworkModal
        role="dialog"
        aria-modal="true"
        aria-labelledby="network-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <NetworkIcon>
          <IoAlertCircle />
        </NetworkIcon>

        <NetworkTitle id="network-modal-title">조치 이력 데이터를 불러오지 못했습니다</NetworkTitle>

        <NetworkText>
          로그 서버와 연결이 원활하지 않아 영상 리스트를 불러오지 못했습니다.
          <br />
          네트워크 상태 또는 API 서버 연결을 확인해주세요.
        </NetworkText>

        {networkError.detail && <NetworkDetail>{networkError.detail}</NetworkDetail>}

        <NetworkActions>
          <GhostButton type="button" onClick={onClose}>
            닫기
          </GhostButton>

          <PrimaryButton type="button" onClick={onRetry}>
            다시 시도
          </PrimaryButton>
        </NetworkActions>
      </NetworkModal>
    </NetworkModalDim>
  );
};

export default NetworkErrorModal;
