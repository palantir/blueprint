/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/**
 * Measure width of a string displayed with styles provided by `className`.
 * Should only be used if measuring can't be done with existing DOM elements.
 */
export function measureTextWidth(text: string, className = "", containerElement = document.body) {
    const span = document.createElement("span");
    span.classList.add(className);
    span.textContent = text;

    containerElement.appendChild(span);
    const spanWidth = span.offsetWidth;
    span.remove();

    return spanWidth + "px";
}

export function padWithZeroes(str: string, minLength: number) {
    if (str.length < minLength) {
        return `${stringRepeat("0", minLength - str.length)}${str}`;
    } else {
        return str;
    }
}

function stringRepeat(str: string, numTimes: number) {
    return new Array(numTimes + 1).join(str);
}
