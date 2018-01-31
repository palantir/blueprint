/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { IConstructor } from "../../common/constructor";
import { HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT, HOTKEYS_WARN_DECORATOR_NO_METHOD } from "../../common/errors";
import { getDisplayName, isFunction, safeInvoke } from "../../common/utils";
import { IHotkeysProps } from "./hotkeys";
import { HotkeyScope, HotkeysEvents } from "./hotkeysEvents";

export interface IHotkeysTarget {
    /** Components decorated with the `@HotkeysTarget` decorator must implement React's component `render` function. */
    render(): React.ReactElement<any> | null | undefined;

    /**
     * Components decorated with the `@HotkeysTarget` decorator must implement
     * this method, and it must return a `Hotkeys` React element.
     */
    renderHotkeys(): React.ReactElement<IHotkeysProps>;
}

export type IHotkeysComponent = IHotkeysTarget & React.Component<any, any> & React.ComponentLifecycle<any, any>;

export function HotkeysTarget<T extends IConstructor<IHotkeysComponent>>(WrappedComponent: T) {
    if (!isFunction(WrappedComponent.prototype.renderHotkeys)) {
        console.warn(HOTKEYS_WARN_DECORATOR_NO_METHOD);
    }

    return class HotkeysTargetClass extends WrappedComponent {
        public static displayName = `HotkeysTarget(${getDisplayName(WrappedComponent)})`;

        /** @internal */
        public globalHotkeysEvents?: HotkeysEvents;

        /** @internal */
        public localHotkeysEvents?: HotkeysEvents;

        public componentWillMount() {
            if (super.componentWillMount != null) {
                super.componentWillMount();
            }
            this.localHotkeysEvents = new HotkeysEvents(HotkeyScope.LOCAL);
            this.globalHotkeysEvents = new HotkeysEvents(HotkeyScope.GLOBAL);
        }

        public componentDidMount() {
            if (super.componentDidMount != null) {
                super.componentDidMount();
            }

            // attach global key event listeners
            document.addEventListener("keydown", this.globalHotkeysEvents.handleKeyDown);
            document.addEventListener("keyup", this.globalHotkeysEvents.handleKeyUp);
        }

        public componentWillUnmount() {
            if (super.componentWillUnmount != null) {
                super.componentWillUnmount();
            }
            document.removeEventListener("keydown", this.globalHotkeysEvents.handleKeyDown);
            document.removeEventListener("keyup", this.globalHotkeysEvents.handleKeyUp);

            this.globalHotkeysEvents.clear();
            this.localHotkeysEvents.clear();
        }

        public render() {
            const element = super.render() as JSX.Element;

            if (element == null) {
                // always return `element` in case caller is distinguishing between `null` and `undefined`
                return element;
            }

            if (!React.isValidElement<any>(element)) {
                console.warn(HOTKEYS_WARN_DECORATOR_NEEDS_REACT_ELEMENT);
                return element;
            }

            if (isFunction(this.renderHotkeys)) {
                const hotkeys = this.renderHotkeys();
                this.localHotkeysEvents.setHotkeys(hotkeys.props);
                this.globalHotkeysEvents.setHotkeys(hotkeys.props);

                if (this.localHotkeysEvents.count() > 0) {
                    const tabIndex = hotkeys.props.tabIndex === undefined ? 0 : hotkeys.props.tabIndex;

                    const { keyDown: existingKeyDown, keyUp: existingKeyUp } = element.props;
                    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
                        this.localHotkeysEvents.handleKeyDown(e.nativeEvent as KeyboardEvent);
                        safeInvoke(existingKeyDown, e);
                    };

                    const onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
                        this.localHotkeysEvents.handleKeyUp(e.nativeEvent as KeyboardEvent);
                        safeInvoke(existingKeyUp, e);
                    };
                    return React.cloneElement(element, { tabIndex, onKeyDown, onKeyUp });
                }
            }
            return element;
        }
    };
}
