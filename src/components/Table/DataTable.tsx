import { useState, type ReactNode } from 'react';
import { Button, Input, Space, Table, type PaginationProps, type TableProps } from 'antd';
import filterIconSvg from '../../icons/svg/通用-筛选.svg?raw';
import refreshIconSvg from '../../icons/svg/通用-刷新.svg?raw';
import searchIconSvg from '../../icons/svg/通用-搜索.svg?raw';
import { LocalIcon } from '../Icon/LocalIcon';
import { TableActionCell, type TableActionItem, type TableActionMore } from './TableActionCell';

const filterIcon = <LocalIcon svg={filterIconSvg} size={16} />;
const searchIcon = <LocalIcon svg={searchIconSvg} size={16} label="搜索" />;

/** 工具栏分类项（工具栏右侧的分段切换）。 */
export interface DataTableCategory {
  key: string;
  label: ReactNode;
}

export interface DataTableProps<RecordType extends object = object>
  extends Omit<TableProps<RecordType>, 'title' | 'pagination'> {
  /**
   * 工具栏形态：
   * - titled：表格名称型，高 80px，标题在左，右侧为操作 / 分类 / 筛选 / 搜索；
   * - actions：纯操作栏，左侧为业务操作按钮，右侧为分类 / 筛选 / 搜索 / 刷新。
   * 不传时按内容自动推断：有 title / categories 用 titled，否则用 actions。
   */
  toolbarVariant?: 'titled' | 'actions';
  /** 表格名称（仅 titled 形态展示）。 */
  title?: ReactNode;
  /** 标题下的补充说明，可选。 */
  description?: ReactNode;
  /** 分类切换项。 */
  categories?: DataTableCategory[];
  activeCategory?: string;
  defaultActiveCategory?: string;
  onCategoryChange?: (key: string) => void;
  /** 是否展示「筛选」按钮。 */
  filterable?: boolean;
  filterText?: ReactNode;
  onFilter?: () => void;
  /** 是否展示关键词搜索框（右侧带独立搜索图标按钮）。 */
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  /** 是否展示刷新按钮（纯操作栏下为仅 icon 的方形按钮，固定在最右）。 */
  refreshable?: boolean;
  onRefresh?: () => void;
  /** 业务操作按钮组：名称型工具栏显示在右侧，纯操作栏显示在左侧；兼容旧属性名 toolbar。 */
  actions?: ReactNode;
  toolbar?: ReactNode;
  /** 传 false 隐藏分页；否则为 antd 分页配置（默认带条数与每页条数切换）。 */
  pagination?: PaginationProps | false;
  /** 直角表格；企业智能平台详情页使用。 */
  square?: boolean;
  /** 与外层详情区域共边时，不再绘制第二圈外描边。 */
  flush?: boolean;
  /** 标准操作列：只传业务动作，DataTable 统一渲染操作单元格。 */
  rowActions?: (record: RecordType) => TableActionItem[];
  rowActionMore?: (record: RecordType) => TableActionMore | undefined;
  rowActionDisabled?: (record: RecordType) => boolean;
  /** 操作列宽度，默认 280px；业务按钮文案较长时可调整。 */
  rowActionWidth?: number;
  /** 默认在开启横向滚动时固定在右侧，也可以显式指定。 */
  rowActionFixed?: boolean;
}

/**
 * 表格容器，固定为「工具栏 → 表格主体 → 分页」三段式。
 * 工具栏支持表格名称型 / 纯操作栏两种形态；行可选择时透传 antd rowSelection
 * （第一列为复选框）。单元格内容建议用 TableCellContent（图标/文字/标签槽位）
 * 与 CellText（普通/跳转/失效）组合。
 *
 * 标准操作列优先使用 rowActions / rowActionMore，由 TableActionCell 统一按钮外观。
 * 特殊单元格仍可使用 columns.render 自定义，但不自动获得标准操作列视觉约束。
 * 横向滚动时固定列覆盖普通单元格：默认、悬停和选中背景都必须不透出下方文字。
 * src/styles/components.css 中的固定列悬停规则属于此视觉不变量，不应以局部 z-index 代替。
 */
