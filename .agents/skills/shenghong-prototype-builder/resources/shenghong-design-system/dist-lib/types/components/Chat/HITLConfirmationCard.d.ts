export type HITLDialogKind = 'multi-input' | 'radio' | 'radio-input' | 'input';
export type HITLDialogStage = 'before' | 'during' | 'after';
export type HITLFormStage = 'draft' | 'complete' | 'submitted';
export declare function HITLDialogConfirmation({ kind, stage, count, onSubmit, onStop }: {
    kind?: HITLDialogKind;
    stage?: HITLDialogStage;
    count?: 'single' | 'multiple';
    onSubmit?: () => void;
    onStop?: () => void;
}): import("react").JSX.Element;
export declare function HITLFormConfirmation({ stage, onSubmit }: {
    stage?: HITLFormStage;
    onSubmit?: () => void;
}): import("react").JSX.Element;
