/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import { isFunction, safeInvoke } from "../../common/utils";

import { IHotkeysProps } from "./hotkeys";
import { HotkeyScope, HotkeysEvents } from "./hotkeysEvents";

export interface IHotkeysTarget extends React.Component<any, any>, React.ComponentLifecycle<any, any> {
    /**
     * Components decorated with the `HotkeysTarget` decorator must implement
     * this method, and it must return a `Hotkeys` React element.
     */
    renderHotkeys(): React.ReactElement<IHotkeysProps>;
}

export interface IConstructor<T> {
    new (...args: any[]): T;
}

export function HotkeysTarget<T extends IConstructor<IHotkeysTarget>>(WrappedComponent: T) {
    if (!isFunction(WrappedComponent.prototype.renderHotkeys)) {
        throw new Error(`@HotkeysTarget-decorated class must implement \`renderHotkeys\`. ${WrappedComponent}`);
    }

    return class HotkeysTarget extends WrappedComponent {
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
            // TODO handle HotkeysTarget being applied on a Component that doesn't return an actual Element
            const element = super.render() as React.ReactElement<any>;
            const hotkeys = this.renderHotkeys();
            this.localHotkeysEvents.setHotkeys(hotkeys.props);
            this.globalHotkeysEvents.setHotkeys(hotkeys.props);

            if (element != null && this.localHotkeysEvents.count() > 0) {
                const tabIndex = hotkeys.props.tabIndex === undefined ? 0 : hotkeys.props.tabIndex;

                const { keyDown: existingKeyDown, keyUp: existingKeyUp } = this.props;
                const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
                    this.localHotkeysEvents.handleKeyDown(e.nativeEvent as KeyboardEvent);
                    safeInvoke(existingKeyDown, e);
                };

                const onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
                    this.localHotkeysEvents.handleKeyUp(e.nativeEvent as KeyboardEvent);
                    safeInvoke(existingKeyUp, e);
                };
                return React.cloneElement(element, { tabIndex, onKeyDown, onKeyUp });
            } else {
                return element;
            }
        }
    };
}
