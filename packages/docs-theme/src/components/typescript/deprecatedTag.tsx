/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Intent, Tag } from "@blueprintjs/core";

export const DeprecatedTag: React.FunctionComponent<{ isDeprecated: boolean | string | undefined }> = ({
    isDeprecated,
}) => {
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
