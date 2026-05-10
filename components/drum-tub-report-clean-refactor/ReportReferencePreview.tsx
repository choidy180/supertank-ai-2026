import {
  ReferenceDot,
  ReferenceLine,
  ReferencePreview,
} from '@/styles/drum-tub-report-clean-refactor/styles';

type ReportReferencePreviewProps = {
  label: string;
};

const ReportReferencePreview = ({ label }: ReportReferencePreviewProps) => {
  return (
    <ReferencePreview>
      <ReferenceLine />
      <ReferenceDot />
      <span>{label}</span>
    </ReferencePreview>
  );
};

export default ReportReferencePreview;
