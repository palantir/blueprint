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

export { Icons, type IconLoaderOptions, type IconPathsLoader } from "./iconLoader";
export type { DefaultSVGIconAttributes, DefaultSVGIconProps, SVGIconAttributes, SVGIconProps } from "./svgIconProps";
export { SVGIconContainer, type SVGIconContainerComponent, type SVGIconContainerProps } from "./svgIconContainer";
export { getIconContentString, IconCodepoints } from "./iconCodepoints";
export { type IconName, IconNames } from "./iconNames";
export { IconSize, type IconPaths } from "./iconTypes";
