# @shenghong/design-system portable bundle

这是随 `$shenghong-prototype-builder` 一起分发的组件库运行时包。它已经在 skill 文件夹内，不需要单独安装。它包含：

- `dist-lib/`：已构建的公开组件、主题 token 和 TypeScript 类型；
- `icons/`：组件库使用的 SVG 图标源文件；
- `component-catalog.md`：本包公开 API 目录。

它不包含 `node_modules`。目标原型项目需要自身已经具备 React、React DOM、Ant Design 和 `@ant-design/x` 运行环境；这不是组件库安装步骤。构建时将 `@shenghong/design-system` alias 到本目录即可，例如 Vite：

```ts
resolve: {
  alias: {
    '@shenghong/design-system': fileURLToPath(
      new URL('./.agents/skills/shenghong-prototype-builder/resources/shenghong-design-system', import.meta.url),
    ),
  },
}
```

如果原型项目本身就在 skill 目录下，也可以直接使用该本地包路径；不要复制成另一个手写组件库。

该包只作为 skill 的可移植运行时依赖，不能替代产品源码仓库。组件库更新后，应重新构建 `dist-lib`，再生成新的 portable bundle 版本。
