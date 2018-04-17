/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Classes from "../../common/classes";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";
import { approxEqual, countDecimalPlaces, isFunction } from "../../common/utils";

export interface ICoreSliderProps extends IProps {
    /**
     * Whether the slider is non-interactive.
     * @default false
     */
    disabled?: boolean;

    /**
     * Increment between successive labels. Must be greater than zero.
     * @default 1
     */
    labelStepSize?: number;

    /**
     * Number of decimal places to use when rendering label value. Default value is the number of
     * decimals used in the `stepSize` prop. This prop has _no effect_ if you supply a custom
     * `labelRenderer` callback.
     * @default inferred from stepSize
     */
    labelPrecision?: number;

    /**
     * Maximum value of the slider.
     * @default 10
     */
    max?: number;

    /**
     * Minimum value of the slider.
     * @default 0
     */
    min?: number;

    /**
     * Whether a solid bar should be rendered on the track between current and initial values,
     * or between handles for `RangeSlider`.
     * @default true
     */
    showTrackFill?: boolean;

    /**
     * Increment between successive values; amount by which the handle moves. Must be greater than zero.
     * @default 1
     */
    stepSize?: number;

    /**
     * Callback to render a single label. Useful for formatting numbers as currency or percentages.
     * If `true`, labels will use number value formatted to `labelPrecision` decimal places.
     * If `false`, labels will not be shown.
     * @default true
     */
    labelRenderer?: boolean | ((value: number) => string | JSX.Element);

    /**
     * Whether to show the slider in a vertical orientation.
     * @default false
     */
    vertical?: boolean;
}

export interface ISliderState {
    labelPrecision?: number;
    /** the client size, in pixels, of one tick */
    tickSize?: number;
    /** the size of one tick as a ratio of the component's client size */
    tickSizeRatio?: number;
}

export abstract class CoreSlider<P extends ICoreSliderProps> extends AbstractPureComponent<P, ISliderState> {
    public className = Classes.SLIDER;

    private trackElement: HTMLElement;
    private refHandlers = {
        track: (el: HTMLDivElement) => (this.trackElement = el),
    };

    public constructor(props: P) {
        super(props);
        this.state = {
            labelPrecision: this.getLabelPrecision(props),
            tickSize: 0,
            tickSizeRatio: 0,
        };
    }

    public render() {
        const classes = classNames(
            this.className,
            {
                [Classes.DISABLED]: this.props.disabled,
                [`${Classes.SLIDER}-unlabeled`]: this.props.labelRenderer === false,
                [Classes.VERTICAL]: this.props.vertical,
            },
            this.props.className,
        );
        return (
            <div className={classes} onMouseDown={this.maybeHandleTrackClick} onTouchStart={this.maybeHandleTrackTouch}>
                <div className={`${Classes.SLIDER}-track`} ref={this.refHandlers.track} />
                {this.maybeRenderFill()}
                {this.maybeRenderAxis()}
                {this.renderHandles()}
            </div>
        );
    }

    public componentDidMount() {
        this.updateTickSize();
    }

    public componentDidUpdate() {
        this.updateTickSize();
    }

    public componentWillReceiveProps(props: P & { children: React.ReactNode }) {
        super.componentWillReceiveProps(props);
        this.setState({ labelPrecision: this.getLabelPrecision(props) });
    }

    protected abstract renderHandles(): JSX.Element | JSX.Element[];
    protected abstract renderFill(): JSX.Element;
    /** An event listener invoked when the user clicks on the track outside a handle */
    protected abstract handleTrackClick(event: React.MouseEvent<HTMLElement>): void;
    protected abstract handleTrackTouch(event: React.TouchEvent<HTMLElement>): void;

    protected formatLabel(value: number): React.ReactChild {
        const { labelRenderer } = this.props;
        if (labelRenderer === false) {
            return undefined;
        } else if (isFunction(labelRenderer)) {
            // TODO: TS 2.7 might have a type narrowing issue?
            return (labelRenderer as (value: number) => React.ReactChild)(value);
        } else {
            return value.toFixed(this.state.labelPrecision);
        }
    }

    protected validateProps(props: P) {
        if (props.stepSize <= 0) {
            throw new Error(Errors.SLIDER_ZERO_STEP);
        }
        if (props.labelStepSize <= 0) {
            throw new Error(Errors.SLIDER_ZERO_LABEL_STEP);
        }
    }

    protected getTrackInitialPixel() {
        if (this.trackElement == null) {
            return undefined;
        }
        const trackRect = this.trackElement.getBoundingClientRect();
        // for vertical tracks, the initial (lowest-`value`) pixel is on the bottom.
        return this.props.vertical ? trackRect.top + trackRect.height : trackRect.left;
    }

    private maybeRenderAxis() {
        // explicit typedefs are required because tsc (rightly) assumes that props might be overriden with different
        // types in subclasses
        const max: number = this.props.max;
        const min: number = this.props.min;
        const labelStepSize: number = this.props.labelStepSize;
        if (this.props.labelRenderer === false) {
            return undefined;
        }

        const stepSizeRatio = this.state.tickSizeRatio * labelStepSize;
        const labels: JSX.Element[] = [];
        // tslint:disable-next-line:one-variable-per-declaration ban-comma-operator
        for (
            let i = min, offsetRatio = 0;
            i < max || approxEqual(i, max);
            i += labelStepSize, offsetRatio += stepSizeRatio
        ) {
            const offsetPercentage = formatPercentage(offsetRatio);
            const style = this.props.vertical ? { bottom: offsetPercentage } : { left: offsetPercentage };
            labels.push(
                <div className={`${Classes.SLIDER}-label`} key={i} style={style}>
                    {this.formatLabel(i)}
                </div>,
            );
        }
        return <div className={`${Classes.SLIDER}-axis`}>{labels}</div>;
    }

    private maybeRenderFill() {
        if (this.props.showTrackFill && this.trackElement != null) {
            return this.renderFill();
        }
        return undefined;
    }

    private maybeHandleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (this.canHandleTrackEvent(event)) {
            this.handleTrackClick(event);
        }
    };

    private maybeHandleTrackTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (this.canHandleTrackEvent(event)) {
            this.handleTrackTouch(event);
        }
    };

    private canHandleTrackEvent = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        // ensure event does not come from inside the handle
        return !this.props.disabled && target.closest(`.${Classes.SLIDER_HANDLE}`) == null;
    };

    private getLabelPrecision({ labelPrecision, stepSize }: P) {
        // infer default label precision from stepSize because that's how much the handle moves.
        return labelPrecision == null ? countDecimalPlaces(stepSize) : labelPrecision;
    }

    private updateTickSize() {
        if (this.trackElement != null) {
            const trackSize = this.props.vertical ? this.trackElement.clientHeight : this.trackElement.clientWidth;
            const tickSizeRatio = 1 / ((this.props.max as number) - (this.props.min as number));
            const tickSize = trackSize * tickSizeRatio;
            this.setState({ tickSize, tickSizeRatio });
        }
    }
}

/** Helper function for formatting ratios as CSS percentage values. */
export function formatPercentage(ratio: number) {
    return `${(ratio * 100).toFixed(2)}%`;
}
