/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, IIconBaseProps, SVGIconPaths } from "../../common";

export interface ISVGIconProps extends IIconBaseProps {
    paths: SVGIconPaths;
}

export class SVGIcon extends React.PureComponent<ISVGIconProps & React.SVGAttributes<SVGElement>> {
    public static displayName = "Blueprint2.SVGIcon";

    public static readonly SIZE_STANDARD = 16;
    public static readonly SIZE_LARGE = 20;

    public render() {
        const {
            className,
            color,
            iconSize = SVGIcon.SIZE_STANDARD,
            intent,
            paths,
            title = paths[0],
            ...svgProps
        } = this.props;

        // choose which pixel grid is most appropriate for given icon size
        const pixelGridSize = iconSize >= SVGIcon.SIZE_LARGE ? SVGIcon.SIZE_LARGE : SVGIcon.SIZE_STANDARD;
        const pathStrings = pixelGridSize === SVGIcon.SIZE_STANDARD ? paths[1] : paths[2];

        const classes = classNames(Classes.ICON, Classes.intentClass(intent), className);
        const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`;

        // ".pt-icon" will apply a "fill" CSS style, so we need to inject an inline style to override it
        let { style = {} } = this.props;
        if (color != null) {
            style = { ...style, fill: color };
        }

        return (
            <svg
                {...svgProps}
                className={classes}
                style={style}
                data-icon={paths[0]}
                width={iconSize}
                height={iconSize}
                viewBox={viewBox}
            >
                {title ? <title>{title}</title> : null}
                {this.renderSvgPaths(pathStrings)}
            </svg>
        );
    }

    private renderSvgPaths(pathStrings: string[] | null) {
        if (pathStrings == null) {
            return null;
        }
        return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" />);
    }
}
