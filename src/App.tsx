import { useState } from 'react';
import { Tabs, Typography } from 'antd';
import { CommonTab } from './catalog/CommonTab';
import { EnterpriseTab } from './catalog/EnterpriseTab';
import { FoundationsTab } from './catalog/FoundationsTab';
import { IconGallery } from './catalog/IconGallery';
import { LingxiaoTab } from './catalog/LingxiaoTab';
import { CatalogStatus } from './catalog/CatalogStatus';

const { Paragraph, Text, Title } = Typography;

const validTabs = ['foundations', 'icons', 'common', 'enterprise', 'lingxiao'];

function getInitialTab() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'smartfeed') {
    window.history.replaceState(null, '', '#lingxiao');
    return 'lingxiao';
  }
  return validTabs.includes(hash) ? hash : 'foundations';
}

export default function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [senderValue, setSenderValue] = useState('');

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.history.replaceState(null, '', `#${key}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="page-shell">
      <div className={activeTab === 'enterprise' ? 'docs-shell docs-shell--enterprise' : 'docs-shell'}>
        <header className="docs-hero">
          <div>
            <Text className="docs-eyebrow">MASTERGO DESIGN SYSTEM</Text>
            <Title>盛虹设计系统</Title>
            <Paragraph type="secondary">
              基础变量、完整 Icon 资产、通用组件、企业智能平台与凌霄业务组件。
            </Paragraph>
          </div>
          <div className="docs-version"><Text strong>v0.1.0</Text><Text type="secondary">Ant Design 6.6.3</Text></div>
        </header>

        <div className="catalog-status-guide" aria-label="组件复用状态说明">
          <CatalogStatus kind="public">有公开导出，可从 @shenghong/design-system 引用；具体可配置能力以 Props 为准。</CatalogStatus>
          <CatalogStatus kind="mixed">展示效果由公共组件与展示页代码共同组成，不能把整块效果当作现成接口。</CatalogStatus>
          <CatalogStatus kind="example">只用于演示场景，未提供整块公共接口。</CatalogStatus>
          <CatalogStatus kind="asset">可复用的变量或 SVG 资源，不是页面组件。</CatalogStatus>
        </div>

        <Tabs
          className="catalog-tabs"
          activeKey={activeTab}
          onChange={handleTabChange}
          size="large"
          type="card"
          destroyOnHidden={false}
          items={[
            { key: 'foundations', label: '基础规范', children: <FoundationsTab /> },
            { key: 'icons', label: 'Icon 图标', children: <IconGallery /> },
            { key: 'common', label: '通用组件', children: <CommonTab /> },
            { key: 'enterprise', label: '企业智能平台', children: <EnterpriseTab /> },
            { key: 'lingxiao', label: '凌霄', children: <LingxiaoTab senderValue={senderValue} setSenderValue={setSenderValue} /> },
          ]}
        />
      </div>

    </main>
  );
}
