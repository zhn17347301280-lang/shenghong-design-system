# 盛虹设计系统组件清单

来源：MasterGo《设计规范》（文件 `201408686860424`）。实现原则是优先映射 Ant Design
6.6.3 的公开 API，只有形成统一业务语义时才包装为本地组件。

## 已实现

| MasterGo 页面 | 本地组件 | 状态 |
| --- | --- | --- |
| Button按钮 | `AppButton` | 已实现类型、danger、状态与图标组合的统一入口 |
| Login登陆 | `LoginPanel` | 已实现密码/验证码、错误、加载及辅助操作 |
| Form Item表单项 | `AppFormItem` | 已实现上下/左右布局，以及只读、可编辑、编辑中、开关、错误状态 |
| Card卡片 | `MetricCard`、`ReportCard`、`EntityCard`、`OptionCard` | 已实现指标卡、报告卡、本体卡、卡片选项及交互状态 |
| Modal弹窗 | `AppModal`、`DetailFieldGroup`、`ModalItemCard`、`ResourcePickerContent`、`RankingContent` | 已实现仅读、编辑、条目、资源选择器和数据展示型弹窗 |
| File文件 | `FileUpload`、`AttachmentCard` | 已实现拖拽上传与上传中/成功/失败/警告状态 |
| Tag标签 | `StatusTag` | 已实现信息/成功/错误/警告/默认语义色 |
| Table表格 | `DataTable`、`TableCellContent`、`CellText` | 已实现工具栏（表格名称型/纯操作栏）、三段式分页、行选择复选框、操作按钮、单元格槽位组合与纯文字三类型 |
| Chart图表 | `ChartCard` | 已实现柱图/环图原型与规范色板 |

## 业务复合组件

| MasterGo 页面 | 本地组件 | 状态 |
| --- | --- | --- |
| 企业智能平台侧边/顶部导航 | `EnterpriseShell` | 已实现菜单、工作空间、用户菜单和内容区 |
| 企业智能平台详情页 | `DetailPage` | 已实现标题、面包屑、操作区、主辅栏布局 |
| Actions操作列表 | `MessageActions` | 已实现回答/问题两种操作行；使用引用、点踩、复制本地图标，20px 状态按钮与时间戳 |
| Site引用 | `SourceCitation` | 已实现知识库、联网搜索、类案检索三类来源及展开/收起、记录选中；对话预览中的编号包含默认/悬停/选中态，悬停显示含文件类型图标的资料卡，点击后在右侧显示 MasterGo `183:184997` 结构的文件栏、引用/页码工具栏与原文页并高亮正文；初始无选中项，再次点击可取消，正文保留蓝色填充与下划线，分隔线为 12px |
| Bubble对话气泡 | `ChatBubble` | 已实现用户/助手、附件、折叠和操作区；常规气泡内容自适应宽度，最大 640px，吸顶态保留展开交互 |
| React思考与执行 | `ThinkingProcess` | 已实现等待/进行/完成/失败步骤 |
| Sender输入框 | `ChatSender` | 已实现附件翻页、语音预览、@ 上下文、/ Skill、HITL、发送与停止 |
| HITL用户确认卡片 | `HITLCard` | 已实现确认、退回、跳过及语义状态 |
| MessageList消息队列 | `MessageQueue` | 已实现排队、运行、暂停、失败与操作事件 |
| SmartFeed | `SmartFeedCard` | 已实现摘要、状态、内容和选中态 |

## 交互状态规范

### Site 引用

`SourceCitation` 接收 `kind`（`knowledge` / `web` / `case`）和 `records`（每项包含 `id`、`title`、`source`，可选 `excerpt` 原文摘录及 `segmentCount` 引用段数）。可用 `expanded`、`selectedIndex` 控制展开与选中，也可用 `defaultExpanded`、`defaultSelectedIndex` 设置初始值；`selectedIndex={null}` 表示初始不选中。对应事件为 `onExpandedChange`、`onSelect`。联网搜索记录可通过 `brand` 指定站点标识，或通过 `icon` 传入自定义图标。

