/*
 * Copyright 2024 Palantir Technologies, Inc. All rights reserved.
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

import { useCallback, useId } from "react";

import { IconSize } from "@blueprintjs/icons";
import { XSmallIcon } from "@blueprintjs/icons/next";

import { Classes, DISPLAYNAME_PREFIX } from "../../common";

import type { CompoundTagProps } from "./compoundTag";
import type { TagProps } from "./tag";

export type TagRemoveButtonProps = (CompoundTagProps | TagProps) & {
    /**
     * Space-separated IDs of the elements holding the tag's text. The button's accessible name becomes "Remove tag"
     * followed by that text, e.g. "Remove tag London". When empty, the name is just "Remove tag".
     */
    contentIds: string;
};

export const TagRemoveButton = ({ contentIds, ...props }: TagRemoveButtonProps) => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const { className, large, onRemove, size, tabIndex } = props;
    const buttonId = useId();
    const isLarge = large || size === "large" || className?.includes(Classes.LARGE);
    const handleRemoveClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            onRemove?.(e, props as any);
        },
        [onRemove, props],
    );
    return (
        <button
            id={buttonId}
            aria-label="Remove tag"
            aria-labelledby={contentIds ? `${buttonId} ${contentIds}` : undefined}
            type="button"
            className={Classes.TAG_REMOVE}
            onClick={handleRemoveClick}
            tabIndex={tabIndex}
        >
            <XSmallIcon size={isLarge ? IconSize.LARGE : IconSize.STANDARD} />
        </button>
    );
};
TagRemoveButton.displayName = `${DISPLAYNAME_PREFIX}.TagRemoveButton`;
