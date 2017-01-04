/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as React from "react";
import { IRegion } from "../regions";

export interface IRegionStyler {
    (region: IRegion): React.CSSProperties;
}

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

export class RegionLayer extends React.PureComponent<IRegionLayerProps, {}> {
    public render() {
        return <div className="bp-table-overlay-layer">{this.renderRegionChildren()}</div>;
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
                className={classNames("bp-table-overlay bp-table-region", className)}
                key={index}
                style={getRegionStyle(region)}
            />
        );
    }
}
