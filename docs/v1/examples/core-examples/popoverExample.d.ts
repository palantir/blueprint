/// <reference types="react" />
import { ITetherConstraint, PopoverInteractionKind, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs-theme";
export interface IPopoverExampleState {
    canEscapeKeyClose?: boolean;
    exampleIndex?: number;
    inheritDarkTheme?: boolean;
    inline?: boolean;
    interactionKind?: PopoverInteractionKind;
    isModal?: boolean;
    position?: Position;
    sliderValue?: number;
    tetherConstraints?: ITetherConstraint[];
    useSmartArrowPositioning?: boolean;
}
export declare class PopoverExample extends BaseExample<IPopoverExampleState> {
    state: IPopoverExampleState;
    protected className: string;
    private handleConstraintChange;
    private handleExampleIndexChange;
    private handleInteractionChange;
    private handlePositionChange;
    private toggleArrows;
    private toggleEscapeKey;
    private toggleInheritDarkTheme;
    private toggleInline;
    private toggleModal;
    protected renderExample(): JSX.Element;
    protected renderOptions(): JSX.Element[][];
    private getContents(index);
    private handleSliderChange;
}
