/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
import { Utils } from "../common/utils";
import { IRegion, Regions } from "../regions";

export type IRegionStyler = (region: IRegion) => React.CSSProperties;

export interface IRegionLayerProps extends IProps {
    /**
     * The array of regions to render.
     */
    regions?: IRegion[];

    /**
     * A callback interface for applying CSS styles to the regions.
     */
    getRegionStyle: IRegionStyler;
}

// don't include "regions" in here, because it can't be shallowly compared
const UPDATE_PROPS_KEYS = [
    "className",
    "getRegionStyle",
];

export class RegionLayer extends React.Component<IRegionLayerProps, {}> {
    public shouldComponentUpdate(nextProps: IRegionLayerProps) {
        return !Utils.shallowCompareKeys(this.props, nextProps, UPDATE_PROPS_KEYS)
            || !Regions.regionArraysEqual(this.props.regions, nextProps.regions);
    }

    public render() {
        return <div className={Classes.TABLE_OVERLAY_LAYER}>{this.renderRegionChildren()}</div>;
    }

    private renderRegionChildren() {
        const { regions } = this.props;
        if (regions == null) {
            return undefined;
        }
        return regions.map(this.renderRegion);
    }

    private renderRegion = (region: IRegion, index: number) => {
        const { className, getRegionStyle } = this.props;
        return (
            <div
                className={classNames(Classes.TABLE_OVERLAY, Classes.TABLE_REGION, className)}
                key={index}
                style={getRegionStyle(region)}
            />
        );
    }
}
