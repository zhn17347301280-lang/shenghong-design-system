import { useMemo, useState, type ReactNode } from 'react';
import { Think, ThoughtChain, type ThoughtChainItemType } from '@ant-design/x';
import { LocalIcon } from '../Icon/LocalIcon';

export interface ThinkingStep {
  key?: string;
  title: ReactNode;
  description?: ReactNode;
  duration?: ReactNode;
  icon?: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

export interface ThinkingProcessProps {
  title?: ReactNode;
  statusText?: ReactNode;
  steps: ThinkingStep[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  running?: boolean;
}

export function ThinkingProcess({
  title = '思考与执行', statusText, steps, defaultOpen = true, open, onOpenChange,
  defaultExpandedKeys, expandedKeys, onExpandedKeysChange, running = false,
}: ThinkingProcessProps) {
  const stepKeys = useMemo(() => steps.map((step, index) => step.key ?? `step-${index}`), [steps]);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerExpandedKeys, setInnerExpandedKeys] = useState<string[]>(defaultExpandedKeys ?? stepKeys);
  const resolvedOpen = open ?? innerOpen;
  const resolvedExpandedKeys = expandedKeys ?? innerExpandedKeys;

  const updateOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const updateExpandedKeys = (keys: string[]) => {
    if (expandedKeys === undefined) setInnerExpandedKeys(keys);
    onExpandedKeysChange?.(keys);
  };

  const items: ThoughtChainItemType[] = steps.map((step, index) => {
    const key = step.key ?? `step-${index}`;
    const isRunning = step.status === 'process';
    const isExpanded = resolvedExpandedKeys.includes(key);
    return {
      key,
      collapsible: false,
      blink: isRunning,
      icon: <span className="sh-thinking-process__marker" data-running={isRunning || undefined} />,
      title: (
        <div className="sh-thinking-process__step" data-running={isRunning || undefined}>
          <button
            type="button"
            className="sh-thinking-process__step-toggle"
            aria-expanded={step.description ? isExpanded : undefined}
            onClick={() => step.description && updateExpandedKeys(isExpanded
              ? resolvedExpandedKeys.filter((itemKey) => itemKey !== key)
              : [...resolvedExpandedKeys, key])}
          >
            {step.icon ? <LocalIcon svg={step.icon} size={16} className="sh-thinking-process__step-icon" /> : null}
            <span className="sh-thinking-process__step-title">{step.title}</span>
            <span className="sh-thinking-process__duration">{step.duration ?? '120s'}</span>
            {step.description ? <span className="sh-thinking-process__chevron" data-expanded={isExpanded || undefined} /> : null}
          </button>
          {step.description && isExpanded ? <div className="sh-thinking-process__description">{step.description}</div> : null}
        </div>
      ),
    };
  });

  return (
    <Think
      rootClassName="sh-thinking-process"
      data-open={resolvedOpen}
      classNames={{ status: 'sh-thinking-process__summary', content: 'sh-thinking-process__body' }}
      title={(
        <button
          type="button"
          className="sh-thinking-process__summary-toggle"
          aria-expanded={resolvedOpen}
          onClick={(event) => { event.stopPropagation(); updateOpen(!resolvedOpen); }}
        >
          <span>{title}</span>
          {statusText ? <span>{statusText}</span> : null}
          <span className="sh-thinking-process__chevron" data-expanded={resolvedOpen || undefined} />
        </button>
      )}
      icon={<span className="sh-thinking-process__summary-icon" aria-hidden />}
      blink={running}
      expanded={resolvedOpen}
      onExpand={updateOpen}
      destroyOnHidden
    >
      {resolvedOpen ? <ThoughtChain
        rootClassName="sh-thinking-process__chain"
        line="solid"
        items={items}
        classNames={{
          item: 'sh-thinking-process__item',
          itemIcon: 'sh-thinking-process__item-icon',
          itemHeader: 'sh-thinking-process__item-header',
          itemContent: 'sh-thinking-process__item-content',
        }}
      /> : null}
    </Think>
  );
}
