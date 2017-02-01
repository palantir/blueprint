/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

const userAgent = navigator.userAgent;

export const Browser = {
    isEdge: !!userAgent.match(/Edge/),
    isInternetExplorer: (!!userAgent.match(/Trident/) || !!userAgent.match(/rv:11/)),
};
