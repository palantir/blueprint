/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractComponent } from "../../common/abstractComponent";
import * as Classes from "../../common/classes";
import { ESCAPE } from "../../common/keys";
import { Position } from "../../common/position";
import { IProps } from "../../common/props";
import { safeInvoke, shallowClone } from "../../common/utils";
import { Overlay } from "../overlay/overlay";
import { IToastProps, Toast } from "./toast";

export type IToastOptions = IToastProps & {key?: string};

export interface IToaster {
    /** Show a new toast to the user. Returns the unique key of the new toast. */
    show(props: IToastProps): string;

    /**
     * Updates the toast with the given key to use the new props.
     * Updating a key that does not exist is effectively a no-op.
     */
    update(key: string, props: IToastProps): void;

    /** Dismiss the given toast instantly. */
    dismiss(key: string): void;

    /** Dismiss all toasts instantly. */
    clear(): void;

    /** Returns the props for all current toasts. */
    getToasts(): IToastOptions[];
}

export interface IToasterProps extends IProps {
    /**
     * Whether a toast should acquire application focus when it first opens.
     * This is disabled by default so that toasts do not interrupt the user's flow.
     * Note that `enforceFocus` is always disabled for `Toaster`s.
     * @default false
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should clear all active toasts.
     * @default true
     */
    canEscapeKeyClear?: boolean;

    /**
     * Whether the toaster should be rendered inline or into a new element on `document.body`.
     * If `true`, then positioning will be relative to the parent element.
     * @default false
     */
    inline?: boolean;

    /**
     * Position of `Toaster` within its container. Note that `LEFT` and `RIGHT` are disallowed
     * because Toaster only supports the top and bottom edges.
     * @default Position.TOP
     */
    position?: Position;
}

export interface IToasterState {
    toasts: IToastOptions[];
}

@PureRender
export class Toaster extends AbstractComponent<IToasterProps, IToasterState> implements IToaster {
    public static defaultProps: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        inline: false,
        position: Position.TOP,
    };

    /**
     * Create a new `Toaster` instance that can be shared around your application.
     * The `Toaster` will be rendered into a new element appended to the given container.
     */
    public static create(props?: IToasterProps, container = document.body): IToaster {
        const containerElement = document.createElement("div");
        container.appendChild(containerElement);
        return ReactDOM.render(<Toaster {...props} inline /> , containerElement) as Toaster;
    }

    public state = {
        toasts: [] as IToastOptions[],
    };

    // auto-incrementing identifier for un-keyed toasts
    private toastId = 0;

    public show(props: IToastProps) {
        const options = this.createToastOptions(props);
        this.setState((prevState) => ({
            toasts: [options, ...prevState.toasts],
        }));
        return options.key;
    }

    public update(key: string, props: IToastProps) {
        const options = this.createToastOptions(props, key);
        this.setState((prevState) => ({
            toasts: prevState.toasts.map((t) => t.key === key ? options : t),
        }));
    }

    public dismiss(key: string, timeoutExpired = false) {
        this.setState(({ toasts }) => ({
            toasts: toasts.filter((t) => {
                const matchesKey = t.key === key;
                if (matchesKey) {
                    safeInvoke(t.onDismiss, timeoutExpired);
                }
                return !matchesKey;
            }),
        }));
    }

    public clear() {
        this.state.toasts.map((t) => safeInvoke(t.onDismiss, false));
        this.setState({ toasts: [] });
    }

    public getToasts() {
        return this.state.toasts;
    }

    public render() {
        // $pt-transition-duration * 3 + $pt-transition-duration / 2
        const classes = classNames(Classes.TOAST_CONTAINER, this.getPositionClasses(), this.props.className);
        return (
            <Overlay
                autoFocus={this.props.autoFocus}
                canEscapeKeyClose={this.props.canEscapeKeyClear}
                canOutsideClickClose={false}
                className={classes}
                enforceFocus={false}
                hasBackdrop={false}
                inline={this.props.inline}
                isOpen={this.state.toasts.length > 0}
                onClose={this.handleClose}
                transitionDuration={350}
                transitionName="pt-toast"
            >
                {this.state.toasts.map(this.renderToast, this)}
            </Overlay>
        );
    }

    protected validateProps(props: IToasterProps) {
        if (props.position === Position.LEFT || props.position === Position.RIGHT) {
            throw new Error("Toaster does not support LEFT or RIGHT positions.");
        }
    }

    private renderToast(toast: IToastOptions) {
        return <Toast {...toast} onDismiss={this.getDismissHandler(toast)} />;
    }

    private createToastOptions(props: IToastProps, key = `toast-${this.toastId++}`) {
        // clone the object before adding the key prop to avoid leaking the mutation
        const options = shallowClone<IToastOptions>(props);
        options.key = key;
        return options;
    }

    private getPositionClasses() {
        const positions = Position[this.props.position].split("_");
        // NOTE that there is no -center class because that's the default style
        return positions.map((p) => `${Classes.TOAST_CONTAINER}-${p.toLowerCase()}`);
    }

    private getDismissHandler = (toast: IToastOptions) => (timeoutExpired: boolean) => {
        this.dismiss(toast.key, timeoutExpired);
    }

    private handleClose = (e: React.KeyboardEvent<HTMLElement>) => {
        // NOTE that `e` isn't always a KeyboardEvent but that's the only type we care about
        if (e.which === ESCAPE) {
            this.clear();
        }
    }
}
