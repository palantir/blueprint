/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

// tslint:disable max-classes-per-file

import * as React from "react";
import * as ReactDOM from "react-dom";

export type MouseEventType = "click" | "mousedown" | "mouseup" | "mousemove" | "mouseenter" | "mouseleave" ;
export type KeyboardEventType = "keypress" | "keydown" |  "keyup" ;

function dispatchTestKeyboardEvent(target: EventTarget, eventType: string, key: string, metaKey = false) {
    const event = document.createEvent("KeyboardEvent");
    const keyCode = key.charCodeAt(0);

    (event as any).initKeyboardEvent(eventType, true, true, window, key, 0, false, false, false, metaKey);

    // Hack around these readonly properties in WebKit and Chrome
    if (detectBrowser() === Browser.WEBKIT) {
        (event as any).key = key;
        (event as any).which = keyCode;
    } else {
        Object.defineProperty(event, "key", { get: () => key });
        Object.defineProperty(event, "which", { get: () => keyCode });
    }

    target.dispatchEvent(event);
}

/**
 * Enum of possible browsers
 */
enum Browser {
    CHROME,
    EDGE,
    FIREFOX,
    IE,
    UNKNOWN,
    WEBKIT,
}

/**
 * Use feature detection to determine current browser.
 * http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
 */
function detectBrowser() {
    // Firefox 1.0+
    if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
        return Browser.FIREFOX;
    }

    // Safari <= 9 "[object HTMLElementConstructor]"
    if (Object.prototype.toString.call((window as any).HTMLElement).indexOf("Constructor") > 0) {
        return Browser.WEBKIT;
    }

    // Internet Explorer 6-11
    if (/*@cc_on!@*/false || !!(document as any).documentMode) {
        return Browser.IE;
    }

    // Edge 20+
    if (!!(window as any).StyleMedia) {
        return Browser.EDGE;
    }

    // Chrome 1+
    if (!!(window as any).chrome && !!(window as any).chrome.webstore) {
        return Browser.CHROME;
    }

    return Browser.UNKNOWN;
}


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

        // The crazy long list of arguments below are defined in this ancient web API:
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
            0, null,
        );
        this.element.dispatchEvent(event);
        return this;
    }

    public keyboard(eventType: KeyboardEventType = "keypress", key = "", metaKey = false) {

        dispatchTestKeyboardEvent(this.element, eventType, key, metaKey);
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
