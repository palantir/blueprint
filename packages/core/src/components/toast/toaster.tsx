/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { polyfill } from "react-lifecycles-compat";

import { AbstractPureComponent2, Classes, Position } from "../../common";
import { TOASTER_CREATE_NULL, TOASTER_MAX_TOASTS_INVALID, TOASTER_WARN_INLINE } from "../../common/errors";
import { ESCAPE } from "../../common/keys";
import { DISPLAYNAME_PREFIX, Props } from "../../common/props";
import { isNodeEnv } from "../../common/utils";
import { Overlay } from "../overlay/overlay";
import { IToastProps, Toast } from "./toast";

export type IToastOptions = IToastProps & { key: string };
export type ToasterPosition =
    | typeof Position.TOP
    | typeof Position.TOP_LEFT
    | typeof Position.TOP_RIGHT
    | typeof Position.BOTTOM
    | typeof Position.BOTTOM_LEFT
    | typeof Position.BOTTOM_RIGHT;

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
export interface IToasterProps extends Props {
    /**
     * Whether a toast should acquire application focus when it first opens.
     * This is disabled by default so that toasts do not interrupt the user's flow.
     * Note that `enforceFocus` is always disabled for `Toaster`s.
     *
     * @default false
     */
    autoFocus?: boolean;

    /**
     * Whether pressing the `esc` key should clear all active toasts.
     *
     * @default true
     */
    canEscapeKeyClear?: boolean;

    /**
     * Whether the toaster should be rendered into a new element attached to `document.body`.
     * If `false`, then positioning will be relative to the parent element.
     *
     * This prop is ignored by `Toaster.create()` as that method always appends a new element
     * to the container.
     *
     * @default true
     */
    usePortal?: boolean;

    /**
     * Position of `Toaster` within its container.
     *
     * @default Position.TOP
     */
    position?: ToasterPosition;

    /**
     * The maximum number of active toasts that can be displayed at once.
     *
     * When the limit is about to be exceeded, the oldest active toast is removed.
     *
     * @default undefined
     */
    maxToasts?: number;
}

export interface IToasterState {
    toasts: IToastOptions[];
}

@polyfill
export class Toaster extends AbstractPureComponent2<IToasterProps, IToasterState> implements IToaster {
    public static displayName = `${DISPLAYNAME_PREFIX}.Toaster`;

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
        const toaster = ReactDOM.render<IToasterProps>(
            <Toaster {...props} usePortal={false} />,
            containerElement,
        ) as Toaster;
        if (toaster == null) {
            throw new Error(TOASTER_CREATE_NULL);
        }
        return toaster;
    }

    public state: IToasterState = {
        toasts: [],
    };

    // auto-incrementing identifier for un-keyed toasts
    private toastId = 0;

    public show(props: IToastProps, key?: string) {
        if (this.props.maxToasts) {
            // check if active number of toasts are at the maxToasts limit
            this.dismissIfAtLimit();
        }
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
                    t.onDismiss?.(timeoutExpired);
                }
                return !matchesKey;
            }),
        }));
    }

    public clear() {
        this.state.toasts.forEach(t => t.onDismiss?.(false));
        this.setState({ toasts: [] });
    }

    public getToasts() {
        return this.state.toasts;
    }

    public render() {
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
                // $pt-transition-duration * 3 + $pt-transition-duration / 2
                transitionDuration={350}
                transitionName={Classes.TOAST}
                usePortal={this.props.usePortal}
            >
                {this.state.toasts.map(this.renderToast, this)}
                {this.props.children}
            </Overlay>
        );
    }

    protected validateProps({ maxToasts }: IToasterProps) {
        // maximum number of toasts should not be a number less than 1
        if (maxToasts !== undefined && maxToasts < 1) {
            throw new Error(TOASTER_MAX_TOASTS_INVALID);
        }
    }

    private isNewToastKey(key: string) {
        return this.state.toasts.every(toast => toast.key !== key);
    }

    private dismissIfAtLimit() {
        if (this.state.toasts.length === this.props.maxToasts) {
            // dismiss the oldest toast to stay within the maxToasts limit
            this.dismiss(this.state.toasts[this.state.toasts.length - 1].key!);
        }
    }

    private renderToast = (toast: IToastOptions) => {
        return <Toast {...toast} onDismiss={this.getDismissHandler(toast)} />;
    };

    private createToastOptions(props: IToastProps, key = `toast-${this.toastId++}`) {
        // clone the object before adding the key prop to avoid leaking the mutation
        return { ...props, key };
    }

    private getPositionClasses() {
        const positions = this.props.position!.split("-");
        // NOTE that there is no -center class because that's the default style
        return [
            ...positions.map(p => `${Classes.TOAST_CONTAINER}-${p.toLowerCase()}`),
            `${Classes.TOAST_CONTAINER}-${this.props.usePortal ? "in-portal" : "inline"}`,
        ];
    }

    private getDismissHandler = (toast: IToastOptions) => (timeoutExpired: boolean) => {
        this.dismiss(toast.key, timeoutExpired);
    };

    private handleClose = (e: React.SyntheticEvent<HTMLElement>) => {
        // NOTE that `e` isn't always a KeyboardEvent but that's the only type we care about
        // HACKHACK: https://github.com/palantir/blueprint/issues/4165
        /* eslint-disable-next-line deprecation/deprecation */
        if ((e as React.KeyboardEvent<HTMLElement>).which === ESCAPE) {
            this.clear();
        }
    };
}

export const OverlayToaster = Toaster;
export type OverlayToasterProps = IToasterProps;
