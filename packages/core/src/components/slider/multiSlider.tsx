/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import { Classes, Intent } from "../../common";
import { AbstractPureComponent } from "../../common/abstractPureComponent";
import * as Errors from "../../common/errors";
import { IProps } from "../../common/props";
import * as Utils from "../../common/utils";
import { Handle } from "./handle";
import { HandleInteractionKind, HandleType, IHandleProps } from "./handleProps";
import { argMin, fillValues, formatPercentage } from "./sliderUtils";

// TODO: move this to props.ts in a follow up PR
/** A convenience type for React's optional children prop. */
export interface IChildrenProps {
    children?: React.ReactNode;
}

export interface ISliderBaseProps extends IProps {
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

export interface IMultiSliderProps extends ISliderBaseProps {
    /** Default intent of a track segment, used only if no handle specifies `intentBefore/After`. */
    defaultTrackIntent?: Intent;

    /** Callback invoked when a handle value changes. Receives handle values in sorted order. */
    onChange?(values: number[]): void;

    /** Callback invoked when a handle is released. Receives handle values in sorted order. */
    onRelease?(values: number[]): void;
}

export interface ISliderState {
    labelPrecision?: number;
    /** the client size, in pixels, of one tick */
    tickSize?: number;
    /** the size of one tick as a ratio of the component's client size */
    tickSizeRatio?: number;
}

export class MultiSlider extends AbstractPureComponent<IMultiSliderProps, ISliderState> {
    public static defaultSliderProps: ISliderBaseProps = {
        disabled: false,
        labelStepSize: 1,
        max: 10,
        min: 0,
        showTrackFill: true,
        stepSize: 1,
        vertical: false,
    };

    public static defaultProps: IMultiSliderProps = {
        ...MultiSlider.defaultSliderProps,
        defaultTrackIntent: Intent.NONE,
    };

    public static displayName = "Blueprint2.MultiSlider";

    public static Handle: React.SFC<IHandleProps> = () => null;

    public state: ISliderState = {
        labelPrecision: getLabelPrecision(this.props),
        tickSize: 0,
        tickSizeRatio: 0,
    };

    private handleElements: Handle[] = [];
    private handleProps: IHandleProps[];

    private trackElement: HTMLElement | null;

    public render() {
        const classes = classNames(
            Classes.SLIDER,
            {
                [Classes.DISABLED]: this.props.disabled,
                [`${Classes.SLIDER}-unlabeled`]: this.props.labelRenderer === false,
                [Classes.VERTICAL]: this.props.vertical,
            },
            this.props.className,
        );
        return (
            <div className={classes} onMouseDown={this.maybeHandleTrackClick} onTouchStart={this.maybeHandleTrackTouch}>
                <div className={Classes.SLIDER_TRACK} ref={ref => (this.trackElement = ref)}>
                    {this.renderTracks()}
                </div>
                <div className={Classes.SLIDER_AXIS}>{this.renderLabels()}</div>
                {this.renderHandles()}
            </div>
        );
    }

    public componentWillMount() {
        this.handleProps = getSortedInteractiveHandleProps(this.props);
    }

    public componentDidMount() {
        this.updateTickSize();
    }

    public componentDidUpdate() {
        this.updateTickSize();
    }

    public componentWillReceiveProps(nextProps: IMultiSliderProps & IChildrenProps) {
        this.setState({ labelPrecision: this.getLabelPrecision(nextProps) });

        const newHandleProps = getSortedInteractiveHandleProps(nextProps);
        if (newHandleProps.length !== this.handleProps.length) {
            this.handleElements = [];
        }
        this.handleProps = newHandleProps;
    }

    protected validateProps(props: IMultiSliderProps & IChildrenProps) {
        if (props.stepSize <= 0) {
            throw new Error(Errors.SLIDER_ZERO_STEP);
        }
        if (props.labelStepSize <= 0) {
            throw new Error(Errors.SLIDER_ZERO_LABEL_STEP);
        }

        let anyInvalidChildren = false;
        React.Children.forEach(props.children, child => {
            // allow boolean coercion to omit nulls and false values
            if (child && !Utils.isElementOfType(child, MultiSlider.Handle)) {
                anyInvalidChildren = true;
            }
        });
        if (anyInvalidChildren) {
            throw new Error(Errors.MULTISLIDER_INVALID_CHILD);
        }
    }

