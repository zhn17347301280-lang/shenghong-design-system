import { Card, Flex, Typography } from 'antd';
import {
  chartTokens,
  colorTokens,
  motionTokens,
  radiusTokens,
  shadowTokens,
  spacingTokens,
  typographyTokens,
} from '../index';
import { CatalogStatus } from './CatalogStatus';

const { Paragraph, Text, Title } = Typography;

function TokenSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="docs-section">
      <Title level={3} className="docs-section__title">{title}</Title>
      {children}
    </section>
  );
}

export function FoundationsTab() {
  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <Title level={2}>基础规范</Title>
        <Paragraph type="secondary">颜色、字体、间距、圆角、阴影、动效与图表色板。</Paragraph>
      </header>

      <CatalogStatus kind="asset">此页展示公开导出的主题变量；色块、间距条和排版预览只是文档示例，并非对应的 UI 组件。</CatalogStatus>

      <TokenSection title={`颜色 Colors · ${Object.keys(colorTokens).length}`}>
        <div className="token-grid token-grid--colors">
          {Object.entries(colorTokens).map(([name, value]) => (
            <Card className="color-token" key={name} size="small">
              <div className="color-token__swatch" style={{ background: value }} />
              <Text strong>{name}</Text>
              <Text type="secondary">{value}</Text>
            </Card>
          ))}
        </div>
      </TokenSection>

      <TokenSection title="字体 Typography">
        <Card>
          <Flex vertical gap={18}>
            <div>
              <Text strong>{typographyTokens.fontFamilyLabel}</Text><br />
              <Text type="secondary">使用 Ant Design 的系统字体回退；macOS 由系统别名加载 SF Pro。</Text>
            </div>
            <div><Title>一级标题 / {typographyTokens.fontSizeHeading1}px</Title><Text type="secondary">企业智能平台设计系统</Text></div>
            <div><Title level={2}>二级标题 / {typographyTokens.fontSizeHeading2}px</Title><Text type="secondary">页面区块与核心任务</Text></div>
            <div><Title level={3}>三级标题 / {typographyTokens.fontSizeHeading3}px</Title><Text type="secondary">组件分组与卡片标题</Text></div>
            <div><Text>正文 / {typographyTokens.fontSize}px · 用于主要阅读内容与表单信息。</Text></div>
            <div><Text type="secondary">辅助文字 / {typographyTokens.fontSizeSM}px · 用于时间、来源与解释信息。</Text></div>
          </Flex>
        </Card>
      </TokenSection>

      <div className="docs-grid docs-grid--2">
        <TokenSection title="间距 Spacing">
          <Card><Flex vertical gap={12}>{Object.entries(spacingTokens).map(([name, value]) => <Flex key={name} align="center" gap={12}><Text className="token-name">{name}</Text><span className="spacing-token" style={{ width: value }} /><Text type="secondary">{value}px</Text></Flex>)}</Flex></Card>
        </TokenSection>
        <TokenSection title="圆角 Radius">
          <Card><div className="radius-grid">{Object.entries(radiusTokens).map(([name, value]) => <div key={name} className="radius-token" style={{ borderRadius: value }}><Text>{name}</Text><Text type="secondary">{value}px</Text></div>)}</div></Card>
        </TokenSection>
        <TokenSection title="阴影 Shadow">
          <Card><div className="shadow-grid">{Object.entries(shadowTokens).map(([name, value]) => <div key={name} className="shadow-token" style={{ boxShadow: value }}><Text>{name}</Text></div>)}</div></Card>
        </TokenSection>
        <TokenSection title="动效 Motion">
          <Card><Flex vertical gap={12}>{Object.entries(motionTokens).map(([name, value]) => <Flex key={name} justify="space-between"><Text>{name}</Text><Text type="secondary">{value}</Text></Flex>)}</Flex></Card>
        </TokenSection>
      </div>

      <TokenSection title="图表色板 Chart palette">
        <Card><Flex vertical gap={16}><Flex gap={8}>{chartTokens.categorical.map((color) => <span key={color} className="palette-color" style={{ background: color }} title={color} />)}</Flex><Flex gap={8}>{chartTokens.sequentialBlue.map((color) => <span key={color} className="palette-color" style={{ background: color }} title={color} />)}</Flex></Flex></Card>
      </TokenSection>
    </section>
  );
}
