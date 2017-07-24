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
import { QuadrantType } from "../quadrants/tableQuadrant";
import { IRegion, Regions } from "../regions";

export type IRegionStyler = (region: IRegion, quadrantType?: QuadrantType) => React.CSSProperties;

export interface IRegionLayerProps extends IProps {
    /**
     * The array of regions to render.
     */
    regions?: IRegion[];

    /**
     * The array of CSS styles to apply to each region. The ith style object in this array will be
     * applied to the ith region in `regions`.
     */
    regionStyles?: React.CSSProperties[];
}

// don't include "regions" or "regionStyles" in here, because they can't be shallowly compared
const UPDATE_PROPS_KEYS = [
    "className",
] as Array<keyof IRegionLayerProps>;

export class RegionLayer extends React.Component<IRegionLayerProps, {}> {
    public shouldComponentUpdate(nextProps: IRegionLayerProps) {
        // shallowly comparable props like "className" tend not to change in the default table
        // implementation, so do that check last with hope that we return earlier and avoid it
        // altogether.
        return !Utils.arraysEqual(this.props.regions, nextProps.regions, Regions.regionsEqual)
            || !Utils.arraysEqual(this.props.regionStyles, nextProps.regionStyles, Utils.shallowCompareKeys)
            || !Utils.shallowCompareKeys(this.props, nextProps, { include: UPDATE_PROPS_KEYS });
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

    private renderRegion = (_region: IRegion, index: number) => {
        const { className, regionStyles } = this.props;
        return (
            <div
                className={classNames(Classes.TABLE_OVERLAY, Classes.TABLE_REGION, className)}
                key={index}
                style={regionStyles[index]}
            />
        );
    }
}
