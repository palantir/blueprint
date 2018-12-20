/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Intent, Tag } from "@blueprintjs/core";
import * as React from "react";

export const DeprecatedTag: React.SFC<{ isDeprecated: boolean | string | undefined }> = ({ isDeprecated }) => {
    if (isDeprecated === true || typeof isDeprecated === "string") {
        return (
            <Tag intent={Intent.DANGER} minimal={true}>
                {typeof isDeprecated === "string" ? (
                    <span dangerouslySetInnerHTML={markdownCode(`Deprecated: ${isDeprecated}`)} />
                ) : (
                    "Deprecated"
                )}
            </Tag>
        );
    }
    return null;
};
DeprecatedTag.displayName = "Docs2.DeprecatedTag";

/**
 * Minimal markdown renderer that supports only backtick `code` elements and triple-backtick `pre` elements.
 * Does not provide any syntax highlighting.
 */
function markdownCode(text: string) {
    return {
        __html: text
            .replace("<", "&lt;")
            .replace(/```([^`]+)```/g, (_, code) => `<pre>${code}</pre>`)
            .replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`),
    };
}
