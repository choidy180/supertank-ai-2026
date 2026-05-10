'use client';

import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { NO_TEXT_MSG, WAITING_MSG } from '@/model/action-history/constants';
import { DescWrapper, TextContainer, ToggleButton } from '@/styles/action-history/styles';

interface ExpandableDescProps {
  text: string;
}

const ExpandableDesc = ({ text }: ExpandableDescProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const isWaiting = text === WAITING_MSG;

  useEffect(() => {
    if (!textRef.current) {
      return;
    }

    if (isWaiting || text === NO_TEXT_MSG) {
      setShowButton(false);
      return;
    }

    setShowButton(textRef.current.scrollHeight > textRef.current.clientHeight + 1);
  }, [text, isWaiting]);

  return (
    <DescWrapper>
      <TextContainer ref={textRef} $expanded={expanded} $isWaiting={isWaiting}>
        {text}
      </TextContainer>

      {showButton && !isWaiting && (
        <ToggleButton
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? (
            <>
              접기 <FaChevronUp size={14} />
            </>
          ) : (
            <>
              더보기 <FaChevronDown size={14} />
            </>
          )}
        </ToggleButton>
      )}
    </DescWrapper>
  );
};

export default ExpandableDesc;
