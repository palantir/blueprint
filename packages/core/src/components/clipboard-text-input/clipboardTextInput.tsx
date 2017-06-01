/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import * as classNames from "classnames";
import Clipboard = require("clipboard");
import * as Classes from "../../common/classes";
import { Position } from "../../common/position";
import { Tooltip } from "../tooltip/tooltip";
import { IProps } from "../../common/props";

export type TextDirection = "LTR" | "RTL";
export const TextDirection = {
    LTR: "LTR" as TextDirection,
    RTL: "RTL" as TextDirection
};

export interface IClipboardTextInputProps extends IProps {
    /**
     * Form value of the input.
     */
    contents: string;

    /**
     * Description of the text to be shown in the tooltip.
     */
    contentDescription?: string;

    /**
     * Set the direction CSS property to match the direction of the text.
     * @default TextDirection.LTR
     */
    textDirection?: TextDirection;

    /**
     * The position (relative to the target) at which the tooltip should appear.
     * @default Position.TOP
     */
    tooltipPosition?: Position;
}

export interface IClipboardTextInputState {
    clipboard: Clipboard;
    copied: boolean;
    open: boolean;
}

export class ClipboardTextInput extends React.Component<IClipboardTextInputProps, IClipboardTextInputState> {
    private static COUNTER = 0;

    public static defaultProps: IClipboardTextInputProps = {
        className: "",
        contentDescription: "",
        contents: null,
        textDirection: TextDirection.LTR,
        tooltipPosition: Position.TOP
    };

    private componentId: number;

    public state: IClipboardTextInputState = {
        clipboard: null,
        copied: false,
        open: false
    };

    public componentWillMount() {
        this.componentId = ClipboardTextInput.COUNTER + 1;
        ClipboardTextInput.COUNTER += 1;
    }

    public componentDidMount() {
        const clipboard = new Clipboard("#" + this.domId());
        clipboard.on("success", () => this.setState({copied: true} as IClipboardTextInputState));
        this.setState({ clipboard } as IClipboardTextInputState);
    }

    public componentWillUnmount() {
        if (this.state.clipboard) {
            this.state.clipboard.destroy();
        }
    }

    public render() {
        const { contentDescription } = this.props;
        const inputClass = classNames(Classes.INPUT,
                                      "clipboard-text",
                                      this.props.className,
                                      this.props.textDirection === TextDirection.LTR ? "ltr" : "rtl");
        const handleTooltipInteraction = (open: boolean) => this.setState({open, copied: false} as IClipboardTextInputState);
        const onClick = (event: any) => (event.target as HTMLInputElement).select();

        return (
            <div className="pt-control-group clearfix clipboard-text-input">
                <input
                    className={inputClass}
                    value={this.props.contents}
                    onClick={onClick}
                    readOnly={true}
                    type="text"
                />
                <Tooltip
                    content={this.state.copied ? "Copied!" : `Copy ${ contentDescription.trim() } to clipboard`}
                    hoverOpenDelay={0}
                    isOpen={this.state.open}
                    onInteraction={handleTooltipInteraction}
                    position={this.props.tooltipPosition}
                >
                    <button
                        className="clipboard-icon pt-button pt-icon-clipboard pt-icon-standard"
                        data-clipboard-text={this.props.contents}
                        id={this.domId()}
                    />
                </Tooltip>
            </div>
        );
    }

    private domId() {
        return "componentId-" + this.componentId;
    }
}

