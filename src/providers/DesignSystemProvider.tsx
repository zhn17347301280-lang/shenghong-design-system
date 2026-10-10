import type { PropsWithChildren } from 'react';
import { App, ConfigProvider } from 'antd';
import { appTheme } from '../theme';

/**
 * 项目根节点统一使用此 Provider。
 * App 组件可让 message、notification、modal 等上下文 API 同样获取主题。
 */
export function DesignSystemProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={appTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
