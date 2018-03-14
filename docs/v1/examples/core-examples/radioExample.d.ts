/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IRadioExampleState {
    radioValue?: string;
}
export declare class RadioExample extends BaseExample<IRadioExampleState> {
    state: IRadioExampleState;
    private handleRadioChange;
    protected renderExample(): JSX.Element;
}