新增或调整可交互组件时，必须遵循以下统一约定，避免同名状态在不同组件上表现不一致。

### 卡片类：默认 / Hover / 选中 三级状态

`MetricCard`、`ReportCard`、`OptionCard` 共用同一套状态语言，区分点只在描边强弱，
**Hover 绝不等于选中**：

| 状态 | 描边 | 填充 | 阴影/位移 |
| --- | --- | --- | --- |
| 默认 | 卡片自身底色（指标卡 `#dfe8f9`，报告/选项卡 `#0000000f`） | 白底（指标卡带 `#6495f60d` 渐变） | `0 2px 8px` 轻阴影 |
| Hover | 浅蓝 `#91baff`（仅描边变色，**不加填充**） | 不变 | `0 8px 18px #6495f61a` + `translateY(-4px)` |
| 选中 | 主蓝 `#6495f6` | 报告/选项卡 `#f7fbff`；指标卡保持渐变白 | `0 0 0 1px #6495f633` 外环 |
| 选中后再 Hover | 维持主蓝 `#6495f6`，不退化 | 同选中 | 同选中 |

可选中卡片统一通过 `data-selectable` / `data-selected` 驱动样式：可选中时 `cursor: pointer`，
键盘聚焦 `:focus-visible` 为 `2px solid #91baff`、`outline-offset: 3px`。

可选中卡片统一 API（三个卡片一致）：

- `selectable?: boolean`：是否允许点击切换；
- `selected?: boolean`：受控选中态；`defaultSelected?: boolean`：非受控初始值；
- `onSelectedChange?(selected: boolean)`：变化回调；
- 可选中时渲染 `role="button"`、`tabIndex={0}`，支持 Enter / Space 触发；
- 卡片内部的操作区（如下载按钮）必须 `stopPropagation`，避免点操作误触发选中。

### Form Item：三个彼此正交的维度

`AppFormItem` 的状态按正交维度组织，任意合法组合都应能渲染：

1. **字段种类**（是什么）：单排文字、多排文字、下拉、Tab 切换、单选、多选、多字段合并、标签、开关；
2. **内容形式**（怎么呈现）：`edit` 可编辑 / `readonly` 仅可读 / `read-edit` 可读可编辑；
   - `read-edit` 默认只读，点「编辑」进入输入态，点「完成」回到只读；
   - 多选在只读态以标签展示已选项，编辑态勾选/取消后，只读标签需实时同步；
3. **校验状态**（横切）：正常 / 错误。错误是独立维度，可作用于**任意可编辑字段**；
   只读态不显示错误。切换字段种类或内容形式后，若当前错误态不再适用，需自动收敛回正常。

### Table：三段式结构 + 单元格两层区分

`DataTable` 固定为「工具栏 → 表格主体 → 分页」三段，分页用顶部分割线独立成区。

**1. 工具栏两种形态**（用 `toolbarVariant` 显式指定，或按 `title`/`categories` 自动推断）：

| 形态 | 取值 | 结构 | 规格 |
| --- | --- | --- | --- |
| 表格名称型 | `titled` | 左：16px/600 标题（可带描述）；右：分类分段 → 筛选按钮 → 关键词搜索 | 高 80px、内边距 24px、单行 32px |
| 纯操作栏 | `actions` | 左右分栏：左侧业务按钮组（`actions`，主按钮+描边按钮）；右侧固定为 分类分段 → 筛选 → 关键词搜索 → 刷新 | 内边距 16px 24px、按钮高 32px、间距 8px |

- 分类分段控件：容器灰底 `rgba(0,0,0,0.05)`、4px 圆角、padding 4px；选中项白底、1px
  `rgba(0,0,0,0.15)` 描边、主蓝字 `#6495F6`；未选为 14px 描述字色文字按钮。
