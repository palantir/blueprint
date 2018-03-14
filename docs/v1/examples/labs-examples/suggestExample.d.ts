/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { Film } from "./data";
export interface ISuggestExampleState {
    closeOnSelect?: boolean;
    film?: Film;
    minimal?: boolean;
    openOnKeyDown?: boolean;
}
export declare class SuggestExample extends BaseExample<ISuggestExampleState> {
    state: ISuggestExampleState;
    private handleCloseOnSelectChange;
    private handleOpenOnKeyDownChange;
    private handleMinimalChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderFilm({handleClick, isActive, item: film});
    private renderInputValue;
    private filterFilm(query, film, index);
    private handleValueChange;
    private handleSwitchChange(prop);
}
