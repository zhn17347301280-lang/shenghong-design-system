import { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { LocalIcon } from '../Icon/LocalIcon';
import smartFeedIcon from '../../icons/svg/通用-全部功能、smartfeed.svg?raw';
import helpIcon from '../../icons/svg/通用-问号提示.svg?raw';

export interface SmartFeedHeaderProps {
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function SmartFeedHeader({ search, onSearchChange }: SmartFeedHeaderProps) {
  const [localSearch, setLocalSearch] = useState('');
  const value = search ?? localSearch;
  const updateSearch = (next: string) => {
    if (search === undefined) setLocalSearch(next);
    onSearchChange?.(next);
  };

  return (
    <header className="sh-smart-feed-header">
      <LocalIcon svg={smartFeedIcon} size={24} className="sh-smart-feed-header__icon" />
      <strong>SmartFeed</strong>
      <Tooltip title="SmartFeed 帮助">
        <span className="sh-smart-feed-header__help" role="img" aria-label="SmartFeed 帮助"><LocalIcon svg={helpIcon} size={16} /></span>
      </Tooltip>
      <span className="sh-smart-feed-header__spacer" />
      <Input.Search
        className="sh-smart-feed-header__search"
        size="middle"
        placeholder="任务名称"
        aria-label="搜索任务名称"
        value={value}
        onChange={(event) => updateSearch(event.target.value)}
        onSearch={updateSearch}
      />
    </header>
  );
}
