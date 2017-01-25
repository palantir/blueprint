import * as classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import * as Keys from "../../common/keys";
import { IActionProps } from "../../common/props";
import { safeInvoke } from "../../common/utils";
import { Spinner } from "../spinner/spinner";

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

    private currentKeyDown: number = null;

    public abstract render(): JSX.Element;

    protected renderChildren(): React.ReactNode {
        const { children, loading, rightIconName, text } = this.props;
        const iconClasses = classNames(Classes.ICON_STANDARD, Classes.iconClass(rightIconName), Classes.ALIGN_RIGHT);
        return [
            loading ? <Spinner className="pt-small pt-button-spinner" key="spinner" /> : undefined,
            text != null ? <span key="text">{text}</span> : undefined,
            children,
            rightIconName != null ? <span className={iconClasses} key="icon" /> : undefined,
        ];
    }

    protected onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        switch (e.which) {
            case Keys.SPACE:
            case Keys.ENTER:
                e.preventDefault();
                if (e.which !== this.currentKeyDown) {
                    this.setState({ isActive: true });
                }
                break;
            default:
                break;
        }
        this.currentKeyDown = e.which;
    }

    protected onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
        switch (e.which) {
            case Keys.SPACE:
            case Keys.ENTER:
                this.setState({ isActive: false });
                this.buttonRef.click();
                break;
            default:
                break;
        }
        this.currentKeyDown = null;
    }
}
