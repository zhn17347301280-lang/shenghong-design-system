import { useEffect, useMemo, useState } from 'react';
import { Typography } from 'antd';
import { AppButton, ThinkingProcess, THINKING_DEMO_STEPS, type ThinkingStep } from '../index';

const { Paragraph, Title } = Typography;

const BASE_STEPS = THINKING_DEMO_STEPS;

const ALL_KEYS = BASE_STEPS.map((step) => step.key as string);
const RUNNING_TITLES = ['正在思考', '正在规划', '正在知识检索', '正在联网检索', '正在查询数据', '正在使用xx技能', '正在调用xx工具', '正在使用xx外部系统', '正在分析', '正在生成XXXX文件', '重新规划与自动修复'];

export function ThinkingShowcase() {
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(ALL_KEYS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setTimeout(() => {
      if (activeIndex >= BASE_STEPS.length - 1) {
        setRunning(false);
        setExpandedKeys(ALL_KEYS);
      } else {
        setActiveIndex((current) => current + 1);
      }
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [activeIndex, running]);

  const steps = useMemo(() => (running ? BASE_STEPS.slice(0, activeIndex + 1) : BASE_STEPS).map((step, index) => ({
    ...step,
    title: running && index === activeIndex ? RUNNING_TITLES[index] : step.title,
    status: running && index === activeIndex ? 'process' : 'finish',
  } satisfies ThinkingStep)), [activeIndex, running]);

  const replay = () => {
    setActiveIndex(0);
    setRunning(true);
    setOpen(true);
  };

  return (
    <div className="sh-thinking-demo">
      <section className="sh-thinking-demo__preview" aria-label="思考与执行交互预览">
        <div className="sh-thinking-demo__preview-header">
          <span>交互预览</span>
          <span>{running ? '思考中' : '思考结束'} · {open ? '展开' : '收起'}</span>
        </div>
        <div className="sh-thinking-demo__stage" data-open={open}>
          <ThinkingProcess
            statusText={running ? `${(activeIndex + 1) * 12}s` : '360s'}
            steps={steps}
            open={open}
            onOpenChange={setOpen}
            expandedKeys={expandedKeys}
            onExpandedKeysChange={setExpandedKeys}
            running={running}
          />
        </div>
      </section>

      <aside className="sh-thinking-demo__controls" aria-label="思考与执行状态控制">
        <div>
          <Title level={4}>状态控制</Title>
          <Paragraph type="secondary">切换执行状态；点击预览总标题或任一条目可展开、收起。</Paragraph>
        </div>
        <fieldset className="sh-thinking-demo__control-group">
          <legend>执行状态</legend>
          <div className="sh-thinking-demo__control-buttons">
            <AppButton size="small" type={!running ? 'primary' : 'default'} onClick={() => setRunning(false)}>思考结束</AppButton>
            <AppButton size="small" type={running ? 'primary' : 'default'} onClick={replay}>思考中</AppButton>
          </div>
        </fieldset>
      </aside>
    </div>
  );
}
