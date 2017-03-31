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
    // tslint:disable object-literal-sort-keys object-literal-key-quotes
    return {
        "Manhattan": [
            uniqueItem("Ippudo Westside", "Hell's Kitchen"),
            uniqueItem("Totto Ramen", "Hell's Kitchen"),
            uniqueItem("Ippudo", "East Village"),
            uniqueItem("Ivan Ramen", "Lower East Side"),
            uniqueItem("Minca", "East Village"),
        ],
        "Brooklyn": [
            uniqueItem("Kogane", "BK Heights"),
            uniqueItem("Ganso", "Downtown BK"),
            uniqueItem("Chuko", "Prospect Heights"),
            uniqueItem("Suzume", "East Williamsburg"),
            uniqueItem("Yuji Ramen", "Williamsburg"),
            uniqueItem("Ramen Yebisu", "Williamsburg"),
            uniqueItem("Ichiran", "East Williamsburg"),
            uniqueItem("Samurai Mama", "Williamsburg"),
        ],
    };
    // tslint:enable
}

function uniqueItem(name: string, label?: string): IDropdownMenuItemProps {
    return { id: name, text: name, label };
}
