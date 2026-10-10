import { useMemo, useState } from 'react';
import { Card, Empty, Flex, Input, Tag, Typography } from 'antd';
import { LocalIcon } from '../index';
import { CatalogStatus } from './CatalogStatus';

const { Paragraph, Text, Title } = Typography;

const svgModules = import.meta.glob(
  ['../icons/svg/*.svg', '../icons/svg/file/*.svg', '../icons/svg/link-file/*.svg', '../icons/svg/ranking/*.svg'],
  { eager: true, query: '?raw', import: 'default' },
) as Record<string, string>;

/** 一级分组：系统图标 / 文件图标 / 文件链接图标 / 排行榜图标 */
type PrimaryGroup = 'system' | 'file' | 'file-link' | 'ranking';
type PrimaryFilter = PrimaryGroup | 'all';

const PRIMARY_TABS: { key: PrimaryFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'system', label: '系统图标' },
  { key: 'file', label: '文件图标' },
  { key: 'file-link', label: '文件链接图标' },
  { key: 'ranking', label: '排行榜图标' },
];

const GROUP_LABELS: Record<PrimaryGroup, string> = {
  system: '系统图标',
  file: '文件图标',
  'file-link': '文件链接图标',
  ranking: '排行榜图标',
};
const GROUP_ORDER: PrimaryGroup[] = ['system', 'file', 'file-link', 'ranking'];
const FILE_LINK_DISPLAY_NAMES: Record<string, string> = {
  'link-csv': 'CSV',
  'link-excel': 'Excel',
  'link-html': 'HTML',
  'link-image': '图片',
  'link-md': 'MD',
  'link-pdf': 'PDF',
  'link-ppt': 'PPT',
  'link-txt': 'TXT',
  'link-word': 'Word',
  'link-music': '音乐',
  'link-smart-result': '智能结果',
};

/** 系统图标下的二级产品域顺序 */
const DOMAIN_ORDER = [
  '通用',
  '企业智能平台',
  '凌霄',
  '凌霄侧边栏',
  '数据报告',
  '平台管理后台',
  '其他',
];

const RANKING_ORDER: Record<string, number> = { 冠军: 0, 亚军: 1, 季军: 2 };

function getFileName(path: string) {
  return decodeURIComponent(path.split('/').pop()?.replace(/\.svg$/i, '') ?? path);
}

function getSystemDomain(name: string) {
  if (name.startsWith('通用-') || name === '上传2') return '通用';
  if (name.startsWith('企业智能平台-')) return '企业智能平台';
  if (name.startsWith('凌霄侧边栏-')) return '凌霄侧边栏';
  if (name.startsWith('凌霄-')) return '凌霄';
  if (name.startsWith('数据报告-')) return '数据报告';
  if (name.startsWith('平台管理后台-')) return '平台管理后台';
  return '其他';
}

function cleanSvg(svg: string) {
  return svg.replace(/<\?xml[\s\S]*?\?>/gi, '').replace(/<!doctype[\s\S]*?>/gi, '');
}

interface IconItem {
  name: string;
  displayName: string;
  group: PrimaryGroup;
  domain?: string;
  svg: string;
}

const iconItems: IconItem[] = Object.entries(svgModules)
  .map(([path, raw]) => {
    const name = getFileName(path);
    if (path.includes('/svg/link-file/')) {
      return { name, displayName: FILE_LINK_DISPLAY_NAMES[name] ?? name, group: 'file-link' as const, svg: cleanSvg(raw) };
    }
    if (path.includes('/svg/file/')) {
      return { name, displayName: name, group: 'file' as const, svg: cleanSvg(raw) };
    }
    if (path.includes('/svg/ranking/')) {
      return {
        name,
        displayName: name.replace(/^排行榜-/, ''),
        group: 'ranking' as const,
        svg: cleanSvg(raw),
      };
    }
    return {
      name,
      displayName: name,
      group: 'system' as const,
      domain: getSystemDomain(name),
      svg: cleanSvg(raw),
    };
  })
  .sort((a, b) => {
    const groupDifference = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
    if (groupDifference) return groupDifference;
    if (a.group === 'system' && b.group === 'system') {
      const domainDifference = DOMAIN_ORDER.indexOf(a.domain ?? '') - DOMAIN_ORDER.indexOf(b.domain ?? '');
      return domainDifference || a.name.localeCompare(b.name, 'zh-CN');
    }
    if (a.group === 'ranking' && b.group === 'ranking') {
      return (RANKING_ORDER[a.displayName] ?? 99) - (RANKING_ORDER[b.displayName] ?? 99);
    }
    return a.displayName.localeCompare(b.displayName, 'zh-CN');
  });

