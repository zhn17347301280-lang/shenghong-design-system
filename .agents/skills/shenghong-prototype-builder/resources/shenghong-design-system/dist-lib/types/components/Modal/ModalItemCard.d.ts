import type { HTMLAttributes, ReactNode } from 'react';
export type ModalItemCardAppearance = 'bordered' | 'filled';
export interface ModalItemCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onSelect'> {
    title: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    control?: ReactNode;
    appearance?: ModalItemCardAppearance;
    selected?: boolean;
    onSelect?: () => void;
}
export declare function ModalItemCard({ title, description, icon, control, appearance, selected, onSelect, className, onKeyDown, ...props }: ModalItemCardProps): import("react").JSX.Element;
