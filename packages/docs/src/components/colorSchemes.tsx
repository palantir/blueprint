/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0
 */

import * as chroma from "chroma-js";
import * as classNames from "classnames";
import * as PureRender from "pure-render-decorator";
import * as React from "react";

import { Keys, RadioGroup } from "@blueprint/core";

import { createKeyEventHandler } from "../common/utils";
import { handleNumberChange } from "../examples/baseExample";
import { ColorBar } from "./colorPalettes";

const MIN_STEPS = 3;
const MAX_STEPS = 20;

const QUALITATIVE = [
    "cobalt3", "forest3", "gold3", "vermilion3", "violet3",
    "turquoise3", "rose3", "lime3", "sepia3", "indigo3",
];

const SINGLE_HUE = [
    ["#FFB7A5", "#9E2B0E"],
    ["#ffb3d0", "#a82255"],
    ["#e1bae1", "#5c255c"],
    ["#d6ccff", "#5642a6"],
    ["#b3cfff", "#1f4b99"],
    ["#97f3eb", "#008075"],
    ["#b1ecb5", "#1d7324"],
    ["#e8f9b6", "#728c23"],
    ["#ffe4a0", "#a67908"],
    ["#e4cbb2", "#63411e"],
];

const SEQUENTIAL = [
    ["#ffc940", "#D9822B", "#9e2b0e"],
    ["#ffe39f", "#D9822B", "#9e2b0e"],
    ["#ffeec5", "#DB2C6F", "#5c255c"],
    ["#ffe39f", "#00B3A4", "#1f4b99"],
    ["#cff3d2", "#00B3A4", "#1f4b99"],
    ["#ffe39f", "#00B3A4", "#1d7324"],
    ["#e8f8b6", "#00B3A4", "#1d7324"],
    ["#d1e1ff", "#7157D9", "#1f4b99"],
    ["#d1e1ff", "#7157D9", "#5c255c"],
    ["#e1bae1", "#DB2C6F", "#5c255c"],
];

const DIVERGING = [
    ["#1F4B99", "#00B3A4", "#FFE39F", "#D9822B", "#9E2B0E"],
    ["#1F4B99", "#00B3A4", "#FFFFFF", "#D9822B", "#9E2B0E"],
    ["#1D7324", "#9BBF30", "#FFE39F", "#00B3A4", "#1F4B99"],
    ["#1D7324", "#9BBF30", "#FFFFFF", "#00B3A4", "#1F4B99"],
];

export interface IColorSchemeProps {
    schemes: { label: string; palettes: string[][]; diverging?: boolean; }[];
    steps?: number;
}

export interface IColorSchemeState {
    activePalette?: number;
    activeSchema?: number;
    steps?: number;
}

@PureRender
export class ColorScheme extends React.Component<IColorSchemeProps, IColorSchemeState> {
    public state: IColorSchemeState = {
        activePalette: 0,
        activeSchema: 0,
        steps: this.props.steps || 5,
    };

    private handleStepChange = handleNumberChange((steps) => {
        this.setState({ steps: Math.max(MIN_STEPS, Math.min(MAX_STEPS, steps)) });
    });

    private handleSchemaChange = handleNumberChange((activeSchema) => this.setState({
        activePalette: 0,
        activeSchema,
    }));

    public render () {
        const schema = this.props.schemes[this.state.activeSchema];
        const currentPalettes = schema.palettes.map((palette, index) => {
            return this.renderPalette(palette, index, schema.diverging);
        });

        const generatedColors = this.generateColorPalette(schema.palettes[this.state.activePalette], schema.diverging);

        return (
            <div className="docs-color-scheme">
                {this.renderRadioGroup()}
                <div className="docs-color-book">{currentPalettes}</div>
                <label className="pt-label pt-inline docs-color-scheme-label">
                    Step count
                    <input
                        className="pt-input"
                        type="number"
                        dir="auto"
                        value={this.state.steps.toString()}
                        onChange={this.handleStepChange}
                        min={MIN_STEPS}
                        max={MAX_STEPS}
                    />
                </label>
                <ColorBar colors={generatedColors} />
            </div>
        );
    }

    private handlePaletteChange = (key: number) => {
        this.setState({ activePalette: key });
    };

    private renderRadioGroup () {
        if (this.props.schemes.length === 1) { return undefined; };

        const OPTIONS  = this.props.schemes.map((scheme, index) => {
            return { className: "pt-inline", label: scheme.label, value: index.toString() };
        });

        return(
            <RadioGroup
                key="activeSchema"
                name="activeSchema"
                className="docs-color-scheme-radios"
                label="Select a color scheme"
                options={OPTIONS}
                onChange={this.handleSchemaChange}
                selectedValue={this.state.activeSchema.toString()}
            />
        );
    }

    private generateColorPalette = (basePalette: string[], diverging?: boolean, steps = this.state.steps) => {
        if (diverging) {
            // Split the basePalette into left and right, including the middle color in both.
            // Create individual bezier scales for each side. We'll choose which to use later.
            const leftColors = chroma.bezier(basePalette.slice(0, 3)).scale().mode("lab").correctLightness(true);
            const rightColors = chroma.bezier(basePalette.slice(2, 5)).scale().mode("lab").correctLightness(true);

            let result: string[] = [];
            for (let i = 0; i < steps; i++) {
                // Calculate the position of the step as a value between 0 and 1.
                // If it's below 0.5 use the left color scale, otherwise use right scale.
                const t = i / (steps - 1);
                result.push((t < 0.5) ? leftColors(t * 2).hex() : rightColors(t * 2 - 1).hex());
            }
            return result;
        } else {
            return chroma.bezier(basePalette).scale().correctLightness(true).colors(steps);
        }
    }

    private renderPalette (palette: string[], key: number, diverging?: boolean) {
        const colors = this.generateColorPalette(palette, diverging, 5);
        const swatches = colors.map((hex: string, i: number) => (
            <div className="docs-color-swatch" key={i} style={{ backgroundColor: hex }} />
        ));

        const classes = classNames("docs-color-palette", {
            selected: key === this.state.activePalette,
        });
        const clickHandler = this.handlePaletteChange.bind(this, key);
        const keyDownHandler = createKeyEventHandler({
            [Keys.SPACE]: clickHandler,
            [Keys.ENTER]: clickHandler,
        }, true);

        return (
            <div className={classes} key={key} onClick={clickHandler} onKeyDown={keyDownHandler} tabIndex={0}>
                {swatches}
            </div>
        );
    };
}

export const QualitativeSchemePalette: React.SFC<{}> = () => <ColorBar colors={QUALITATIVE} />;

export const SequentialSchemePalette: React.SFC<{}> = () => {
    const schemes = [
        { label: "Single hue", palettes: SINGLE_HUE },
        { label: "Multi-hue", palettes: SEQUENTIAL },
    ];
    return <ColorScheme schemes={ schemes } />;
};

export const DivergingSchemePalette: React.SFC<{}> = () => {
    const schemes = [
        { diverging: true, label: "Diverging", palettes: DIVERGING },
    ];
    return <ColorScheme schemes={ schemes } />;
};
