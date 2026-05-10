import {
  HistoryCard,
  HistoryCardBody,
  SkeletonLine,
  SkeletonThumb,
} from '@/styles/action-history/styles';

const SkeletonCard = () => {
  return (
    <HistoryCard>
      <SkeletonThumb />

      <HistoryCardBody>
        <SkeletonLine $width="72%" $height="28px" />
        <SkeletonLine $width="42%" $height="18px" />
        <SkeletonLine $width="100%" $height="18px" />
        <SkeletonLine $width="88%" $height="18px" />
      </HistoryCardBody>
    </HistoryCard>
  );
};

export default SkeletonCard;
