/*
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

import { AbstractPureComponent, Classes, Position } from "../../common";
import {
    TOASTER_CREATE_ASYNC_NULL,
    TOASTER_CREATE_NULL,
    TOASTER_MAX_TOASTS_INVALID,
    TOASTER_WARN_INLINE,
} from "../../common/errors";
import { DISPLAYNAME_PREFIX } from "../../common/props";
import { isElementOfType, isNodeEnv } from "../../common/utils";
import type { DOMMountOptions } from "../../common/utils/mountOptions";
import { Overlay2 } from "../overlay2/overlay2";

import type { OverlayToasterProps } from "./overlayToasterProps";
import { Toast } from "./toast";
import { Toast2 } from "./toast2";
import type { Toaster, ToastOptions } from "./toaster";
import type { ToastProps } from "./toastProps";

export interface OverlayToasterState {
    toasts: ToastOptions[];
    toastRefs: Record<string, React.RefObject<HTMLElement>>;
}

export type OverlayToasterCreateOptions = DOMMountOptions<OverlayToasterProps>;

interface OverlayToasterQueueState {
    cancel: (() => void) | undefined;
    isRunning: boolean;
    toasts: ToastOptions[];
}

export const OVERLAY_TOASTER_DELAY_MS = 50;

/**
 * OverlayToaster component.
 *
 * @see https://blueprintjs.com/docs/#core/components/toast
 */
export class OverlayToaster extends AbstractPureComponent<OverlayToasterProps, OverlayToasterState> implements Toaster {
    public static displayName = `${DISPLAYNAME_PREFIX}.OverlayToaster`;

