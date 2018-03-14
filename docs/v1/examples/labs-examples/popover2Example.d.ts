/// <reference types="react" />
import PopperJS from "popper.js";
import { PopoverInteractionKind } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IPopover2ExampleState {
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    hasBackdrop?: boolean;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    minimal?: boolean;
    modifiers?: PopperJS.Modifiers;
    placement?: PopperJS.Placement;
    sliderValue?: number;
}
export declare class Popover2Example extends BaseExample<IPopover2ExampleState> {
    state: IPopover2ExampleState;
    protected className: string;
    private handleExampleIndexChange;
    private handleInteractionChange;
    private handlePlacementChange;
    private handleBoundaryChange;
    private toggleEscapeKey;
    private toggleInline;
    private toggleMinimal;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private getContents(index);
    private handleSliderChange;
    private getModifierChangeHandler(name);
    private centerScroll;
}
