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

import type { Tag } from "@documentalist/client";
import { useContext } from "react";

import { COMPONENT_DISPLAY_NAMESPACE } from "../common";
import { DocumentationContext } from "../common/context";

export const SeeTag: React.FC<Tag> = ({ value }) => {
    const { renderType } = useContext(DocumentationContext);
    return <p>See: {renderSeeTagValue(value) ?? renderType(value)}</p>;
};
SeeTag.displayName = `${COMPONENT_DISPLAY_NAMESPACE}.SeeTag`;

function renderSeeTagValue(value: string) {
    const link = getSeeTagLink(value);
    if (link == null) {
        return undefined;
    }

    return <a href={link.href}>{link.text}</a>;
}

function getSeeTagLink(value: string) {
    const trimmedValue = value.trim();
    const linkTagMatch = trimmedValue.match(/^\{@link\s+([^}\s]+)(?:\s+([^}]+))?\}$/);
    const linkValue = linkTagMatch?.[1] ?? trimmedValue;

    if (!isHttpLink(linkValue)) {
        return undefined;
    }

    return { href: linkValue, text: linkTagMatch?.[2] ?? linkValue };
}

function isHttpLink(value: string) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}
