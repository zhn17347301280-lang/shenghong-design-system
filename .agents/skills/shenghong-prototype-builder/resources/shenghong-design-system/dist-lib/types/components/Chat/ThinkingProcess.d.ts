import { type ReactNode } from 'react';
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
export declare function ThinkingProcess({ title, statusText, steps, defaultOpen, open, onOpenChange, defaultExpandedKeys, expandedKeys, onExpandedKeysChange, running, }: ThinkingProcessProps): import("react").JSX.Element;
