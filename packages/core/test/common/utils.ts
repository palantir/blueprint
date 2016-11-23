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
export function dispatchMouseEvent(target: EventTarget, eventType = "click", clientX = 0, clientY = 0) {
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
    target.dispatchEvent(event);
};
