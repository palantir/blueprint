/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
const browser = {
    isEdge: !!userAgent.match(/Edge/),
    isInternetExplorer: !!userAgent.match(/Trident/) || !!userAgent.match(/rv:11/),
    isWebkit: !!userAgent.match(/AppleWebKit/),
};

export const Browser = {
    isEdge: () => browser.isEdge,
    isInternetExplorer: () => browser.isInternetExplorer,
    isWebkit: () => browser.isWebkit,
};
