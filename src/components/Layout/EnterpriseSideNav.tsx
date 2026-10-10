import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LocalIcon } from '../Icon/LocalIcon';
import organizationIcon from '../../icons/svg/企业智能平台-侧边栏-组织与权限.svg?raw';
import knowledgeIcon from '../../icons/svg/企业智能平台-侧边栏-知识中枢.svg?raw';
import ontoForgeIcon from '../../icons/svg/企业智能平台-侧边栏-OntoForge.svg?raw';
import capabilityIcon from '../../icons/svg/企业智能平台-侧边栏-智能能力与资源.svg?raw';
import integrationIcon from '../../icons/svg/企业智能平台-侧边栏-集成与资源管理.svg?raw';
import usageIcon from '../../icons/svg/企业智能平台-侧边栏-用量管理.svg?raw';
import collapseIcon from '../../icons/svg/企业智能平台-侧边栏-收起.svg?raw';
import expandIcon from '../../icons/svg/企业智能平台-侧边栏-展开.svg?raw';
import chevronIcon from '../../icons/svg/通用-展开.svg?raw';

export const ENTERPRISE_NAV_GROUPS = [
  { key: 'organization', label: '组织与权限', icon: organizationIcon, children: [
    { key: 'organization-management', label: '组织管理' },
    { key: 'member-management', label: '成员管理' },
    { key: 'role-management', label: '角色与权限管理' },
  ] },
  { key: 'knowledge', label: '知识中枢', icon: knowledgeIcon, children: [
    { key: 'knowledge-base', label: '知识库管理' },
    { key: 'knowledge-qa', label: '知识问答' },
  ] },
  { key: 'ontoforge', label: 'OntoForge', icon: ontoForgeIcon, children: [
    { key: 'semantic-canvas', label: '语义画布' },
    { key: 'ontology-modeling', label: '本体建模' },
    { key: 'logic-modeling', label: '逻辑建模' },
    { key: 'self-update', label: '智能创建与自更新' },
  ] },
  { key: 'capability', label: '智能能力与资源', icon: capabilityIcon, children: [
    { key: 'skills', label: '技能管理' },
    { key: 'mcp', label: 'MCP管理' },
    { key: 'templates', label: '模板管理' },
    { key: 'information-source', label: '信息源' },
  ] },
  { key: 'integration', label: '集成与渠道管理', icon: integrationIcon, children: [
    { key: 'message-channel', label: '消息渠道' },
  ] },
  { key: 'usage', label: '用量管理', icon: usageIcon, children: [
    { key: 'usage-statistics', label: '用量统计' },
    { key: 'resource-consumption', label: '资源消耗' },
  ] },
] as const;

export type EnterpriseNavKey = (typeof ENTERPRISE_NAV_GROUPS)[number]['children'][number]['key'];

export interface EnterpriseSideNavProps {
  selectedKey?: EnterpriseNavKey;
  collapsed?: boolean;
  onSelect?: (key: EnterpriseNavKey) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
}

