/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

/**
 * Measure width of a string displayed with styles provided by `className`.
 * Should only be used if measuring can't be done with existing DOM elements.
 */
export function measureTextWidth(text: string, className = "", containerElement = document.body) {
    const span = document.createElement("span");
    span.classList.add(className);
    span.innerHTML = text;

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
