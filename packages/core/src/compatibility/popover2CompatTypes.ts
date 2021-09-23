/*
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

/**
 * @fileoverview Types for Popover2 which allow us to provide some level of
 * forward-compatibility for core v3 components which reference PopoverProps,
 * since those will become Popover2Props in v4.
 *
 * We don't want to introduce a `@blueprintjs/popover2` dependency in this package,
 * so we duplicate those types here until v4.0, at which point this file can be
 * deleted.
 */

import type { Boundary, Placement, RootBoundary, StrictModifiers } from "@popperjs/core";

import type { Props } from "../common/props";
import type { OverlayableProps } from "../components/overlay/overlay";
import type { IPopoverProps } from "../components/popover/popover";

/**
 * Intended for use in components besides Popover & Tooltip which reference PopoverProps
 * and therefore do not otherwise have a migration path to Popover2Props, including:
 * - core
 *   - Breadcrumbs
 *   - MenuItem
 * - datetime
 *   - DateInput
 *   - DateRangeInput
 * - select
 *   - MultiSelect
 *   - Select
 *   - Suggest
 * - timezone
 *   - TimezonePicker
 *
 * Notes on some props excluded from this type:
 * - Some props will already be defined in places where this type is used; they should
 *   not be overriden because the parent component will control them:
 *   - content
 *   - target
 *   - interactionKind
 *   - defaultIsOpen
 *   - isOpen
 * - Some props do not apply because the parent components never use hover interactions:
 *   - hoverCloseDelay
 *   - hoverOpenDelay
 * - Some props exist in Popover2 but not in Popover, so it doesn't make sense to add
 *   them here (consumers can customize them in Blueprint v4, but it's unlikely they
 *   will ever need to do so anyway):
 *   - positioningStrategy
 * - Some props exist in both Popover and Popover2 and have different semantics; here,
 *   we choose the v2 versions (they're usually assignable to each other, though):
 *   - placement
 * - Finally, some props are unsupported in Popover2 and users will need to find an alternative
 *   approach for their use case of these props:
 *   - targetClassName,
 *   - targetProps,
 *   - targetTagName
 *
 */
export type Popover2CompatProps = Props &
    OverlayableProps &
    Pick<
        IPopoverProps,
        | "backdropProps"
        | "fill"
        | "hasBackdrop"
        | "popoverRef"
        | "captureDismiss"
        | "disabled"
        | "inheritDarkTheme"
        | "minimal"
        | "onInteraction"
        | "openOnTargetFocus"
        | "popoverClassName"
        | "position"
        | "usePortal"
    > & {
        boundary?: Boundary;
        modifiers?: Partial<
            {
                [M in StrictModifierNames]: Partial<Omit<StrictModifier<M>, "name">>;
            }
        >;
        placement?: Placement;
        rootBoundary?: RootBoundary;
    };

// copied from @popperjs/core, where it is not exported as public
export type StrictModifierNames = NonNullable<StrictModifiers["name"]>;
// copied from react-popper v2, because we can't depend on both v1 and v2
type UnionWhere<U, M> = U extends M ? U : never;
export type StrictModifier<Name extends StrictModifierNames = StrictModifierNames> = UnionWhere<
    StrictModifiers,
    { name?: Name }
>;
