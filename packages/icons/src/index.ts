/*
 * Copyright 2022 Palantir Technologies, Inc. All rights reserved.
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

// N.B. these named imports will trigger bundlers to statically loads all icon path modules
export { IconSvgPaths16, IconSvgPaths20, getIconPaths } from "./allPaths";

export { Icons, IconLoaderOptions, IconPathsLoader } from "./iconLoader";
export { SVGIconProps } from "./svgIconProps";
export { SVGIconContainer, SVGIconContainerProps } from "./svgIconContainer";
export { getIconContentString, IconCodepoints } from "./iconCodepoints";
export { IconName, IconNames } from "./iconNames";
export { IconSize, IconPaths } from "./iconTypes";
