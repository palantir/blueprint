/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
import { Film } from "./data";
export interface IMultiSelectExampleState {
    films?: Film[];
    hasInitialContent?: boolean;
    intent?: boolean;
    openOnKeyDown?: boolean;
    popoverMinimal?: boolean;
    resetOnSelect?: boolean;
    tagMinimal?: boolean;
}
export declare class MultiSelectExample extends BaseExample<IMultiSelectExampleState> {
    state: IMultiSelectExampleState;
    private handleKeyDownChange;
    private handleResetChange;
    private handlePopoverMinimalChange;
    private handleTagMinimalChange;
    private handleIntentChange;
    private handleInitialContentChange;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderTag;
    private renderFilm;
    private filterFilm(query, film, index);
    private handleTagRemove;
    private getSelectedFilmIndex(film);
    private isFilmSelected(film);
    private selectFilm(film);
    private deselectFilm(index);
    private handleFilmSelect;
    private handleSwitchChange(prop);
}
