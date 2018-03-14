/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { Film } from "./data";
export interface ISelectExampleState {
    film?: Film;
    filterable?: boolean;
    hasInitialContent?: boolean;
    minimal?: boolean;
    resetOnClose?: boolean;
    resetOnSelect?: boolean;
    disabled?: boolean;
}
export declare class SelectExample extends BaseExample<ISelectExampleState> {
    state: ISelectExampleState;
    private handleFilterableChange;
    private handleMinimalChange;
    private handleResetOnCloseChange;
    private handleResetOnSelectChange;
    private handleInitialContentChange;
    private handleDisabledChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderFilm({handleClick, isActive, item: film});
    private filterFilm(query, film, index);
    private handleValueChange;
    private handleSwitchChange(prop);
}
