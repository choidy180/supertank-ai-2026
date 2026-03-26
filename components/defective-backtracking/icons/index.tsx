import type { HistoryIcon, SummaryCardIcon } from '../model/types';

interface IconProps {
  size?: number;
}

export const TrendUpIcon = ({ size = 26 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 16L10 10L14 14L20 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7H20V12.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const GearIcon = ({ size = 30 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.9 3.6L15.4 5.4C15.6 5.5 15.9 5.6 16.2 5.7L17.8 4.9L19.3 6.4L18.5 8C18.6 8.3 18.7 8.6 18.8 8.9L20.6 9.4V11.6L18.8 12.1C18.7 12.4 18.6 12.7 18.5 13L19.3 14.6L17.8 16.1L16.2 15.3C15.9 15.4 15.6 15.5 15.4 15.6L14.9 17.4H12.7L12.2 15.6C11.9 15.5 11.6 15.4 11.4 15.3L9.8 16.1L8.3 14.6L9.1 13C9 12.7 8.9 12.4 8.8 12.1L7 11.6V9.4L8.8 8.9C8.9 8.6 9 8.3 9.1 8L8.3 6.4L9.8 4.9L11.4 5.7C11.6 5.6 11.9 5.5 12.2 5.4L12.7 3.6H14.9Z"
        fill="currentColor"
      />
      <circle cx="13.8" cy="10.5" r="2.1" fill="white" />
      <path
        d="M6.8 10.4L7.1 11.5C7.3 11.6 7.5 11.7 7.7 11.7L8.7 11.2L9.7 12.2L9.2 13.2C9.3 13.4 9.4 13.6 9.4 13.8L10.5 14.1V15.5L9.4 15.8C9.4 16 9.3 16.2 9.2 16.4L9.7 17.4L8.7 18.4L7.7 17.9C7.5 17.9 7.3 18 7.1 18.1L6.8 19.2H5.4L5.1 18.1C4.9 18 4.7 17.9 4.5 17.9L3.5 18.4L2.5 17.4L3 16.4C2.9 16.2 2.8 16 2.8 15.8L1.7 15.5V14.1L2.8 13.8C2.8 13.6 2.9 13.4 3 13.2L2.5 12.2L3.5 11.2L4.5 11.7C4.7 11.7 4.9 11.6 5.1 11.5L5.4 10.4H6.8Z"
        fill="currentColor"
        opacity="0.82"
      />
      <circle cx="6.1" cy="14.8" r="1.2" fill="white" />
    </svg>
  );
};

export const CheckIcon = ({ size = 30 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.3" />
      <path
        d="M8.6 12.2L11.1 14.7L15.7 10.1"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const WrenchIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.4 4.8C14.2 5.6 14.4 6.5 15 7.1C15.8 7.9 17.1 8 18 7.4L19.3 8.7C19.8 9.2 19.8 10 19.3 10.5L10.1 19.7C9.6 20.2 8.8 20.2 8.3 19.7L4.3 15.7C3.8 15.2 3.8 14.4 4.3 13.9L13.5 4.7C14 4.2 14.8 4.2 15.3 4.7L16.6 6C16 6.9 16.1 8.2 16.9 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="16.5" r="1.1" fill="currentColor" />
    </svg>
  );
};

export const SensorIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.6" y="4.6" width="14.8" height="14.8" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M8 4.2V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4.2V2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 21.5V19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 21.5V19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4.2 8H2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4.2 16H2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21.5 8H19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21.5 16H19.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const NoteIcon = ({ size = 18 }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 19.5L8.7 18.6L18 9.3C18.7 8.6 18.7 7.4 18 6.7L17.3 6C16.6 5.3 15.4 5.3 14.7 6L5.4 15.3L4.5 19.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.2 7.5L16.5 10.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
};

export const renderSummaryIcon = (icon: SummaryCardIcon) => {
  switch (icon) {
    case 'trend':
      return <TrendUpIcon />;
    case 'gear':
      return <GearIcon />;
    case 'check':
      return <CheckIcon />;
    default:
      return <TrendUpIcon />;
  }
};

export const renderHistoryIcon = (icon: HistoryIcon) => {
  switch (icon) {
    case 'wrench':
      return <WrenchIcon />;
    case 'sensor':
      return <SensorIcon />;
    case 'note':
      return <NoteIcon />;
    default:
      return <WrenchIcon />;
  }
};