    public static defaultProps: OverlayToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
        usePortal: true,
    };

    /**
     * Create a new `Toaster` instance that can be shared around your application.
     * The `Toaster` will be rendered into a new element appended to the given container.
     */
    public static create(props?: OverlayToasterProps, container = document.body): Toaster {
        if (props != null && props.usePortal != null && !isNodeEnv("production")) {
            console.warn(TOASTER_WARN_INLINE);
        }
        const containerElement = document.createElement("div");
        container.appendChild(containerElement);
        // TODO(React 18): Replace deprecated ReactDOM methods. See: https://github.com/palantir/blueprint/issues/7166
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const toaster = ReactDOM.render<OverlayToasterProps>(
            <OverlayToaster {...props} usePortal={false} />,
            containerElement,
        ) as OverlayToaster;
        if (toaster == null) {
            throw new Error(TOASTER_CREATE_NULL);
        }
        return toaster;
    }

    /**
     * Similar to {@link OverlayToaster.create}, but returns a Promise to a
     * Toaster instance after it's rendered and mounted to the DOM.
     *
     * This API will replace the synchronous {@link OverlayToaster.create} in a
     * future major version of Blueprint to reflect React 18+'s new asynchronous
     * rendering API.
     */
    public static createAsync(props?: OverlayToasterProps, options?: OverlayToasterCreateOptions): Promise<Toaster> {
        if (props != null && props.usePortal != null && !isNodeEnv("production")) {
            console.warn(TOASTER_WARN_INLINE);
        }

        const container = options?.container ?? document.body;
        // TODO(React 18): Replace deprecated ReactDOM methods. See: https://github.com/palantir/blueprint/issues/7166
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        const domRenderer = options?.domRenderer ?? ReactDOM.render;

        const toasterComponentRoot = document.createElement("div");
        container.appendChild(toasterComponentRoot);

        return new Promise<Toaster>((resolve, reject) => {
            try {
                // TODO(React 18): Replace deprecated ReactDOM methods. See: https://github.com/palantir/blueprint/issues/7166
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                domRenderer(<OverlayToaster {...props} ref={handleRef} usePortal={false} />, toasterComponentRoot);
            } catch (error) {
                // Note that we're catching errors from the domRenderer function
                // call, but not errors when rendering <OverlayToaster>, which
                // happens in a separate scheduled tick. Wrapping the
                // OverlayToaster in an error boundary would be necessary to
                // capture rendering errors, but that's still a bit unreliable
                // and would only catch errors rendering the initial mount.
                reject(error);
            }

            // We can get a rough guarantee that the OverlayToaster has been
            // mounted to the DOM by waiting until the ref callback here has
            // been fired.
            //
            // This is the approach suggested under "What about the render
            // callback?" at https://github.com/reactwg/react-18/discussions/5.
            function handleRef(ref: OverlayToaster | null) {
                if (ref == null) {
                    reject(new Error(TOASTER_CREATE_ASYNC_NULL));
                    return;
                }

                resolve(ref);
            }
        });
    }

    public state: OverlayToasterState = {
        toastRefs: {},
        toasts: [],
    };

    // Queue of toasts to be displayed. If toasts are shown too quickly back to back, it can result in cut off toasts.
    // The queue ensures that toasts are only displayed in QUEUE_TIMEOUT_MS increments.
    private queue: OverlayToasterQueueState = {
        cancel: undefined,
        isRunning: false,
        toasts: [],
    };

    // auto-incrementing identifier for un-keyed toasts
    private toastId = 0;

    private toastRefs: Record<string, React.RefObject<HTMLElement>> = {};

    /** Compute a new collection of toast refs (usually after updating toasts) */
    private getToastRefs = (toasts: ToastOptions[]) => {
        return toasts.reduce<typeof this.toastRefs>((refs, toast) => {
            refs[toast.key!] = React.createRef<HTMLElement>();
            return refs;
        }, {});
    };

    public show(props: ToastProps, key?: string) {
        const options = this.createToastOptions(props, key);
        const wasExistingToastUpdated = this.maybeUpdateExistingToast(options, key);
        if (wasExistingToastUpdated) {
            return options.key;
        }

        if (this.queue.isRunning) {
            // If a toast has been shown recently, push to the queued toasts to prevent toasts from being shown too
            // quickly for the animations to keep up
            this.queue.toasts.push(options);
        } else {
            // If we have not recently shown a toast, we can immediately show the given toast
            this.immediatelyShowToast(options);
            this.startQueueTimeout();
        }

        return options.key;
    }

    private maybeUpdateExistingToast(options: ToastOptions, key: string | undefined) {
        if (key == null) {
            return false;
        }

        const isExistingQueuedToast = this.queue.toasts.some(toast => toast.key === key);
        if (isExistingQueuedToast) {
            this.queue.toasts = this.queue.toasts.map(t => (t.key === key ? options : t));
            return true;
        }

        const isExistingShownToast = this.state.toasts.some(toast => toast.key === key);
        if (isExistingShownToast) {
            this.updateToastsInState(toasts => toasts.map(t => (t.key === key ? options : t)));
            return true;
        }

        return false;
    }

    private immediatelyShowToast(options: ToastOptions) {
        if (this.props.maxToasts) {
            // check if active number of toasts are at the maxToasts limit
            this.dismissIfAtLimit();
        }

        this.updateToastsInState(toasts => [options, ...toasts]);
    }

    private startQueueTimeout() {
        this.queue.isRunning = true;
        this.queue.cancel = this.setTimeout(this.handleQueueTimeout, OVERLAY_TOASTER_DELAY_MS);
    }

    private handleQueueTimeout = () => {
        const nextToast = this.queue.toasts.shift();
        if (nextToast != null) {
            this.immediatelyShowToast(nextToast);
            this.startQueueTimeout();
        } else {
            this.queue.isRunning = false;
        }
    };

    private updateToastsInState(getNewToasts: (toasts: ToastOptions[]) => ToastOptions[]) {
        this.setState(prevState => {
            const toasts = getNewToasts(prevState.toasts);
            return { toastRefs: this.getToastRefs(toasts), toasts };
        });
    }

    public dismiss(key: string, timeoutExpired = false) {
        this.setState(prevState => {
            const toasts = prevState.toasts.filter(t => {
                const matchesKey = t.key === key;
                if (matchesKey) {
                    t.onDismiss?.(timeoutExpired);
                }
                return !matchesKey;
            });
            return { toastRefs: this.getToastRefs(toasts), toasts };
        });
    }

    public clear() {
        this.queue.cancel?.();
        this.queue = { cancel: undefined, isRunning: false, toasts: [] };
        this.state.toasts.forEach(t => t.onDismiss?.(false));
        this.setState({ toastRefs: {}, toasts: [] });
    }

    public getToasts() {
        return this.state.toasts;
    }

    public render() {
        const classes = classNames(Classes.TOAST_CONTAINER, this.getPositionClasses(), this.props.className);
        return (
            <Overlay2
                autoFocus={this.props.autoFocus}
                canEscapeKeyClose={this.props.canEscapeKeyClear}
                canOutsideClickClose={false}
                className={classes}
                childRefs={this.toastRefs}
                enforceFocus={false}
                hasBackdrop={false}
                isOpen={this.state.toasts.length > 0 || this.props.children != null}
                onClose={this.handleClose}
                shouldReturnFocusOnClose={false}
                // $pt-transition-duration * 3 + $pt-transition-duration / 2
                transitionDuration={350}
                transitionName={Classes.TOAST}
                usePortal={this.props.usePortal}
            >
                {this.state.toasts.map(this.renderToast, this)}
                {this.renderChildren()}
            </Overlay2>
        );
    }

    protected validateProps({ maxToasts }: OverlayToasterProps) {
        // maximum number of toasts should not be a number less than 1
        if (maxToasts !== undefined && maxToasts < 1) {
            throw new Error(TOASTER_MAX_TOASTS_INVALID);
        }
    }

    /**
     * If provided `Toast` children, automaticaly upgrade them to `Toast2` elements so that `Overlay2` can inject
     * refs into them for use by `CSSTransition`. This is a bit hacky but ensures backwards compatibility for
     * `OverlayToaster`. It should be an uncommon code path in most applications, since we expect most usage to
     * occur via the imperative toaster APIs.
     *
     * We can remove this indirection once `Toast2` fully replaces `Toast` in a future major version.
     *
     * TODO(@adidahiya): Blueprint v6.0
     */
    private renderChildren() {
        return React.Children.map(this.props.children, child => {
            // TODO(React 18): Replace deprecated ReactDOM methods. See: https://github.com/palantir/blueprint/issues/7166
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            if (isElementOfType(child, Toast)) {
                return <Toast2 {...child.props} />;
            } else {
                return child;
            }
        });
    }

    private dismissIfAtLimit() {
        if (this.state.toasts.length === this.props.maxToasts) {
            // dismiss the oldest toast to stay within the maxToasts limit
            this.dismiss(this.state.toasts[this.state.toasts.length - 1].key!);
        }
    }

    private renderToast = (toast: ToastOptions) => {
        return <Toast2 {...toast} onDismiss={this.getDismissHandler(toast)} />;
    };

    private createToastOptions(props: ToastProps, key = `toast-${this.toastId++}`) {
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

    private getDismissHandler = (toast: ToastOptions) => (timeoutExpired: boolean) => {
        this.dismiss(toast.key, timeoutExpired);
    };

    private handleClose = (e: React.SyntheticEvent<HTMLElement>) => {
        // NOTE that `e` isn't always a KeyboardEvent but that's the only type we care about
        if ((e as React.KeyboardEvent<HTMLElement>).key === "Escape") {
            this.clear();
        }
    };
}
