/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IHotkeyPianoState {
    keys: boolean[];
}
export declare class HotkeyPiano extends BaseExample<IHotkeyPianoState> {
    state: IHotkeyPianoState;
    private pianoRef;
    renderHotkeys(): JSX.Element;
    protected renderExample(): JSX.Element;
    private handleSetPianoRef;
    private focusPiano;
    private setKey;
}
