/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import { SPINNER_WARN_CLASSES_SIZE } from "../../common/errors";
import { IIntentProps, IProps } from "../../common/props";
import { clamp } from "../../common/utils";

// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
const SPINNER_TRACK = "M 50,50 m 0,-44.5 a 44.5,44.5 0 1 1 0,89 a 44.5,44.5 0 1 1 0,-89";

// unitless total length of SVG path, to which stroke-dash* properties are relative.
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/pathLength
// this value is the result of `<path d={SPINNER_TRACK} />.getTotalLength()` and works in all browsers:
const PATH_LENGTH = 280;

const MIN_SIZE = 10;
const STROKE_WIDTH = 4;
const MIN_STROKE_WIDTH = 16;

export interface ISpinnerProps extends IProps, IIntentProps {
    /**
     * Width and height of the spinner in pixels. The size cannot be less than
     * 10px. Constants are available for common sizes: `Spinner.SIZE_SMALL`,
     * `Spinner.SIZE_STANDARD`, `Spinner.SIZE_LARGE`.
     * @default Spinner.SIZE_STANDARD = 50
     */
    size?: number;

    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1 respectively.
     * Omitting this prop will result in an "indeterminate" spinner where the head spins indefinitely.
     */
    value?: number;
}

export class Spinner extends AbstractPureComponent<ISpinnerProps, {}> {
    public static displayName = "Blueprint2.Spinner";

    public static readonly SIZE_SMALL = 24;
    public static readonly SIZE_STANDARD = 50;
    public static readonly SIZE_LARGE = 100;

    public render() {
        const { className, intent, value } = this.props;
        const size = this.getSize();

        const classes = classNames(
            Classes.SPINNER,
            Classes.intentClass(intent),
            { [Classes.SPINNER_NO_SPIN]: value != null },
            className,
        );

        // attempt to keep spinner stroke width constant at all sizes
        const strokeWidth = Math.min(MIN_STROKE_WIDTH, STROKE_WIDTH * Spinner.SIZE_LARGE / size);

        const strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1));

        return (
            <svg className={classes} height={size} width={size} viewBox="0 0 100 100" strokeWidth={strokeWidth}>
                <path className={Classes.SPINNER_TRACK} d={SPINNER_TRACK} />
                <path
                    className={Classes.SPINNER_HEAD}
                    d={SPINNER_TRACK}
                    pathLength={PATH_LENGTH}
                    strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
                    strokeDashoffset={strokeOffset}
                />
            </svg>
        );
    }

    protected validateProps({ className = "", size }: ISpinnerProps) {
        if (size != null && (className.indexOf(Classes.SMALL) >= 0 || className.indexOf(Classes.LARGE) >= 0)) {
            console.warn(SPINNER_WARN_CLASSES_SIZE);
        }
    }

    private getSize() {
        const { className = "", size } = this.props;
        if (size == null) {
            // allow Classes constants to determine default size.
            if (className.indexOf(Classes.SMALL) >= 0) {
                return Spinner.SIZE_SMALL;
            } else if (className.indexOf(Classes.LARGE) >= 0) {
                return Spinner.SIZE_LARGE;
            }
            return Spinner.SIZE_STANDARD;
        }
        return Math.max(MIN_SIZE, size);
    }
}
