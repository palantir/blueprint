/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { IIntentProps, IProps } from "../../common/props";
import { clamp } from "../../common/utils";

// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
const SPINNER_TRACK = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";

// unitless total length of SVG path, to which stroke-dash* properties are relative.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
// this value is the result of `<path d={SPINNER_TRACK} />.getTotalLength()` and works in all browsers:
const PATH_LENGTH = 280;

export interface ISpinnerProps extends IProps, IIntentProps {
    /** Whether this spinner should use large styles. */
    large?: boolean;

    /** Whether this spinner should use small styles. */
    small?: boolean;

    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1 respectively.
     * Omitting this prop will result in an "indeterminate" spinner where the head spins indefinitely.
     */
    value?: number;
}

export class Spinner extends React.PureComponent<ISpinnerProps, {}> {
    public static displayName = "Blueprint2.Spinner";

    public render() {
        const { className, intent, large, small, value } = this.props;
        const classes = classNames(
            Classes.SPINNER,
            Classes.intentClass(intent),
            {
                [Classes.LARGE]: large,
                [Classes.SMALL]: small,
                [Classes.SPINNER_NO_SPIN]: value != null,
            },
            className,
        );

        const style: React.CSSProperties = {
            strokeDasharray: `${PATH_LENGTH} ${PATH_LENGTH}`,
            // default to quarter-circle when indeterminate
            // IE11: CSS transitions on SVG elements are Not Supported :(
            strokeDashoffset: PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1)),
        };

        // HACKHACK to squash error regarding React.SVGProps missing prop pathLength
        const svgPathAttributes: React.DOMAttributes<SVGPathElement> = {
            className: Classes.SPINNER_HEAD,
            d: SPINNER_TRACK,
            pathLength: PATH_LENGTH,
            style,
        } as any;

        return this.renderContainer(
            classes,
            <svg viewBox={classes.indexOf(Classes.SMALL) >= 0 ? "-15 -15 130 130" : "0 0 100 100"}>
                <path className={Classes.SPINNER_TRACK} d={SPINNER_TRACK} />
                <path {...svgPathAttributes} />
            </svg>,
        );
    }

    // abstract away the container elements so SVGSpinner can do its own thing
    protected renderContainer(classes: string, content: JSX.Element) {
        return (
            <div className={classes}>
                <div className={Classes.SPINNER_SVG_CONTAINER}>{content}</div>
            </div>
        );
    }
}
