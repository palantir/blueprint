/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import type { IListogramSerieItem, IMultiListogramItem } from "./listogramTypes";

export function createSerieKeyToBaseItemMap(item: IMultiListogramItem) {
    const result: { [key: string]: IListogramSerieItem } = {};
    item.series.forEach(serieItem => (result[serieItem.key] = serieItem));
    return result;
}