export function EnterpriseSideNav({
  selectedKey = 'member-management',
  collapsed = false,
  onSelect,
  onCollapseChange,
  className,
}: EnterpriseSideNavProps) {
  const [openGroups, setOpenGroups] = useState<string[]>(ENTERPRISE_NAV_GROUPS.map((group) => group.key));
  const [hoveredGroupKey, setHoveredGroupKey] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeGroup = ENTERPRISE_NAV_GROUPS.find((group) => group.children.some((item) => item.key === selectedKey));
  const hoveredGroup = ENTERPRISE_NAV_GROUPS.find((group) => group.key === hoveredGroupKey);

  function cancelPopupClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }

  function closePopup() {
    cancelPopupClose();
    setHoveredGroupKey(null);
  }

  function schedulePopupClose() {
    cancelPopupClose();
    closeTimerRef.current = setTimeout(() => setHoveredGroupKey(null), 120);
  }

  function openPopup(group: (typeof ENTERPRISE_NAV_GROUPS)[number], trigger: HTMLElement) {
    if (!collapsed) return;
    cancelPopupClose();
    const bounds = trigger.getBoundingClientRect();
    const popupHeight = group.children.length * 44 + 4;
    const left = bounds.right + 8 + 208 <= window.innerWidth
      ? bounds.right + 8
      : Math.max(8, bounds.left - 208 - 8);
    const top = Math.max(8, Math.min(bounds.top, window.innerHeight - popupHeight - 8));
    setPopupPosition({ left, top });
    setHoveredGroupKey(group.key);
  }

  useEffect(() => {
    if (collapsed) return;
    setHoveredGroupKey(null);
  }, [collapsed]);

  useEffect(() => {
    if (!hoveredGroupKey) return;
    const closeIfOutside = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!navRef.current?.contains(target) && !popupRef.current?.contains(target)) closePopup();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePopup();
    };
    document.addEventListener('pointerdown', closeIfOutside);
    document.addEventListener('focusin', closeIfOutside);
    document.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closePopup);
    window.addEventListener('scroll', closePopup, true);
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside);
      document.removeEventListener('focusin', closeIfOutside);
      document.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closePopup);
      window.removeEventListener('scroll', closePopup, true);
    };
  }, [hoveredGroupKey]);

  useEffect(() => () => cancelPopupClose(), []);

  useEffect(() => {
    if (collapsed || !activeGroup) return;
    setOpenGroups((previous) => previous.includes(activeGroup.key) ? previous : [...previous, activeGroup.key]);
    const frame = requestAnimationFrame(() => {
      const menu = menuRef.current;
      const selected = menu?.querySelector<HTMLElement>('[aria-current="page"]');
      if (!menu || !selected) return;
      const itemTop = selected.getBoundingClientRect().top - menu.getBoundingClientRect().top + menu.scrollTop;
      const itemBottom = itemTop + selected.offsetHeight;
      if (itemTop < menu.scrollTop) menu.scrollTop = itemTop;
      else if (itemBottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = itemBottom - menu.clientHeight;
    });
    return () => cancelAnimationFrame(frame);
  }, [selectedKey, collapsed, activeGroup?.key]);

  return (
    <nav ref={navRef} className={['sh-enterprise-nav', collapsed && 'sh-enterprise-nav--collapsed', className].filter(Boolean).join(' ')} aria-label="企业智能平台侧边导航">
      <div className="sh-enterprise-nav__scroll" ref={menuRef}>
        {ENTERPRISE_NAV_GROUPS.map((group) => {
          const isActive = group.key === activeGroup?.key;
          const isOpen = openGroups.includes(group.key);
          return (
            <div className="sh-enterprise-nav__group" key={group.key}>
              <div className="sh-enterprise-nav__group-head">
                <button
                  type="button"
                  className={['sh-enterprise-nav__primary', isActive && 'is-active', collapsed && hoveredGroupKey === group.key && 'is-hovered'].filter(Boolean).join(' ')}
                  aria-label={collapsed ? group.label : undefined}
                  aria-expanded={collapsed ? hoveredGroupKey === group.key : isOpen}
                  aria-haspopup={collapsed ? 'menu' : undefined}
                  onMouseEnter={(event) => openPopup(group, event.currentTarget)}
                  onMouseLeave={collapsed ? schedulePopupClose : undefined}
                  onFocus={(event) => openPopup(group, event.currentTarget)}
                  onClick={(event) => {
                    if (collapsed) {
                      openPopup(group, event.currentTarget);
                      return;
                    }
                    setOpenGroups((previous) => previous.includes(group.key)
                      ? previous.filter((key) => key !== group.key)
                      : [...previous, group.key]);
                  }}
                >
                  <LocalIcon svg={group.icon} size={20} />
                  {!collapsed && <><span className="sh-enterprise-nav__label">{group.label}</span><LocalIcon svg={chevronIcon} size={12} className={isOpen ? 'sh-enterprise-nav__chevron is-open' : 'sh-enterprise-nav__chevron'} /></>}
                </button>
              </div>
              {!collapsed && isOpen && (
                <div className="sh-enterprise-nav__sublist">
                  {group.children.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={['sh-enterprise-nav__secondary', item.key === selectedKey && 'is-active'].filter(Boolean).join(' ')}
                      aria-current={item.key === selectedKey ? 'page' : undefined}
                      onClick={() => onSelect?.(item.key)}
                    >{item.label}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="sh-enterprise-nav__footer">
        <button type="button" className="sh-enterprise-nav__collapse" aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'} title={collapsed ? '展开侧边栏' : undefined} onClick={() => { closePopup(); onCollapseChange?.(!collapsed); }}>
          <LocalIcon svg={collapsed ? expandIcon : collapseIcon} size={20} />
          {!collapsed && <span>收起侧边栏</span>}
        </button>
      </div>
      {collapsed && hoveredGroup && createPortal(
        <div
          ref={popupRef}
          className="sh-enterprise-nav__popup"
          role="menu"
          aria-label={hoveredGroup.label}
          style={{ left: popupPosition.left, top: popupPosition.top }}
          onMouseEnter={cancelPopupClose}
          onMouseLeave={schedulePopupClose}
        >
          {hoveredGroup.children.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              className={['sh-enterprise-nav__popup-item', item.key === selectedKey && 'is-active'].filter(Boolean).join(' ')}
              aria-current={item.key === selectedKey ? 'page' : undefined}
              onClick={() => { onSelect?.(item.key); closePopup(); }}
            >{item.label}</button>
          ))}
        </div>,
        document.body,
      )}
    </nav>
  );
}
