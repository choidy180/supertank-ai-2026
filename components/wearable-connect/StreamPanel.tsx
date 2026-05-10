import { LuMaximize2, LuTriangle } from 'react-icons/lu';

import {
  CurrentAccess,
  EmptyDesc,
  EmptyIcon,
  EmptyStreamState,
  EmptyTitle,
  ExpandButton,
  FrameBox,
  StreamCaption,
  StreamContent,
  StreamHeader,
  StreamHeaderActions,
  StreamPanel as StreamPanelShell,
  StreamTitle,
  StreamTitleGroup,
  StyledIframe,
} from '@/styles/wearable-connect/styles';

type StreamPanelProps = {
  selectedStreamUrl: string | null;
  onExpand: () => void;
};

export function StreamPanel({ selectedStreamUrl, onExpand }: StreamPanelProps) {
  return (
    <StreamPanelShell>
      <StreamHeader>
        <StreamTitleGroup>
          <StreamTitle>Live Stream</StreamTitle>
          <StreamCaption>
            {selectedStreamUrl
              ? `${selectedStreamUrl} 스트림을 표시 중입니다.`
              : '연결 가능한 장비를 확인한 뒤 연결할 스트림을 선택해주세요.'}
          </StreamCaption>
        </StreamTitleGroup>

        <StreamHeaderActions>
          <CurrentAccess>
            <span>ACCESS</span>
            <strong>{selectedStreamUrl ?? '-'}</strong>
          </CurrentAccess>

          <ExpandButton
            type="button"
            disabled={!selectedStreamUrl}
            onClick={onExpand}
          >
            <LuMaximize2 size={18} />
            화면 확대
          </ExpandButton>
        </StreamHeaderActions>
      </StreamHeader>

      <StreamContent>
        {selectedStreamUrl ? (
          <FrameBox>
            <StyledIframe
              key={selectedStreamUrl}
              src={selectedStreamUrl}
              allow="fullscreen"
              allowFullScreen
            />
          </FrameBox>
        ) : (
          <EmptyStreamState>
            <EmptyIcon>
              <LuTriangle size={34} />
            </EmptyIcon>

            <EmptyTitle>선택된 스트림이 없습니다</EmptyTitle>

            <EmptyDesc>
              왼쪽 장비 목록에서 상태가 <strong>연결 가능</strong>인 항목을
              선택하면 이 영역에 웨어러블 화면이 표시됩니다.
            </EmptyDesc>
          </EmptyStreamState>
        )}
      </StreamContent>
    </StreamPanelShell>
  );
}
