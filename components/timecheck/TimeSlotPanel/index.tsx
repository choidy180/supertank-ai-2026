import type { FC } from 'react';

import type { TimeSlot } from '../model/types';
import {
  Panel,
  PanelCaption,
  PanelTitle,
  PanelTitleGroup,
  PanelTop
} from '../shared/styles';
import {
  SlotButton,
  SlotCaption,
  SlotIndicator,
  SlotList,
  SlotRow,
  SlotTime
} from './styles';

interface TimeSlotPanelProps {
  timeSlots: TimeSlot[];
  selectedTimeSlotId: string;
  onSelectTimeSlot: (slotId: string) => void;
}

const TimeSlotPanel: FC<TimeSlotPanelProps> = ({
  timeSlots,
  selectedTimeSlotId,
  onSelectTimeSlot
}) => {
  return (
    <Panel>
      <PanelTop>
        <PanelTitleGroup>
          <PanelTitle>타임체크 관람</PanelTitle>
          <PanelCaption>
            시간대를 바꾸면 점검 이력과 수동 상태 변경 기록 기준이 함께 바뀝니다.
          </PanelCaption>
        </PanelTitleGroup>
      </PanelTop>

      <SlotList>
        {timeSlots.map((slot) => {
          const isActive = slot.id === selectedTimeSlotId;

          return (
            <SlotButton
              key={slot.id}
              type="button"
              $active={isActive}
              onClick={() => onSelectTimeSlot(slot.id)}
            >
              <SlotRow>
                <SlotTime>{slot.label}</SlotTime>
                <SlotIndicator $active={isActive} />
              </SlotRow>

              <SlotCaption>{slot.caption}</SlotCaption>
            </SlotButton>
          );
        })}
      </SlotList>
    </Panel>
  );
};

export default TimeSlotPanel;
