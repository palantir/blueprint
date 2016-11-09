/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IRegion } from "../regions";
import { IProps } from "@blueprintjs/core";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

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

@PureRender
export class RegionLayer extends React.Component<IRegionLayerProps, {}> {
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
