# 盛虹设计系统

基于 MasterGo《设计规范》与 React 19 + Ant Design 6 的本地组件库和组件预览页。

## 开始工作前

先阅读 [`CHANGELOG.md`](./CHANGELOG.md)。其中记录当前完成范围、关键设计决策、最近修改和后续工作约定，
可以避免重复检查已经确认过的设计细节。

维护约定：每次完成组件、交互或视觉规范调整后，都要在 `CHANGELOG.md` 顶部的对应日期下补充记录；
如果公开组件能力发生变化，同时更新 `docs/COMPONENTS.md`。

## 启动

```bash
npm install
npm run dev
```

## GitHub Pages 预览

仓库公开后，在 GitHub 的 **Settings → Pages → Build and deployment** 中把 Source 设为
**GitHub Actions**。推送到 `main` 会通过 `.github/workflows/pages.yml` 自动构建并发布组件目录。
工作流按仓库名设置 Vite 的部署子路径，发布地址形如
`https://<用户名>.github.io/<仓库名>/`。根目录 `index.html` 和 `dist/` 是本地生成产物，
不需要提交；工作流会重新构建。

命令会自动打开 `.vite/index.html` 开发入口；也可按终端输出的本地地址访问。

验证生产构建：

```bash
npm run build
npm run preview
```

生成可直接双击、无需本地服务的单文件预览：

```bash
npm run build:single
```

生成后直接双击根目录的 `index.html`。该文件是唯一的对外预览文件，
已内联 JavaScript 与 CSS，无需本地服务。

构建供其他前端原型使用的组件库：

```bash
npm run build:lib
```

## 核心文件

- `CHANGELOG.md`：项目进度、设计决策与逐次更新记录；开始工作前优先阅读。
- `src/theme/colors.ts`：品牌颜色 Token。
- `src/theme/theme.ts`：Ant Design ThemeConfig。
- `src/providers/DesignSystemProvider.tsx`：全局主题入口。
- `src/components/`：可复用组件实现。
- `src/index.ts`：组件库公开导出入口。
- `src/App.tsx`：本地组件预览与交互验证页面。
- `docs/COMPONENTS.md`：MasterGo 页面到代码组件的覆盖清单。

颜色规范已同步 MasterGo `Theme colors` 图层中的 67 个 Token，包含 Primary、Success、
Warning、Error、Info、文字与图标、背景、边框与分割线。设计稿中的 `*Base` Token
会在 `theme.ts` 中映射为 Ant Design 对应的 seed token。

## 图标资产

`src/icons/svg/` 保存 16 × 16 的 SVG 源文件。单色图标的可见路径统一使用
`currentColor`，图标尺寸由后续的组件控制。现有 SVG 已完成一次性清理，工程中不再保留
SVGO 脚本和规则。

IconPark Web Component 预览页：

`http://localhost:5173/examples/icons/iconpark-web-component.html`

图标更新流程参见 `src/icons/README.md`。
