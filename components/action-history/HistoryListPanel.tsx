import type { ActionContextMeta, ActionHistoryItem } from '@/model/action-history/types';
import {
  EmptyBox,
  HistoryList,
  HistorySection,
  ResultCount,
  SectionCaption,
  SectionHeader,
  SectionTitle,
  SectionTitleGroup,
} from '@/styles/action-history/styles';
import HistoryCardItem from './HistoryCardItem';
import SkeletonCard from './SkeletonCard';

interface HistoryListPanelProps {
  meta: ActionContextMeta;
  items: ActionHistoryItem[];
  isInitialLoading: boolean;
  hasLoadedLogs: boolean;
  onSelectItem: (item: ActionHistoryItem) => void;
  onOpenVideo: (item: ActionHistoryItem) => void;
  onDownloadReport: (item: ActionHistoryItem) => void;
}

const HistoryListPanel = ({
  meta,
  items,
  isInitialLoading,
  hasLoadedLogs,
  onSelectItem,
  onOpenVideo,
  onDownloadReport,
}: HistoryListPanelProps) => {
  return (
    <HistorySection>
      <SectionHeader>
        <SectionTitleGroup>
          <SectionTitle>{meta.primaryLabel} 영상 리스트</SectionTitle>
          <SectionCaption>
            영상 리스트는 왼쪽에서 확인하고, 날짜별·조치시간 Summary는 오른쪽에서 확인합니다. 항목 클릭 시 상세 팝업, 영상 확인, PDF 보고서를 사용할 수 있습니다.
          </SectionCaption>
        </SectionTitleGroup>

        <ResultCount>
          <strong>{items.length}</strong>건
        </ResultCount>
      </SectionHeader>

      <HistoryList>
        {isInitialLoading && !hasLoadedLogs ? (
          Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)
        ) : items.length === 0 ? (
          <EmptyBox>{meta.emptyText}</EmptyBox>
        ) : (
          items.map((item) => (
            <HistoryCardItem
              key={item.id}
              item={item}
              onSelect={onSelectItem}
              onOpenVideo={onOpenVideo}
              onDownloadReport={onDownloadReport}
            />
          ))
        )}
      </HistoryList>
    </HistorySection>
  );
};

export default HistoryListPanel;
