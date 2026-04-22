/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
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

import { DISPLAYNAME_PREFIX } from "../../common";
import { Breadcrumbs, type BreadcrumbsProps } from "../breadcrumbs/breadcrumbs";

export type BreadcrumbsNextProps = Omit<BreadcrumbsProps, "popoverProps">;

/**
 * BreadcrumbsNext component.
 *
 * Thin wrapper around `Breadcrumbs` that omits the `popoverProps` prop.
 *
 * @see https://blueprintjs.com/docs/#core/components/breadcrumbs
 */
export const BreadcrumbsNext: React.FC<BreadcrumbsNextProps> = props => {
    return <Breadcrumbs {...props} />;
};

BreadcrumbsNext.displayName = `${DISPLAYNAME_PREFIX}.BreadcrumbsNext`;
