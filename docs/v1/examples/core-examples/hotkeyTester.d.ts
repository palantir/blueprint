/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IHotkeyTesterState {
    combo: string;
}
export declare class HotkeyTester extends BaseExample<IHotkeyTesterState> {
    state: IHotkeyTesterState;
    protected renderExample(): JSX.Element;
    private renderKeyCombo();
    private handleKeyDown;
}
