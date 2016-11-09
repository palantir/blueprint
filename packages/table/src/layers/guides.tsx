/**
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import { IProps } from "@blueprint/core";
import * as classNames from "classnames";
import * as React from "react";

export interface IGuideLayerProps extends IProps {
    /**
     *  The left-offset location of the vertical guides
     */
    verticalGuides?: number[];

    /**
     *  The top-offset location of the horizontal guides
     */
    horizontalGuides?: number[];
}

export class GuideLayer extends React.Component<IGuideLayerProps, {}> {
    public render() {
        const { verticalGuides, horizontalGuides, className } = this.props;
        const verticals = (verticalGuides == null) ? undefined : verticalGuides.map(this.renderVerticalGuide);
        const horizontals = (horizontalGuides == null) ? undefined : horizontalGuides.map(this.renderHorizontalGuide);
        return (
            <div className={classNames(className, "bp-table-overlay-layer")}>
                {verticals}
                {horizontals}
            </div>
        );
    }

    private renderVerticalGuide = (offset: number, index: number) => {
        const style = {
            left: `${offset}px`,
        } as React.CSSProperties;
        return (
            <div className="bp-table-overlay bp-table-vertical-guide" key={index} style={style} />
        );
    };

    private renderHorizontalGuide = (offset: number, index: number) => {
        const style = {
            top: `${offset}px`,
        } as React.CSSProperties;
        return (
            <div className="bp-table-overlay bp-table-horizontal-guide" key={index} style={style} />
        );
    };
}
