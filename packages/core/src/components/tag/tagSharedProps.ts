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

export interface TagSharedProps {
    /**
     * Whether the tag should appear in an active state.
     *
     * @default false
     */
    active?: boolean;

    /**
     * Whether the tag should take up the full width of its container.
     *
     * @default false
     */
    fill?: boolean;

    /**
     * Whether the tag should visually respond to user interactions. If set to `true`, hovering over the
     * tag will change its color and mouse cursor.
     *
     * Recommended when `onClick` is also defined.
     *
     * @default false
     */
    interactive?: boolean;

    /**
     * Whether this tag should use large styles.
     *
     * @default false
     */
    large?: boolean;

    /**
     * Whether this tag should use minimal styles.
     *
     * @default false
     */
    minimal?: boolean;

    /**
     * Whether tag content should be allowed to occupy multiple lines.
     * If `false`, a single line of text will be truncated with an ellipsis if it overflows.
     * Note that icons will be vertically centered relative to multiline text.
     *
     * @default false
     */
    multiline?: boolean;

    /**
     * Callback invoked when the tag is clicked.
     * Recommended when `interactive` is `true`.
     */
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;

    /**
     * Whether this tag should have rounded ends.
     *
     * @default false
     */
    round?: boolean;
}
