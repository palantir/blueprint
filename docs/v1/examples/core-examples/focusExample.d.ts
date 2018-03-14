/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IFocusExampleState {
    isFocusActive?: boolean;
}
export declare class FocusExample extends BaseExample<IFocusExampleState> {
    state: {
        isFocusActive: boolean;
    };
    private toggleFocus;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
}