export function DataTable<RecordType extends object = object>({
  rowKey = 'id',
  toolbarVariant,
  title,
  description,
  categories,
  activeCategory,
  defaultActiveCategory,
  onCategoryChange,
  filterable,
  filterText = '筛选',
  onFilter,
  searchable,
  searchPlaceholder = '关键词搜索',
  onSearch,
  refreshable,
  onRefresh,
  actions,
  toolbar,
  pagination,
  square = false,
  flush = false,
  rowActions,
  rowActionMore,
  rowActionDisabled,
  rowActionWidth = 280,
  rowActionFixed,
  columns,
  ...tableProps
}: DataTableProps<RecordType>) {
  const actionContent = actions ?? toolbar;
  const variant = toolbarVariant ?? (title || categories?.length ? 'titled' : 'actions');
  const hasTools = Boolean((variant === 'titled' && actionContent) || categories?.length || filterable || searchable || refreshable);
  const hasToolbar =
    variant === 'titled'
      ? Boolean(title || hasTools)
      : Boolean(actionContent || hasTools);

  const [innerCategory, setInnerCategory] = useState(defaultActiveCategory ?? categories?.[0]?.key);
  const currentCategory = activeCategory ?? innerCategory;
  const [searchValue, setSearchValue] = useState('');

  const handleCategoryChange = (key: string) => {
    if (activeCategory === undefined) setInnerCategory(key);
    onCategoryChange?.(key);
  };

  const triggerSearch = () => onSearch?.(searchValue);

  const searchNode = searchable ? (
    <Space.Compact className="sh-data-table__search">
      <Input
        allowClear
        className="sh-data-table__search-input"
        onChange={(event) => setSearchValue(event.target.value)}
        onPressEnter={triggerSearch}
        placeholder={searchPlaceholder}
        value={searchValue}
      />
      <Button
        aria-label="搜索"
        className="sh-data-table__search-button"
        icon={searchIcon}
        onClick={triggerSearch}
        title="搜索"
      />
    </Space.Compact>
  ) : null;

  const filterNode = filterable ? (
    <Button className="sh-data-table__filter" icon={filterIcon} onClick={onFilter}>
      {filterText}
    </Button>
  ) : null;

  const refreshNode = refreshable ? (
    <Button
      aria-label="刷新"
      className="sh-data-table__refresh"
      icon={<LocalIcon svg={refreshIconSvg} size={16} />}
      onClick={onRefresh}
      title="刷新"
    />
  ) : null;

  const categoryNode = categories?.length ? (
    <div className="sh-data-table__categories" role="tablist" aria-label="分类切换">
      {categories.map((category) => {
        const selected = category.key === currentCategory;
        return (
          <button
            key={category.key}
            aria-selected={selected}
            className={['sh-data-table__category', selected && 'is-active'].filter(Boolean).join(' ')}
            onClick={() => handleCategoryChange(category.key)}
            role="tab"
            type="button"
          >
            {category.label}
          </button>
        );
      })}
    </div>
  ) : null;

  const toolsNode = hasTools ? (
    <div className="sh-data-table__tools sh-data-table__tools--end">
      {variant === 'titled' && actionContent}
      {categoryNode}
      {filterNode}
      {searchNode}
      {refreshNode}
    </div>
  ) : null;

  const tablePagination =
    pagination === false
      ? false
      : {
          showSizeChanger: true,
          showTotal: (count: number) => `共 ${count} 条`,
          ...pagination,
        };

  const resolvedColumns: TableProps<RecordType>['columns'] = rowActions
    ? [
        ...(columns ?? []),
        {
          title: '操作',
          key: '__row_actions__',
          width: rowActionWidth,
          fixed: (rowActionFixed ?? Boolean(tableProps.scroll?.x)) ? 'right' : undefined,
          render: (_value: unknown, record: RecordType) => (
            <TableActionCell
              actions={rowActions(record)}
              more={rowActionMore?.(record)}
              disabled={rowActionDisabled?.(record)}
            />
          ),
        },
      ]
    : columns;

  return (
    <section className="sh-data-table" data-toolbar={hasToolbar ? variant : undefined} data-square={square} data-flush={flush}>
      {hasToolbar && (
        <div className={`sh-data-table__toolbar sh-data-table__toolbar--${variant}`}>
          {variant === 'titled' ? (
            <>
              <div className="sh-data-table__heading">
                {title && <span className="sh-data-table__title">{title}</span>}
                {description && <span className="sh-data-table__description">{description}</span>}
              </div>
              {toolsNode}
            </>
          ) : (
            <>
              {actionContent && (
                <div className="sh-data-table__tools sh-data-table__tools--start">{actionContent}</div>
              )}
              {toolsNode}
            </>
          )}
        </div>
      )}

      <Table<RecordType> rowKey={rowKey} className="sh-data-table__table" pagination={tablePagination} columns={resolvedColumns} {...tableProps}
        styles={square ? { root: { borderRadius: 0 }, header: { cell: { borderRadius: 0 } } } : tableProps.styles} />
    </section>
  );
}
