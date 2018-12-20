/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Alignment, Button, ButtonGroup } from "@blueprintjs/core";
import * as React from "react";

export interface IAlignSelectProps {
    align: Alignment | undefined;
    allowCenter?: boolean;
    label?: string;
    onChange: (align: Alignment) => void;
}

export class AlignmentSelect extends React.PureComponent<IAlignSelectProps> {
    public render() {
        const { align, allowCenter = true, label = "Align text" } = this.props;
        return (
            <div>
                {label}
                <ButtonGroup fill={true} style={{ marginTop: 5 }}>
                    <Button active={align === Alignment.LEFT} text="Left" onClick={this.handleAlignLeft} />
                    {allowCenter && (
                        <Button
                            active={align == null || align === Alignment.CENTER}
                            text="Center"
                            onClick={this.handleAlignCenter}
                        />
                    )}
                    <Button active={align === Alignment.RIGHT} text="Right" onClick={this.handleAlignRight} />
                </ButtonGroup>
            </div>
        );
    }

    private handleAlignLeft = () => this.props.onChange(Alignment.LEFT);
    private handleAlignCenter = () => this.props.onChange(Alignment.CENTER);
    private handleAlignRight = () => this.props.onChange(Alignment.RIGHT);
}
