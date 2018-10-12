/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import {
    Button,
    H5,
    HTMLSelect,
    Icon,
    IPopoverProps,
    Label,
    Popover,
    Position,
    Slider,
    Switch,
} from "@blueprintjs/core";
import { Example, handleStringChange, IExampleProps } from "@blueprintjs/docs-theme";
import { ReferenceObject } from "popper.js";
import { findDOMNode } from "react-dom";

export interface IPopoverTargetObjectExampleState {
    isOpen: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
    position: Position;
    relative: boolean;
}

const VALID_POSITIONS: Position[] = [
    Position.TOP_LEFT,
    Position.TOP,
    Position.TOP_RIGHT,
    Position.RIGHT_TOP,
    Position.RIGHT,
    Position.RIGHT_BOTTOM,
    Position.BOTTOM_LEFT,
    Position.BOTTOM,
    Position.BOTTOM_RIGHT,
    Position.LEFT_TOP,
    Position.LEFT,
    Position.LEFT_BOTTOM,
];

export class PopoverTargetObjectExample extends React.PureComponent<IExampleProps, IPopoverTargetObjectExampleState> {
    public state: IPopoverTargetObjectExampleState = {
        height: 10,
        isOpen: false,
        left: 50,
        position: "right",
        relative: false,
        top: 50,
        width: 10,
    };

    private handlePositionChange = handleStringChange((position: Position) => this.setState({ position }));

    public componentDidUpdate() {
        if (this.state.isOpen) {
            document.addEventListener("scroll", this.handleScroll);
        }
    }

    public render() {
        const { isOpen, position, relative } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Relative" checked={relative} onChange={this.handleRelativeChange} />
                <Switch label="Open" checked={isOpen} onChange={this.handleOpen} />
                <Label>
                    Position
                    <HTMLSelect
                        fill={true}
                        onChange={this.handlePositionChange}
                        options={VALID_POSITIONS}
                        value={position}
                    />
                </Label>
            </>
        );

        const target: IPopoverProps["target"] = relative ? (
            <div className="docs-popover-target-visualizer" style={this.getRelativeBoundingClientRect()} />
        ) : (
            {
                clientHeight: this.state.height,
                clientWidth: this.state.width,
                getBoundingClientRect: this.getBoundingClientRect,
            }
        );

        return (
            <Example className="docs-popover-target-example" options={options} {...this.props}>
                <H5>
                    Move the target<br />around the viewport.
                    {!isOpen && (
                        <>
                            <br />
                            <br />
                            <a onClick={this.handleOpen}>Open the popover</a> to<br />enable this example.
                        </>
                    )}
                </H5>
                <div className="docs-popover-target-controls">
                    <Icon icon="arrow-left" />
                    {this.renderSlider(this.state.left, this.handleLeftChange)}
                    <Icon icon="arrow-up" />
                    {this.renderSlider(this.state.top, this.handleTopChange)}
                    <Icon icon="arrows-horizontal" />
                    {this.renderSlider(this.state.width, this.handleWidthChange, true)}
                    <Icon icon="arrows-vertical" />
                    {this.renderSlider(this.state.height, this.handleHeightChange, true)}
                    <Icon icon="blank" />
                    <Button icon="refresh" text="Reset" onClick={this.handleReset} />
                </div>

                <Popover
                    {...POPOVER_PROPS}
                    content="I am in a Portal (default)."
                    isOpen={isOpen}
                    position={position}
                    usePortal={true}
                    target={target}
                />

                {isOpen &&
                    !relative && (
                        <div className="docs-popover-target-visualizer" style={this.getBoundingClientRect()} />
                    )}
            </Example>
        );
    }

    private renderSlider(value: number, onChange: (value: number) => void, isSmall = false) {
        const constraints = isSmall ? { min: 5, max: 55, stepSize: 5 } : { min: 0, max: 100, stepSize: 10 };
        return (
            <Slider
                disabled={!this.state.isOpen}
                labelRenderer={false}
                onChange={onChange}
                value={value}
                {...constraints}
            />
        );
    }

    private handleOpen = () => this.setState({ isOpen: !this.state.isOpen });
    private handleRelativeChange = () => this.setState({ relative: !this.state.relative });

    private getRelativeBoundingClientRect() {
        const { left, top } = this.state;
        const height = Math.max(this.state.height, 2);
        const width = Math.max(this.state.width, 2);
        // scale the box to viewport width/height. state fields are 0-100%
        return {
            bottom: top + height,
            height,
            left,
            right: left + width,
            top,
            width,
        };
    }

    private getBoundingClientRect = (): ClientRect => {
        // scale the box to viewport width/height. state fields are 0-100%
        return scale(this.getRelativeBoundingClientRect(), document.documentElement);
    };

    private handleHeightChange = (height: number) => this.setState({ height });
    private handleLeftChange = (left: number) => this.setState({ left });
    private handleTopChange = (top: number) => this.setState({ top });
    private handleWidthChange = (width: number) => this.setState({ width });

    private handleReset = () => this.setState({ left: 50, top: 50, width: 10, height: 10 });

    private handleScroll = () => {
        const element = findDOMNode(this) as HTMLElement;
        if (
            document.documentElement.scrollTop > element.offsetTop + element.clientHeight ||
            document.documentElement.scrollTop + document.documentElement.clientHeight < element.offsetTop
        ) {
            console.log("stop scroll");

            this.setState({ isOpen: false });
            document.removeEventListener("scroll", this.handleScroll);
        }
    };
}

const POPOVER_PROPS: IPopoverProps = {
    autoFocus: false,
    enforceFocus: false,
    // not relevant to this example, but required in order for default
    // modifiers to work (e.g. `hide`).
    modifiers: { preventOverflow: { boundariesElement: "window" } },
    popoverClassName: "docs-popover-portal-example-popover",
};

/** Scale rect of ratios to given client width & height. */
function scale(rect: ClientRect, { clientWidth, clientHeight }: ReferenceObject): ClientRect {
    const scaleW = (v: number) => Math.floor(v / 100 * clientWidth);
    const scaleH = (v: number) => Math.floor(v / 100 * clientHeight);
    return {
        bottom: scaleH(rect.bottom),
        height: scaleH(rect.height),
        left: scaleW(rect.left),
        right: scaleW(rect.right),
        top: scaleH(rect.top),
        width: scaleW(rect.width),
    };
}