    private formatLabel(value: number): React.ReactChild {
        const { labelRenderer } = this.props;
        if (labelRenderer === false) {
            return null;
        } else if (Utils.isFunction(labelRenderer)) {
            return labelRenderer(value);
        } else {
            return value.toFixed(this.state.labelPrecision);
        }
    }

    private renderLabels() {
        if (this.props.labelRenderer === false) {
            return null;
        }
        const { labelStepSize, max, min } = this.props;

        const labels: JSX.Element[] = [];
        const stepSizeRatio = this.state.tickSizeRatio * labelStepSize;
        // step size lends itself naturally to a `for` loop
        // tslint:disable-next-line:one-variable-per-declaration ban-comma-operator
        for (
            let i = min, offsetRatio = 0;
            i < max || Utils.approxEqual(i, max);
            i += labelStepSize, offsetRatio += stepSizeRatio
        ) {
            const offsetPercentage = formatPercentage(offsetRatio);
            const style = this.props.vertical ? { bottom: offsetPercentage } : { left: offsetPercentage };
            labels.push(
                <div className={Classes.SLIDER_LABEL} key={i} style={style}>
                    {this.formatLabel(i)}
                </div>,
            );
        }
        return labels;
    }

    private renderTracks() {
        const trackStops = getSortedHandleProps(this.props);
        trackStops.push({ value: this.props.max });

        // render from current to previous, then increment previous
        let previous: IHandleProps = { value: this.props.min };
        const handles: JSX.Element[] = [];
        for (let index = 0; index < trackStops.length; index++) {
            const current = trackStops[index];
            handles.push(this.renderTrackFill(index, previous, current));
            previous = current;
        }
        return handles;
    }

    private renderTrackFill(index: number, start: IHandleProps, end: IHandleProps) {
        // ensure startRatio <= endRatio
        const [startRatio, endRatio] = [this.getOffsetRatio(start.value), this.getOffsetRatio(end.value)].sort();
        const startOffset = formatPercentage(startRatio);
        const endOffset = formatPercentage(1 - endRatio);
        const style: React.CSSProperties = this.props.vertical
            ? { bottom: startOffset, top: endOffset, left: 0 }
            : { left: startOffset, right: endOffset, top: 0 };

        const classes = classNames(Classes.SLIDER_PROGRESS, Classes.intentClass(this.getTrackIntent(start, end)));
        return <div key={`track-${index}`} className={classes} style={style} />;
    }

    private renderHandles() {
        const { disabled, max, min, stepSize, vertical } = this.props;
        return this.handleProps.map(({ value, type }, index) => (
            <Handle
                className={classNames({
                    [Classes.START]: type === HandleType.START,
                    [Classes.END]: type === HandleType.END,
                })}
                disabled={disabled}
                key={`${index}-${this.handleProps.length}`}
                label={this.formatLabel(value)}
                max={max}
                min={min}
                onChange={this.getHandlerForIndex(index, this.handleChange)}
                onRelease={this.getHandlerForIndex(index, this.handleRelease)}
                ref={this.addHandleRef}
                stepSize={stepSize}
                tickSize={this.state.tickSize}
                tickSizeRatio={this.state.tickSizeRatio}
                value={value}
                vertical={vertical}
            />
        ));
    }

    private addHandleRef = (ref: Handle) => {
        if (ref != null) {
            this.handleElements.push(ref);
        }
    };

    private maybeHandleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (this.canHandleTrackEvent(event)) {
            const foundHandle = this.nearestHandleForValue(this.handleElements, handle =>
                handle.mouseEventClientOffset(event),
            );
            if (foundHandle) {
                foundHandle.beginHandleMovement(event);
            }
        }
    };

    private maybeHandleTrackTouch = (event: React.TouchEvent<HTMLDivElement>) => {
        if (this.canHandleTrackEvent(event)) {
            const foundHandle = this.nearestHandleForValue(this.handleElements, handle =>
                handle.touchEventClientOffset(event),
            );
            if (foundHandle) {
                foundHandle.beginHandleTouchMovement(event);
            }
        }
    };

