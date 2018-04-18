/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import { TOASTER_WARN_INLINE } from "../../common/errors";
import { ESCAPE } from "../../common/keys";
import { Position } from "../../common/position";
import { IProps } from "../../common/props";
import { isNodeEnv, safeInvoke } from "../../common/utils";
import { Overlay } from "../overlay/overlay";
import { IToastProps, Toast } from "./toast";

export type IToastOptions = IToastProps & { key?: string };
export type ToasterPosition =
    | Position.TOP
    | Position.TOP_LEFT
    | Position.TOP_RIGHT
    | Position.BOTTOM
    | Position.BOTTOM_LEFT
    | Position.BOTTOM_RIGHT;

/** Instance methods available on a `<Toaster>` component instance. */
export interface IToaster {
    /**
     * Shows a new toast to the user, or updates an existing toast corresponding to the provided key (optional).
     *
     * Returns the unique key of the toast.
     */
    show(props: IToastProps, key?: string): string;

    /** Dismiss the given toast instantly. */
    dismiss(key: string): void;

    /** Dismiss all toasts instantly. */
    clear(): void;

    /** Returns the props for all current toasts. */
    getToasts(): IToastOptions[];
}

/**
 * Props supported by the `<Toaster>` component.
 * These props can be passed as an argument to the static `Toaster.create(props?, container?)` method.
 */
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
     * Whether the toaster should be rendered into a new element attached to `document.body`.
     * If `false`, then positioning will be relative to the parent element.
     *
     * This prop is ignored by `Toaster.create()` as that method always appends a new element
     * to the container.
     * @default true
     */
    usePortal?: boolean;

    /**
     * Position of `Toaster` within its container.
     *
     * Note that only `TOP` and `BOTTOM` are supported because Toaster only
     * supports the top and bottom edge positioning.
     * @default Position.TOP
     */
    position?: ToasterPosition;
}

export interface IToasterState {
    toasts: IToastOptions[];
}

export class Toaster extends AbstractPureComponent<IToasterProps, IToasterState> implements IToaster {
    public static defaultProps: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
        usePortal: true,
    };

    /**
     * Create a new `Toaster` instance that can be shared around your application.
     * The `Toaster` will be rendered into a new element appended to the given container.
     */
    public static create(props?: IToasterProps, container = document.body): IToaster {
        if (props != null && props.usePortal != null && !isNodeEnv("production")) {
            console.warn(TOASTER_WARN_INLINE);
        }
        const containerElement = document.createElement("div");
        container.appendChild(containerElement);
        return ReactDOM.render(<Toaster {...props} usePortal={false} />, containerElement) as Toaster;
    }

    public state = {
        toasts: [] as IToastOptions[],
    };

    // auto-incrementing identifier for un-keyed toasts
    private toastId = 0;

    public show(props: IToastProps, key?: string) {
        const options = this.createToastOptions(props, key);
        if (key === undefined || this.isNewToastKey(key)) {
            this.setState(prevState => ({
                toasts: [options, ...prevState.toasts],
            }));
        } else {
            this.setState(prevState => ({
                toasts: prevState.toasts.map(t => (t.key === key ? options : t)),
            }));
        }
        return options.key;
    }

    public dismiss(key: string, timeoutExpired = false) {
        this.setState(({ toasts }) => ({
            toasts: toasts.filter(t => {
                const matchesKey = t.key === key;
                if (matchesKey) {
                    safeInvoke(t.onDismiss, timeoutExpired);
                }
                return !matchesKey;
            }),
        }));
    }

    public clear() {
        this.state.toasts.map(t => safeInvoke(t.onDismiss, false));
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
                isOpen={this.state.toasts.length > 0 || this.props.children != null}
                onClose={this.handleClose}
                transitionDuration={350}
                transitionName={Classes.TOAST}
                usePortal={this.props.usePortal}
            >
                {this.state.toasts.map(this.renderToast, this)}
                {this.props.children}
            </Overlay>
        );
    }

    private isNewToastKey(key: string) {
        return this.state.toasts.every(toast => toast.key !== key);
    }

    private renderToast(toast: IToastOptions) {
        return <Toast {...toast} onDismiss={this.getDismissHandler(toast)} />;
    }

    private createToastOptions(props: IToastProps, key = `toast-${this.toastId++}`) {
        // clone the object before adding the key prop to avoid leaking the mutation
        return { ...props, key };
    }

    private getPositionClasses() {
        const positions = this.props.position.split("-");
        // NOTE that there is no -center class because that's the default style
        return positions.map(p => `${Classes.TOAST_CONTAINER}-${p.toLowerCase()}`);
    }

    private getDismissHandler = (toast: IToastOptions) => (timeoutExpired: boolean) => {
        this.dismiss(toast.key, timeoutExpired);
    };

    private handleClose = (e: React.KeyboardEvent<HTMLElement>) => {
        // NOTE that `e` isn't always a KeyboardEvent but that's the only type we care about
        if (e.which === ESCAPE) {
            this.clear();
        }
    };
}
