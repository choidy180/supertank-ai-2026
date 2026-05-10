import type { ChangeEvent } from 'react';
import { FaDownload, FaSpinner } from 'react-icons/fa';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

import { GhostButton, PrimaryButton, SearchBox, Toolbar, ToolbarActions } from '@/styles/action-history/styles';

interface ActionHistoryToolbarProps {
  keyword: string;
  placeholder: string;
  isLoading: boolean;
  onKeywordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadDateSummary: () => void;
  onDownloadDurationSummary: () => void;
  onRefresh: () => void;
}

const ActionHistoryToolbar = ({
  keyword,
  placeholder,
  isLoading,
  onKeywordChange,
  onDownloadDateSummary,
  onDownloadDurationSummary,
  onRefresh,
}: ActionHistoryToolbarProps) => {
  return (
    <Toolbar>
      <SearchBox>
        <FiSearch size={19} />
        <input type="text" value={keyword} placeholder={placeholder} onChange={onKeywordChange} />
      </SearchBox>

      <ToolbarActions>
        <GhostButton type="button" onClick={onDownloadDateSummary}>
          <FaDownload size={14} />
          날짜 Summary
        </GhostButton>

        <GhostButton type="button" onClick={onDownloadDurationSummary}>
          <FaDownload size={14} />
          조치시간 Summary
        </GhostButton>

        <PrimaryButton type="button" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? <FaSpinner className="spinner" size={14} /> : <FiRefreshCw size={15} />}
          새로고침
        </PrimaryButton>
      </ToolbarActions>
    </Toolbar>
  );
};

export default ActionHistoryToolbar;
