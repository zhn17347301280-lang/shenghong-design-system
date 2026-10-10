# 图标资产

## 目录

- `svg/`：系统图标（单色、业务通用），按 `产品域-名称.svg` 命名，例如 `通用-搜索.svg`、`凌霄-复制.svg`。
- `svg/file/`：文件类型彩色图标，文件名即扩展名，例如 `pdf.svg`、`excel.svg`。
- `svg/ranking/`：排行榜彩色图标（奖杯），例如 `排行榜-冠军.svg`。
- `../../examples/icons/iconpark-web-component.html`：IconPark Web Component CDN 预览页。

## 更新流程

1. 从 MasterGo 导出 SVG，按上面的目录归类：
   - 单色系统图标放到 `src/icons/svg/`，命名为 `产品域-名称.svg`（产品域：通用 / 企业智能平台 / 凌霄 / 凌霄侧边栏 / 数据报告 / 平台管理后台）。
   - 文件类型图标放到 `src/icons/svg/file/`，以扩展名命名。
   - 排行榜等彩色业务图标放到 `src/icons/svg/ranking/`。
2. 新 SVG 应保持 `viewBox="0 0 16 16"`、不写死根节点宽高，单色图标使用
   `currentColor`，并移除无意义的背景、裁剪和 ID。
3. 如果使用 IconPark Web Component，需要重新上传修改后的 SVG，
   在 IconPark 点击“更新代码”，然后更换预览页中的 CDN 地址。

> 本地 SVG 和 IconPark CDN 是两份独立的产物。修改本地文件不会自动更新 CDN。
> 一次性 SVG 优化脚本和 SVGO 规则已经移除，后续新导出的文件需要在设计工具中
> 保持上述规范，或在接入自动生成组件时重新建立统一的构建流程。
