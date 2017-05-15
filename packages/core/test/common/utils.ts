/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

/**
 * Dispatch a native KeyBoardEvent on the target element with the given type
 * and event arguments. `type` can be one of "keydown|keyup|keypress".
 *
 * This method is for unit testing with PhantomJS and Chrome ONLY! The hacks we
 * use aren't compatible with other browsers. Do not use this method for
 * anything other than simulating keyboard events for PhantomJS and karma
 * chrome tests.
 */
export function dispatchTestKeyboardEvent(target: EventTarget, eventType: string, key: string, shift = false) {
    const event = document.createEvent("KeyboardEvent");
    const keyCode = key.charCodeAt(0);

    (event as any).initKeyboardEvent(eventType, true, true, window, key, 0, false, false, shift);

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

export enum TestMouseButton {
    LEFT_BUTTON = 0,
    MIDDLE_BUTTON,
    RIGHT_BUTTON,
}

export interface ITestMouseEventOptions {
    type: "click" | "mousedown" | "mouseup" | "mousemove";
    canBubble?: boolean;
    cancelable?: boolean;
    view?: Window;
    detail?: number;
    screenX?: number;
    screenY?: number;
    clientX?: number;
    clientY?: number;
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
    button?: TestMouseButton;
    relatedTarget?: EventTarget;
}

/**
 * Dispatch a native KeyBoardEvent on the target element with the given type
 * and event arguments. `type` can be one of "mousedown|mouseup|mousemove|click".
 *
 * This method is for unit testing with PhantomJS and Chrome ONLY! The hacks we
 * use aren't compatible with other browsers. Do not use this method for
 * anything other than simulating keyboard events for PhantomJS and karma
 * chrome tests.
 */
export function dispatchTestMouseEvent(target: EventTarget, options: ITestMouseEventOptions) {
    const { type } = options;
    const event = document.createEvent("MouseEvent");

    let detail: number;
    if (type === "click") {
        detail = 1; // the current click count
    } else if (type === "mousedown" || type === "mouseup") {
        detail = 2; // 1 + current click count
    } else {
        detail = 0;
    }

    // these values have to be in this order so that we can pass them as params
    // into initMouseEvent in one fell swoop
    // tslint:disable:object-literal-sort-keys
    const mouseEventOptions = {
        type: undefined, // needs to be here to preseve param order
        canBubble: true,
        cancelable: true,
        view: window,
        detail,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: TestMouseButton.LEFT_BUTTON,
        relatedTarget: null,
        ...options, // override these defaults
    } as ITestMouseEventOptions;
    // tslint:enable:object-literal-sort-keys

    // Object.values is not available in Phantom
    const values = Object.keys(mouseEventOptions).map((key: keyof ITestMouseEventOptions) => mouseEventOptions[key]);

    // const values = (Object as any).values(mouseEventOptions);
    (event as any).initMouseEvent(...values);

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

// see http://stackoverflow.com/questions/16802795/click-not-working-in-mocha-phantomjs-on-certain-elements
// tl;dr PhantomJS sucks so we have to manually create click events
export function createMouseEvent(eventType = "click", clientX = 0, clientY = 0) {
    const event = document.createEvent("MouseEvent");
    event.initMouseEvent(
        eventType,
        true /* bubble */,
        true /* cancelable */,
        window,
        null,
        0, 0, clientX, clientY, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /* left */,
        null,
    );
    return event;
}

export function dispatchMouseEvent(target: EventTarget, eventType = "click", clientX = 0, clientY = 0) {
    target.dispatchEvent(createMouseEvent(eventType, clientX, clientY));
};

// PhantomJS doesn't support touch events yet https://github.com/ariya/phantomjs/issues/11571
// so we simulate it with mouse events
export function createTouchEvent(eventType = "touchstart", clientX = 0, clientY = 0) {
    const event = createMouseEvent(eventType, clientX, clientY);
    const touches = [{ clientX, clientY }];
    ["touches", "targetTouches", "changedTouches"].forEach((prop) => {
        Object.defineProperty(event, prop, { value: touches });
    });
    return event;
}

export function dispatchTouchEvent(target: EventTarget, eventType = "touchstart", clientX = 0, clientY = 0) {
    target.dispatchEvent(createTouchEvent(eventType, clientX, clientY));
}
