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

import type { MaybeElement } from "../../common/props";
import type { IconName } from "../icon/icon";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface TreeNodeInfo<T = {}> {
    /**
     * A space-delimited list of class names for this tree node element.
     */
    className?: string;

    /**
     * Child tree nodes of this node.
     */
    childNodes?: Array<TreeNodeInfo<T>>;

    /**
     * Whether this tree node is non-interactive. Enabling this prop will ignore
     * mouse event handlers (in particular click, down, enter, leave).
     */
    disabled?: boolean;

    /**
     * Whether the caret to expand/collapse a node should be shown.
     * If not specified, this will be true if the node has children and false otherwise.
     */
    hasCaret?: boolean;

    /**
     * The name of a Blueprint icon (or an icon element) to render next to the node's label.
     */
    icon?: IconName | MaybeElement;

    /**
     * A unique identifier for the node.
     */
    id: string | number;

    /**
     */
    isExpanded?: boolean;

    /**
     * Whether this node is selected.
     *
     * @default false
     */
    isSelected?: boolean;

    /**
     * The main label for the node.
     */
    label: string | JSX.Element;

    /**
     * A secondary label/component that is displayed at the right side of the node.
     */
    secondaryLabel?: string | MaybeElement;

    /**
     * An optional custom user object to associate with the node.
     * This property can then be used in the `onClick`, `onContextMenu` and `onDoubleClick`
     * event handlers for doing custom logic per node.
     */
    nodeData?: T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type TreeEventHandler<T = {}> = (
    node: TreeNodeInfo<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void;
