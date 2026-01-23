"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
    Button,
    AnchorButton,
    ButtonGroup,
    Callout,
    Card,
    Icon,
    Tag,
    Tooltip,
    Intent,
    Classes,
} from "./blueprint-client";

// Provide Blueprint components to the live editor scope
const scope = {
    Button,
    Intent,
    Classes,
    AnchorButton,
    ButtonGroup,
    Callout,
    Card,
    Icon,
    Tag,
    Tooltip,
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
