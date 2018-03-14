/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface ITextExampleState {
    textContent: string;
}
export declare class TextExample extends BaseExample<ITextExampleState> {
    state: ITextExampleState;
    private onInputChange;
    protected renderExample(): JSX.Element;
}
