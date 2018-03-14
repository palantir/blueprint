/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IOverlayExampleState {
    autoFocus: boolean;
    canEscapeKeyClose: boolean;
    canOutsideClickClose: boolean;
    enforceFocus: boolean;
    hasBackdrop: boolean;
    inline: boolean;
    isOpen: boolean;
}
export declare class OverlayExample extends BaseExample<IOverlayExampleState> {
    state: IOverlayExampleState;
    private button;
    private refHandlers;
    private handleAutoFocusChange;
    private handleBackdropChange;
    private handleEnforceFocusChange;
    private handleEscapeKeyChange;
    private handleInlineChange;
    private handleOutsideClickChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    protected handleOpen: () => void;
    protected handleClose: () => void;
    private focusButton;
}
