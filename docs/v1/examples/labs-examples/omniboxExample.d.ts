/// <reference types="react" />
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IOmniboxExampleState {
    isOpen: boolean;
    resetOnSelect: boolean;
}
export declare class OmniboxExample extends BaseExample<IOmniboxExampleState> {
    state: IOmniboxExampleState;
    private handleResetChange;
    private toaster;
    private refHandlers;
    renderHotkeys(): JSX.Element;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private renderFilm({handleClick, isActive, item: film});
    private filterFilm(query, film, index);
    private handleClick;
    private handleItemSelect;
    private handleClose;
    private handleBlur;
    private handleToggle;
}
