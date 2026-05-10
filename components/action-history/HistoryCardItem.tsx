import { FaCheckCircle, FaFilePdf, FaSpinner } from 'react-icons/fa';

import VideoThumbnail from '@/components/video-thumbnail';
import { formatDateTime, formatDuration, formatTimeDisplay } from '@/model/action-history/helpers';
import type { ActionHistoryItem } from '@/model/action-history/types';
import {
  CardActions,
  CardMetaRow,
  CardTitle,
  CardTitleGroup,
  CardTop,
  HistoryCard,
  HistoryCardBody,
  InfoGrid,
  InfoItem,
  PhenomenonLine,
  ReportButton,
  StatusPill,
  Thumb,
  VideoBtn,
} from '@/styles/action-history/styles';
import ExpandableDesc from './ExpandableDesc';

interface HistoryCardItemProps {
  item: ActionHistoryItem;
  onSelect: (item: ActionHistoryItem) => void;
  onOpenVideo: (item: ActionHistoryItem) => void;
  onDownloadReport: (item: ActionHistoryItem) => void;
}

const HistoryCardItem = ({ item, onSelect, onOpenVideo, onDownloadReport }: HistoryCardItemProps) => {
  const { date, time } = formatTimeDisplay(item.occurredAt);

  return (
    <HistoryCard
      key={item.id}
      role="button"
      tabIndex={0}
      $clickable
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
    >
      <Thumb>
        <VideoThumbnail videoUrl={item.videoSrc} width="100%" height="100%" className="thumb-img" />
      </Thumb>

      <HistoryCardBody>
        <CardTop>
          <CardTitleGroup>
            <CardTitle>조치보고: {item.reportTitle.replace('QR 코드 인식됨: ', '')}</CardTitle>
            <CardMetaRow>
              <span>{date}</span>
              <span className="sep">|</span>
              <span>{time}</span>
              <span className="sep">|</span>
              <span>{formatDuration(item.durationMinutes)}</span>
            </CardMetaRow>
          </CardTitleGroup>

          <StatusPill $status={item.status}>{item.status}</StatusPill>
        </CardTop>

        <InfoGrid>
          <InfoItem>
            <span>발생시각</span>
            <strong>{formatDateTime(item.occurredAt)}</strong>
          </InfoItem>
          <InfoItem>
            <span>완료시각</span>
            <strong>{item.completedAt ? formatDateTime(item.completedAt) : '-'}</strong>
          </InfoItem>
          <InfoItem>
            <span>설비명</span>
            <strong>{item.facilityName}</strong>
          </InfoItem>
          <InfoItem>
            <span>알람명</span>
            <strong>{item.alarmName}</strong>
          </InfoItem>
        </InfoGrid>

        <PhenomenonLine title={item.phenomenon}>
          <span>현상</span>
          <strong>{item.phenomenon}</strong>
        </PhenomenonLine>

        <ExpandableDesc text={item.actionContent} />

        <CardActions>
          <ReportButton
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDownloadReport(item);
            }}
          >
            <FaFilePdf size={14} />
            PDF
          </ReportButton>

          <VideoBtn
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenVideo(item);
            }}
            $ready={item.videoReady}
            disabled={!item.videoReady}
          >
            {item.videoReady ? (
              <>
                <FaCheckCircle size={18} />
                <span>영상 확인</span>
              </>
            ) : (
              <>
                <FaSpinner className="spinner" size={18} />
                <span>영상 생성중</span>
              </>
            )}
          </VideoBtn>
        </CardActions>
      </HistoryCardBody>
    </HistoryCard>
  );
};

export default HistoryCardItem;
