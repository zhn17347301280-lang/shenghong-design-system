import type { PropsWithChildren } from 'react';
/**
 * 项目根节点统一使用此 Provider。
 * App 组件可让 message、notification、modal 等上下文 API 同样获取主题。
 */
export declare function DesignSystemProvider({ children }: PropsWithChildren): import("react").JSX.Element;