- 筛选按钮：84×32 描边按钮（6px 圆角）+ 16px 自有筛选图标 + 「筛选」。
- 搜索框：宽 200px，placeholder「关键词搜索」，颜色 `rgba(0,0,0,0.25)`，右侧为 32px 独立搜索图标按钮（自有搜索图标）。
- 刷新：仅 icon 的 32×32 方形描边按钮（自有刷新图标），固定在工具栏最右；用 `refreshable`/`onRefresh` 控制。
- `categories` 支持受控（`activeCategory`/`onCategoryChange`）与非受控（`defaultActiveCategory`）。
- 工具栏与单元格里的所有图标必须使用组件库自有 `LocalIcon`（`src/icons/svg`），不要引入外部图标字体。

**2. 行选择（可选择 / 不可选择）**：

- 可选择：透传 antd `rowSelection`，第一列为 48px 复选框列（表头支持全选）；选中行整行底色 `#F0F7FF`。
- 不可选择：不传 `rowSelection`，复选框列不渲染（如单元格类型速查表）。

**3. 操作列必须用按钮**：操作项（编辑 / 移除 / 更多）渲染为 32px 高的描边 `AppButton`（6px 圆角、间距 8px），
「更多」为带下拉箭头的按钮；不要用链接文字。失效行的操作按钮整组 `disabled`。

**4. 单元格内容两层区分**，不要用一个大而全的枚举，按「槽位组合 + 纯文字语义」两层组织：

- 外层 `TableCellContent`：三个可缺省槽位，固定顺序 icon → text → tag，flex、gap 8px、垂直居中。
  - `icon`：前置 16×16 自有图标；`tag`：尾部 22px 标签（用 `StatusTag`）；
  - 共 6 种合法形态：纯文字 / 图标+文字 / 文字+标签 / 图标+文字+标签 / 仅图标 / 仅标签。
- 内层 `CellText`：仅在「纯文字」时区分三种语义（`type`）：

| 语义 | 取值 | 颜色 | 交互 |
| --- | --- | --- | --- |
| 普通文本 | `normal`（默认） | `rgba(0,0,0,0.88)` | 纯展示 |
| 跳转文本 | `link` | `#1677FF`（hover `#4096FF`） | 渲染为链接，可点击、可 Enter 触发 |
| 失效文本 | `disabled` | `rgba(0,0,0,0.25)` | `cursor: not-allowed`，不响应点击 |

文字字号统一 14px / 行高 22px；标签 12px / 20px。

### Login：主流程驱动异常状态

异常区不独立罗列全部状态，而是随上方主流程联动，只显示该流程真正能进入的异常：

- 验证码登录：仅「输入报错」；
- 密码登录：「输入报错」+「账号异常页面」（账号异常是信息页，用普通 primary 高亮、非危险色）；
- 找回密码：「手机号错误」「验证码错误」（危险色）；「设置密码」归属找回密码流程。

### Showcase 展示约定

- 统一「左侧单个交互预览卡片 + 右侧白色状态控制区」布局；
- 控制按钮选中用 `type="primary"`、未选用 `type="default"`，左对齐换行；
- 状态尽量做真实可点交互（点击切换、可编辑切换等），不要为同一组件的不同状态并排复制大卡片，
  状态差异通过交互体现。

## 后续精细化

- `Chart对话页面` 与 `DetailPage详情页面` 当前可由 `ChartCard`、`DetailPage`、对话组件组合；
  后续在真实业务原型中沉淀固定页面模板。
- MasterGo 内同一业务组件存在大量历史稿和场景稿。当前代码已覆盖公开的视觉/交互状态；
  后续应按实际产品需求补充数据字段，而不是把每张历史稿机械复制成独立组件。

业务复合组件保留了状态、事件和数据结构，可直接用于后续 HTML/React 原型。

## 原型工程使用方式

```tsx
import {
  DesignSystemProvider,
  MetricCard,
  StatusTag,
} from '@shenghong/design-system';
import '@shenghong/design-system/style.css';

export function Prototype() {
  return (
    <DesignSystemProvider>
      <MetricCard
        title="累计调用量"
        value="4,520"
        trend={<StatusTag tone="success">+12.4%</StatusTag>}
      />
    </DesignSystemProvider>
  );
}
```

本地构建：`npm run build:lib`。生成的 `dist-lib/` 可以被本地原型项目通过文件依赖引用。
