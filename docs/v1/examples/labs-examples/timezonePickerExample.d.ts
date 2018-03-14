/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { TimezoneDisplayFormat } from "@blueprintjs/labs";
export interface ITimezonePickerExampleState {
    date?: Date;
    disabled?: boolean;
    showLocalTimezone?: boolean;
    targetDisplayFormat?: TimezoneDisplayFormat;
    timezone?: string;
}
export declare class TimezonePickerExample extends BaseExample<ITimezonePickerExampleState> {
    state: ITimezonePickerExampleState;
    private handleDisabledChange;
    private handleShowLocalTimezoneChange;
    private handleFormatChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderDisplayFormatOption();
    private handleTimezoneChange;
}
