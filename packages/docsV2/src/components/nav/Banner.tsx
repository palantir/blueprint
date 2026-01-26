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

import classNames from "classnames";

import { Classes, Intent, type Props } from "@blueprintjs/core";

export interface BannerProps extends Props {
    children?: React.ReactNode;
    href: string;
    intent?: Intent;
}

export const Banner: React.FC<BannerProps> = ({ children, className, href, intent = Intent.PRIMARY }) => {
    const classes = classNames("docs-banner", Classes.intentClass(intent), className);
    return (
        <div className={classes} role="banner">
            <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        </div>
    );
};
