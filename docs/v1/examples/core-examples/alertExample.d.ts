/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IAlertExampleState {
    isOpen?: boolean;
    isOpenError?: boolean;
}
export declare class AlertExample extends BaseExample<{}> {
    state: IAlertExampleState;
    private toaster;
    private message;
    componentWillMount(): void;
    protected renderExample(): JSX.Element;
    private handleOpenError;
    private handleCloseError;
    private handleOpen;
    private handleMoveClose;
    private handleClose;
}
