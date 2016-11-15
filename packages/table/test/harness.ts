/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import * as ReactDOM from "react-dom";

export type MouseEventType = "click" | "mousedown" | "mouseup" | "mousemove" | "mouseenter" | "mouseleave" ;
export type KeyboardEventType = "keypress" | "keydown" |  "keyup" ;

// TODO: Share with blueprint-components #27

export class ElementHarness {
    public static document() {
        return new ElementHarness(document.documentElement);
    }

    public element: Element;

    constructor(element: Element) {
        this.element = element;
    }

    public find(query: string, nth?: number) {
        return new ElementHarness(this.findElement(query, nth));
    }

    public bounds() {
        return this.element.getBoundingClientRect();
    }

    public text() {
        return this.element.textContent;
    }

    public style() {
        return (this.element as HTMLElement).style;
    }

    public focus() {
        (this.element as HTMLElement).focus();
        return this;
    }

    public blur() {
        (this.element as HTMLElement).blur();
        return this;
    }

    public mouse(eventType: MouseEventType = "click", offsetX = 0, offsetY = 0, isMetaKeyDown = false) {
        const bounds = this.bounds();
        const x = bounds.left + bounds.width / 2 + offsetX;
        const y = bounds.top + bounds.height / 2 + offsetY;
        const event = document.createEvent("MouseEvent");

        // The crazy long list of arguments below are defined in this ancient Web API:
        // event.initMouseEvent(
        //     type, canBubble, cancelable, view,
        //     detail, screenX, screenY, clientX, clientY,
        //     ctrlKey, altKey, shiftKey, metaKey,
        //     button, relatedTarget
        // );
        event.initMouseEvent(
            eventType, true, true, window,
            null, 0, 0, x, y,
            isMetaKeyDown, false, false, isMetaKeyDown,
            0, null
        );
        this.element.dispatchEvent(event);
        return this;
    }

    public change(value?: string) {
        if (value != null) {
            (this.element as HTMLInputElement).value = value;
        }

        // Apparently onChange listeners are listening for "input" events.
        const event = document.createEvent("HTMLEvents");
        event.initEvent("input", true, true);
        this.element.dispatchEvent(event);
        return this;
    }

    private findElement(query: string, nth?: number) {
        if (nth != null) {
            return this.element.querySelectorAll(query)[nth];
        } else {
            return this.element.querySelector(query);
        }
    }
}

export class ReactHarness {
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
        document.documentElement.appendChild(this.container);
    };

    public mount(component: React.ReactElement<any>) {
        ReactDOM.render(component, this.container);
        return new ElementHarness(this.container);
    }

    public unmount() {
        ReactDOM.unmountComponentAtNode(this.container);
    }

    public destroy() {
        document.documentElement.removeChild(this.container);
        delete this.container;
    }
}
