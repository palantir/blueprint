import * as React from "react";

import * as Keys from "../../common/keys";
import { IActionProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";

export interface IButtonProps extends IActionProps {
    /** A ref handler that receives the native HTML element backing this component. */
    elementRef?: (ref: HTMLElement) => any;

    /** Name of icon (the part after `pt-icon-`) to add to button. */
    rightIconName?: string;

    /**
     * If set to true, the button will display a centered loading spinner instead of its contents.
     * The width of the button is not affected by the value of this prop.
     * @default false
     */
    loading?: boolean;
}

export interface IButtonState {
    isActive: boolean;
}

export abstract class AbstractButton<T> extends React.Component<React.HTMLProps<T> & IButtonProps, IButtonState> {
    public state = {
        isActive: false,
    };

    protected buttonRef: HTMLElement;
    protected refHandlers = {
        button: (ref: HTMLElement) => {
            this.buttonRef = ref;
            safeInvoke(this.props.elementRef, ref);
        },
    };

    public abstract render(): JSX.Element;

    protected onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        switch (e.which) {
            case Keys.SPACE:
                e.preventDefault();
                this.setState({ isActive: true });
                break;
            case Keys.ENTER:
                this.buttonRef.click();
                break;
            default:
                break;
        }
    }

    protected onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.which === Keys.SPACE) {
            this.setState({ isActive: false });
            this.buttonRef.click();
        }
    }
}