function FilterChips<T extends string>({
  options,
  value,
  onChange,
  size = 'default',
}: {
  options: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
  size?: 'default' | 'small';
}) {
  return (
    <div className={`icon-filter-chips${size === 'small' ? ' icon-filter-chips--small' : ''}`} role="tablist">
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          role="tab"
          aria-selected={option.key === value}
          className={`icon-filter-chip${option.key === value ? ' is-active' : ''}`}
          onClick={() => onChange(option.key)}
        >
          {option.label}
          {typeof option.count === 'number' && <span className="icon-filter-chip__count">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}

function IconCard({ item, badge }: { item: IconItem; badge?: string }) {
  return (
    <article className="icon-item" data-category={badge ?? GROUP_LABELS[item.group]} key={item.name} title={item.displayName}>
      <div className="icon-item__preview"><LocalIcon svg={item.svg} size={item.group === 'ranking' ? 36 : item.group === 'file' || item.group === 'file-link' ? 32 : 22} /></div>
      <Text className="icon-item__name" ellipsis={{ tooltip: item.displayName }}>
        {item.displayName}
      </Text>
      <Text type="secondary" className="icon-item__category">
        {badge ?? item.domain ?? GROUP_LABELS[item.group]}
      </Text>
    </article>
  );
}

export function IconGallery() {
  const [keyword, setKeyword] = useState('');
  const [primary, setPrimary] = useState<PrimaryFilter>('all');
  const [domain, setDomain] = useState('全部');

  const groupCounts = useMemo(() => {
    const counts: Record<PrimaryGroup, number> = { system: 0, file: 0, 'file-link': 0, ranking: 0 };
    iconItems.forEach((item) => {
      counts[item.group] += 1;
    });
    return counts;
  }, []);

  const domainCounts = useMemo(() => {
    const counts = new Map<string, number>();
    iconItems
      .filter((item) => item.group === 'system')
      .forEach((item) => counts.set(item.domain ?? '其他', (counts.get(item.domain ?? '其他') ?? 0) + 1));
    return counts;
  }, []);

  const primaryOptions = useMemo(
    () =>
      PRIMARY_TABS.map((tab) => ({
        ...tab,
        count: tab.key === 'all' ? iconItems.length : groupCounts[tab.key],
      })),
    [groupCounts],
  );

  const domainOptions = useMemo(
    () => [
      { key: '全部', label: '全部', count: groupCounts.system },
      ...DOMAIN_ORDER.filter((item) => domainCounts.has(item)).map((item) => ({
        key: item,
        label: item,
        count: domainCounts.get(item),
      })),
    ],
    [domainCounts, groupCounts],
  );

  const filteredIcons = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase('zh-CN');
    return iconItems.filter((item) => {
      if (primary !== 'all' && item.group !== primary) return false;
      if (primary === 'system' && domain !== '全部' && item.domain !== domain) return false;
      if (
        normalizedKeyword &&
        !item.name.toLocaleLowerCase('zh-CN').includes(normalizedKeyword) &&
        !item.displayName.toLocaleLowerCase('zh-CN').includes(normalizedKeyword)
      ) {
        return false;
      }
      return true;
    });
  }, [domain, keyword, primary]);

  const groupedView = primary === 'all';

  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <Title level={2}>Icon 图标</Title>
        <Paragraph type="secondary">
          当前共收录 {iconItems.length} 个本地 SVG。可按系统、文件、文件链接和排行榜分类筛选，也可搜索图标名称。
        </Paragraph>
      </header>

      <CatalogStatus kind="asset">SVG 文件是可复用图标资产，可通过公共组件 LocalIcon 渲染；筛选器和图标卡片是展示页功能，不是公共组件。</CatalogStatus>

      <Card className="icon-toolbar">
        <Flex gap={12} align="center" wrap="wrap">
          <Input.Search
            allowClear
            className="icon-search"
            placeholder="搜索图标名称"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
          <Tag>{filteredIcons.length} 个结果</Tag>
        </Flex>
        <div className="icon-filter">
          <FilterChips
            options={primaryOptions}
            value={primary}
            onChange={(key) => {
              setPrimary(key);
              setDomain('全部');
            }}
          />
          {primary === 'system' && (
            <FilterChips options={domainOptions} value={domain} onChange={setDomain} size="small" />
          )}
        </div>
      </Card>

      {filteredIcons.length === 0 ? (
        <Empty description="没有匹配的图标" />
      ) : groupedView ? (
        GROUP_ORDER.map((group) => {
          const groupIcons = filteredIcons.filter((item) => item.group === group);
          if (groupIcons.length === 0) return null;
          return (
            <div className="icon-group" key={group}>
              <div className="icon-group__title">
                <Text strong>{GROUP_LABELS[group]}</Text>
                <Text type="secondary">{groupIcons.length}</Text>
              </div>
              <div className="icon-grid">
                {groupIcons.map((item) => (
                  <IconCard item={item} key={item.name} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="icon-grid">
          {filteredIcons.map((item) => (
            <IconCard item={item} key={item.name} badge={primary === 'system' ? item.domain : undefined} />
          ))}
        </div>
      )}
    </section>
  );
}
