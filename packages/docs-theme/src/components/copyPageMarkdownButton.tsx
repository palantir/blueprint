/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { AnchorButton, Tooltip } from "@blueprintjs/core";

export interface CopyPageMarkdownButtonProps {
    /** Markdown source of the current page. The button is hidden if undefined. */
    sourceMarkdown?: string;
}

/**
 * Action button for copying the current docs page as markdown to the clipboard.
 * Useful for handing the page to an LLM, IDE, or codegen tool.
 */
export const CopyPageMarkdownButton: React.FC<CopyPageMarkdownButtonProps> = ({ sourceMarkdown }) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const handleClick = useCallback(() => {
        if (sourceMarkdown == null) {
            return;
        }
        void navigator.clipboard.writeText(sourceMarkdown);
        setCopied(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    }, [sourceMarkdown]);

    if (sourceMarkdown == null) {
        return null;
    }

    return (
        <Tooltip content={copied ? "Copied!" : "Copy this page as markdown"} hoverOpenDelay={300} position="top">
            <AnchorButton
                aria-label="Copy page as markdown"
                icon={copied ? "tick" : "clipboard"}
                onClick={handleClick}
                text="Copy page"
                variant="minimal"
            />
        </Tooltip>
    );
};
