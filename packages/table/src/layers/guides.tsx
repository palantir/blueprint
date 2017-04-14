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
            <div className={classNames(className, Classes.TABLE_OVERLAY_LAYER)}>
                {verticals}
                {horizontals}
            </div>
        );
    }

    private renderVerticalGuide = (offset: number, index: number) => {
        const style = {
            left: `${offset}px`,
        } as React.CSSProperties;
        const className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_VERTICAL_GUIDE, {
            "bp-table-vertical-guide-flush-left": offset === 0,
        });
        return (
            <div className={className} key={index} style={style} />
        );
    }

    private renderHorizontalGuide = (offset: number, index: number) => {
        const style = {
            top: `${offset}px`,
        } as React.CSSProperties;
        const className = classNames(Classes.TABLE_OVERLAY, Classes.TABLE_HORIZONTAL_GUIDE, {
            "bp-table-horizontal-guide-flush-top": offset === 0,
        });
        return (
            <div className={className} key={index} style={style} />
        );
    }
}
