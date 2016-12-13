/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";
import { isFunction, safeInvoke } from "../../common/utils";

import { IHotkeysProps } from "./hotkeys";
import { HotkeyScope, HotkeysEvents } from "./hotkeysEvents";

export interface IHotkeysTarget extends React.Component<any, any>, React.ComponentLifecycle<any, any> {
    /** @internal */
    globalHotkeysEvents?: HotkeysEvents;

    /** @internal */
    localHotkeysEvents?: HotkeysEvents;

    /**
     * Components decorated with the `HotkeysTarget` decorator must implement
     * this method, and it must return a `Hotkeys` React element.
     */
    renderHotkeys(): React.ReactElement<IHotkeysProps>;
}

export function HotkeysTarget<T extends { prototype: IHotkeysTarget }>(constructor: T) {
    const {
        componentWillMount,
        componentDidMount,
        componentWillUnmount,
        render,
        renderHotkeys,
    } = constructor.prototype;

    if (!isFunction(renderHotkeys)) {
        throw new Error(`@HotkeysTarget-decorated class must implement \`renderHotkeys\`. ${constructor}`);
    }

    // tslint:disable no-invalid-this only-arrow-functions
    constructor.prototype.componentWillMount = function() {
        this.localHotkeysEvents = new HotkeysEvents(HotkeyScope.LOCAL);
        this.globalHotkeysEvents = new HotkeysEvents(HotkeyScope.GLOBAL);

        if (componentWillMount != null) {
            componentWillMount.call(this);
        }
    };

    // tslint:disable no-invalid-this only-arrow-functions
    constructor.prototype.componentDidMount = function() {
        // attach global key event listeners
        document.addEventListener("keydown", this.globalHotkeysEvents.handleKeyDown);
        document.addEventListener("keyup", this.globalHotkeysEvents.handleKeyUp);

        if (componentDidMount != null) {
            componentDidMount.call(this);
        }
    };

    constructor.prototype.componentWillUnmount = function() {
        // detach global key event listeners
        document.removeEventListener("keydown", this.globalHotkeysEvents.handleKeyDown);
        document.removeEventListener("keyup", this.globalHotkeysEvents.handleKeyUp);

        this.globalHotkeysEvents.clear();
        this.localHotkeysEvents.clear();

        if (componentWillUnmount != null) {
            componentWillUnmount.call(this);
        }
    };

    constructor.prototype.render = function() {
        const element = render.call(this) as JSX.Element;

        const hotkeys = renderHotkeys.call(this);
        this.localHotkeysEvents.setHotkeys(hotkeys.props);
        this.globalHotkeysEvents.setHotkeys(hotkeys.props);

        // attach local key event listeners
        if (element != null && this.localHotkeysEvents.count() > 0) {
            const tabIndex = hotkeys.props.tabIndex === undefined ? 0 : hotkeys.props.tabIndex;

            const existingKeyDown = element.props.onKeyDown as React.KeyboardEventHandler<HTMLElement>;
            const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
                this.localHotkeysEvents.handleKeyDown(e.nativeEvent as KeyboardEvent);
                safeInvoke(existingKeyDown, e);
            };

            const existingKeyUp = element.props.onKeyUp as React.KeyboardEventHandler<HTMLElement>;
            const onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
                this.localHotkeysEvents.handleKeyUp(e.nativeEvent as KeyboardEvent);
                safeInvoke(existingKeyUp, e);
            };
            return React.cloneElement(element, { tabIndex, onKeyDown, onKeyUp });
        } else {
            return element;
        }
    };
    // tslint:enable
};
