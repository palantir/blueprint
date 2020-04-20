/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import classNames from "classnames";
import * as React from "react";
import { polyfill } from "react-lifecycles-compat";
import { AbstractPureComponent2, Classes } from "../../common";
import { SPINNER_WARN_CLASSES_SIZE } from "../../common/errors";
import { DISPLAYNAME_PREFIX, IIntentProps, IProps } from "../../common/props";
import { clamp } from "../../common/utils";

// see http://stackoverflow.com/a/18473154/3124288 for calculating arc path
const R = 45;
const SPINNER_TRACK = `M 50,50 m 0,-${R} a ${R},${R} 0 1 1 0,${R * 2} a ${R},${R} 0 1 1 0,-${R * 2}`;

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
     * 10px.
     *
     * Constants are available for common sizes:
     * - `Spinner.SIZE_SMALL = 20px`
     * - `Spinner.SIZE_STANDARD = 50px`
     * - `Spinner.SIZE_LARGE = 100px`
     *
     * @default Spinner.SIZE_STANDARD = 50
     */
    size?: number;

    /**
     * HTML tag for the two wrapper elements. If rendering a `<Spinner>` inside
     * an `<svg>`, change this to an SVG element like `"g"`.
     * @default "div"
     */
    tagName?: keyof JSX.IntrinsicElements;

    /**
     * A value between 0 and 1 (inclusive) representing how far along the operation is.
     * Values below 0 or above 1 will be interpreted as 0 or 1 respectively.
     * Omitting this prop will result in an "indeterminate" spinner where the head spins indefinitely.
     */
    value?: number;
}

@polyfill
export class Spinner extends AbstractPureComponent2<ISpinnerProps, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Spinner`;

    public static readonly SIZE_SMALL = 20;
    public static readonly SIZE_STANDARD = 50;
    public static readonly SIZE_LARGE = 100;

    public componentDidUpdate(prevProps: ISpinnerProps) {
        if (prevProps.value !== this.props.value) {
            // IE/Edge: re-render after changing value to force SVG update
            this.forceUpdate();
        }
    }

    public render() {
        const { className, intent, value, tagName = "div" } = this.props;
        const size = this.getSize();

        const classes = classNames(
            Classes.SPINNER,
            Classes.intentClass(intent),
            { [Classes.SPINNER_NO_SPIN]: value != null },
            className,
        );

        // keep spinner track width consistent at all sizes (down to about 10px).
        const strokeWidth = Math.min(MIN_STROKE_WIDTH, (STROKE_WIDTH * Spinner.SIZE_LARGE) / size);
        const strokeOffset = PATH_LENGTH - PATH_LENGTH * (value == null ? 0.25 : clamp(value, 0, 1));

        // multiple DOM elements around SVG are necessary to properly isolate animation:
        // - SVG elements in IE do not support anim/trans so they must be set on a parent HTML element.
        // - SPINNER_ANIMATION isolates svg from parent display and is always centered inside root element.
        return React.createElement(
            tagName,
            { className: classes },
            React.createElement(
                tagName,
                { className: Classes.SPINNER_ANIMATION },
                <svg
                    width={size}
                    height={size}
                    strokeWidth={strokeWidth.toFixed(2)}
                    viewBox={this.getViewBox(strokeWidth)}
                >
                    <path className={Classes.SPINNER_TRACK} d={SPINNER_TRACK} />
                    <path
                        className={Classes.SPINNER_HEAD}
                        d={SPINNER_TRACK}
                        pathLength={PATH_LENGTH}
                        strokeDasharray={`${PATH_LENGTH} ${PATH_LENGTH}`}
                        strokeDashoffset={strokeOffset}
                    />
                </svg>,
            ),
        );
    }

    protected validateProps({ className = "", size }: ISpinnerProps) {
        if (size != null && (className.indexOf(Classes.SMALL) >= 0 || className.indexOf(Classes.LARGE) >= 0)) {
            console.warn(SPINNER_WARN_CLASSES_SIZE);
        }
    }

    /**
     * Resolve size to a pixel value.
     * Size can be set by className, props, default, or minimum constant.
     */
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

    /** Compute viewbox such that stroked track sits exactly at edge of image frame. */
    private getViewBox(strokeWidth: number) {
        const radius = R + strokeWidth / 2;
        const viewBoxX = (50 - radius).toFixed(2);
        const viewBoxWidth = (radius * 2).toFixed(2);
        return `${viewBoxX} ${viewBoxX} ${viewBoxWidth} ${viewBoxWidth}`;
    }
}
