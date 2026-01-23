"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Button, Pre, Tooltip } from "./blueprint-client";

export interface CodeExampleProps {
    children: ReactNode;
    previewCode: string;
    sourceCode: string;
    id: string;
}

export function CodeExample({ children, previewCode, sourceCode, id }: CodeExampleProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const copyToClipboard = useCallback(() => {
        const codeToCopy = isExpanded ? sourceCode : previewCode;
        navigator.clipboard.writeText(codeToCopy);
    }, [isExpanded, previewCode, sourceCode]);

    const displayCode = isExpanded ? sourceCode : previewCode;

    return (
        <div className="docs-code-example-frame" data-example-id={id}>
            <div className="docs-code-example">{children}</div>
            <div className="docs-code-example-toolbar">
                <Tooltip content={isExpanded ? "Show preview" : "Show full source"} hoverOpenDelay={300}>
                    <Button
                        icon={isExpanded ? "minimize" : "maximize"}
                        minimal
                        small
                        onClick={toggleExpanded}
                        aria-label={isExpanded ? "Show preview code" : "Show full source code"}
                    />
                </Tooltip>
                <Tooltip content="Copy to clipboard" hoverOpenDelay={300}>
                    <Button
                        icon="duplicate"
                        minimal
                        small
                        onClick={copyToClipboard}
                        aria-label="Copy code to clipboard"
                    />
                </Tooltip>
            </div>
            <Pre className="docs-code-block" data-lang="tsx">
                {displayCode.trim()}
            </Pre>
        </div>
    );
}
