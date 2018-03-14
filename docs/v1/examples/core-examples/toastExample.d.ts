/// <reference types="react" />
import { IToasterProps } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export declare class ToastExample extends BaseExample<IToasterProps> {
    state: IToasterProps;
    private TOAST_BUILDERS;
    private toaster;
    private refHandlers;
    private handlePositionChange;
    private toggleAutoFocus;
    private toggleEscapeKey;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderToastDemo(toast, index);
    private renderProgress(amount);
    private addToast(toast);
    private handleProgressToast;
}
