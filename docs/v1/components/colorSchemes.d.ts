/// <reference types="react" />
import * as React from "react";
export interface IColorSchemeProps {
    schemes: Array<{
        label: string;
        palettes: string[][];
        diverging?: boolean;
    }>;
    steps?: number;
}
export interface IColorSchemeState {
    activePalette?: number;
    activeSchema?: number;
    steps?: number;
}
export declare class ColorScheme extends React.PureComponent<IColorSchemeProps, IColorSchemeState> {
    state: IColorSchemeState;
    private handleStepChange;
    private handleSchemaChange;
    render(): JSX.Element;
    private handlePaletteChange;
    private renderRadioGroup();
    private generateColorPalette;
    private renderPalette(palette, key, diverging?);
}
export declare const QualitativeSchemePalette: React.SFC<{}>;
export declare const SequentialSchemePalette: React.SFC<{}>;
export declare const DivergingSchemePalette: React.SFC<{}>;
