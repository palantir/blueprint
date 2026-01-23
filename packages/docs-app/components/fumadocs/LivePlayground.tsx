"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as Blueprint from "@blueprintjs/core";

// Provide Blueprint components to the live editor scope
const scope = {
    ...Blueprint,
    // Common re-exports for convenience
    Button: Blueprint.Button,
    Intent: Blueprint.Intent,
    Classes: Blueprint.Classes,
    AnchorButton: Blueprint.AnchorButton,
    ButtonGroup: Blueprint.ButtonGroup,
    Callout: Blueprint.Callout,
    Card: Blueprint.Card,
    Icon: Blueprint.Icon,
    Tag: Blueprint.Tag,
    Tooltip: Blueprint.Tooltip,
};

export interface LivePlaygroundProps {
    code: string;
}

export function LivePlayground({ code }: LivePlaygroundProps) {
    return (
        <div className="docs-live-playground">
            <LiveProvider code={code.trim()} scope={scope}>
                <div className="docs-live-preview">
                    <LivePreview />
                </div>
                <LiveError className="docs-live-error" />
                <LiveEditor className="docs-live-editor" />
            </LiveProvider>
        </div>
    );
}
