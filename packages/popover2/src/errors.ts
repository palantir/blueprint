/**
 * Copyright 2021 Palantir Technologies, Inc. All rights reserved.
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

const ns = "[Blueprint]";

export const POPOVER2_REQUIRES_TARGET = `${ns} <Popover2> requires renderTarget prop or a child element.`;
export const POPOVER2_HAS_BACKDROP_INTERACTION = `${ns} <Popover2 hasBackdrop={true}> requires interactionKind="click".`;
export const POPOVER2_WARN_TOO_MANY_CHILDREN = `${ns} <Popover2> supports only one child which is rendered as its target; additional children are ignored.`;
export const POPOVER2_WARN_DOUBLE_TARGET =
    ns + ` <Popover2> with children ignores renderTarget prop; use either prop or children.`;
export const POPOVER2_WARN_EMPTY_CONTENT = ns + ` Disabling <Popover2> with empty/whitespace content...`;
export const POPOVER2_WARN_HAS_BACKDROP_INLINE = ns + ` <Popover2 usePortal={false}> ignores hasBackdrop`;
export const POPOVER2_WARN_PLACEMENT_AND_POSITION_MUTEX =
    ns + ` <Popover2> supports either placement or position prop, not both.`;
export const POPOVER2_WARN_UNCONTROLLED_ONINTERACTION = ns + ` <Popover2> onInteraction is ignored when uncontrolled.`;