    private canHandleTrackEvent = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        // ensure event does not come from inside the handle
        return !this.props.disabled && target.closest(`.${Classes.SLIDER_HANDLE}`) == null;
    };

    private nearestHandleForValue(handles: Handle[], getOffset: (handle: Handle) => number): Handle | undefined {
        return argMin(handles, handle => {
            const offset = getOffset(handle);
            const offsetValue = handle.clientToValue(offset);
            const handleValue = handle.props.value!;
            return Math.abs(offsetValue - handleValue);
        });
    }

    private getHandlerForIndex = (index: number, callback?: (values: number[]) => void) => {
        return (newValue: number) => {
            Utils.safeInvoke(callback, this.getNewHandleValues(newValue, index));
        };
    };

    private getNewHandleValues(newValue: number, oldIndex: number) {
        const oldValues = this.handleProps.map(handle => handle.value);
        const newValues = oldValues.slice();
        newValues[oldIndex] = newValue;
        newValues.sort((left, right) => left - right);

        const newIndex = newValues.indexOf(newValue);
        const lockIndex = this.findFirstLockedHandleIndex(oldIndex, newIndex);
        if (lockIndex === -1) {
            fillValues(newValues, oldIndex, newIndex, newValue);
        } else {
            // If pushing past a locked handle, discard the new value and only make the updates to clamp values against the lock.
            const lockValue = oldValues[lockIndex];
            fillValues(oldValues, oldIndex, lockIndex, lockValue);
            return oldValues;
        }

        return newValues;
    }

    private findFirstLockedHandleIndex(startIndex: number, endIndex: number): number {
        const inc = startIndex < endIndex ? 1 : -1;
        for (let index = startIndex + inc; index !== endIndex + inc; index += inc) {
            if (this.handleProps[index].interactionKind !== HandleInteractionKind.PUSH) {
                return index;
            }
        }
        return -1;
    }

    private handleChange = (newValues: number[]) => {
        const oldValues = this.handleProps.map(handle => handle.value);
        if (!Utils.arraysEqual(newValues, oldValues)) {
            Utils.safeInvoke(this.props.onChange, newValues);
            this.handleProps.forEach((handle, index) => {
                if (oldValues[index] !== newValues[index]) {
                    Utils.safeInvoke(handle.onChange, newValues[index]);
                }
            });
        }
    };

    private handleRelease = (newValues: number[]) => {
        Utils.safeInvoke(this.props.onRelease, newValues);
        this.handleProps.forEach((handle, index) => {
            Utils.safeInvoke(handle.onRelease, newValues[index]);
        });
    };

    private getLabelPrecision({ labelPrecision, stepSize }: IMultiSliderProps) {
        // infer default label precision from stepSize because that's how much the handle moves.
        return labelPrecision == null ? Utils.countDecimalPlaces(stepSize) : labelPrecision;
    }

    private getOffsetRatio(value: number) {
        return Utils.clamp((value - this.props.min) * this.state.tickSizeRatio, 0, 1);
    }

    private getTrackIntent(start: IHandleProps, end?: IHandleProps): Intent {
        if (!this.props.showTrackFill) {
            return Intent.NONE;
        }
        if (start.intentAfter !== undefined) {
            return start.intentAfter;
        } else if (end !== undefined && end.intentBefore !== undefined) {
            return end.intentBefore;
        }
        return this.props.defaultTrackIntent;
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

function getLabelPrecision({ labelPrecision, stepSize }: IMultiSliderProps) {
    // infer default label precision from stepSize because that's how much the handle moves.
    return labelPrecision == null ? Utils.countDecimalPlaces(stepSize) : labelPrecision;
}

function getSortedInteractiveHandleProps(props: IChildrenProps): IHandleProps[] {
    return getSortedHandleProps(props, childProps => childProps.interactionKind !== HandleInteractionKind.NONE);
}

function getSortedHandleProps({ children }: IChildrenProps, predicate: (props: IHandleProps) => boolean = () => true) {
    const maybeHandles = React.Children.map(
        children,
        child => (Utils.isElementOfType(child, MultiSlider.Handle) && predicate(child.props) ? child.props : null),
    );
    let handles = maybeHandles != null ? maybeHandles : [];
    handles = handles.filter(handle => handle !== null);
    handles.sort((left, right) => left.value - right.value);
    return handles;
}
