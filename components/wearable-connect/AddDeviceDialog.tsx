import type { ChangeEvent, MouseEvent } from 'react';

import { LuX } from 'react-icons/lu';

import {
  AddButton,
  AddCard,
  AddInputGrid,
  AddTitle,
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
  TextInput,
} from '@/styles/wearable-connect/styles';

type AddDeviceDialogProps = {
  addressInput: string;
  formError: string;
  onClose: () => void;
  onAddressInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddTarget: () => boolean;
};

export function AddDeviceDialog({
  addressInput,
  formError,
  onClose,
  onAddressInputChange,
  onAddTarget,
}: AddDeviceDialogProps) {
  const handleAddTarget = () => {
    const didAdd = onAddTarget();

    if (didAdd) {
      onClose();
    }
  };

  return (
    <DialogOverlay onClick={onClose}>
      <DialogModal
        $compact
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-dialog-title"
        onClick={(event: MouseEvent) => event.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitleGroup>
            <DialogEyebrow>Manual Device</DialogEyebrow>
            <DialogTitle id="add-dialog-title">장비 직접 추가</DialogTitle>
            <DialogDescription>
              http://192.168.xx.xx:xxxx 또는 192.168.xx.xx:xxxx 형식으로
              입력하면 장비를 추가한 뒤 바로 상태를 확인합니다.
            </DialogDescription>
          </DialogTitleGroup>

          <DialogCloseButton
            type="button"
            aria-label="장비 직접 추가 닫기"
            onClick={onClose}
          >
            <LuX size={22} />
          </DialogCloseButton>
        </DialogHeader>

        <DialogBody>
          <AddCard>
            <AddTitle>스트림 주소 입력</AddTitle>

            <AddInputGrid>
              <InputGroup>
                <InputLabel>스트림 주소</InputLabel>
                <TextInput
                  value={addressInput}
                  inputMode="url"
                  placeholder="http://192.168.10.65:8080"
                  onChange={onAddressInputChange}
                />
              </InputGroup>

              <AddButton type="button" onClick={handleAddTarget}>
                추가 후 확인
              </AddButton>
            </AddInputGrid>

            {formError && <FormError>{formError}</FormError>}
          </AddCard>
        </DialogBody>
      </DialogModal>
    </DialogOverlay>
  );
}
