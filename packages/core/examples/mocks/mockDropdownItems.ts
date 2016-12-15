/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IDropdownMenuItemProps } from "@blueprintjs/core";

export function simple(): { default: IDropdownMenuItemProps[] } {
    return {
        default: [
            { id: "0", text: "Line", iconName: "trending-up" },
            { id: "1", text: "Scatter", iconName: "scatter-plot" },
            { id: "2", text: "Bar", iconName: "timeline-bar-chart" },
            { id: "3", text: "Grid", iconName: "heat-grid" },
            { id: "4", text: "Pie", iconName: "pie-chart" },
            { id: "5", text: "Regression", iconName: "regression-chart" },
        ],
    };
}

export function groups(): { [name: string]: IDropdownMenuItemProps[] } {
    /* tslint:disable object-literal-sort-keys */
    return {
        "West Village": [
            uniqueItem("Takashi"),
        ],
        "East Village": [
            uniqueItem("Ippudo"),
            uniqueItem("Ivan Ramen"),
            uniqueItem("Minca"),
        ],
        "Downtown BK": [
            uniqueItem("Ganso"),
        ],
        "Williamsburg": [
            uniqueItem("Ichiran"),
        ],
    };
    /* tslint:enable object-literal-sort-keys */
}

function uniqueItem(name: string): IDropdownMenuItemProps {
    return { id: name, text: name };
}
