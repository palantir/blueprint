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

import type { PropsWithChildren } from "react";

export const Header: React.FC<PropsWithChildren> = ({ children }) => (
    <header className={"docs-header"}>
        <div className="docs-header-container">{children}</div>
    </header>
);

export const HeaderLeft: React.FC<PropsWithChildren> = ({ children }) => (
    <div className={"docs-header-left"}>{children}</div>
);

export const HeaderCenter: React.FC<PropsWithChildren> = ({ children }) => (
    <div className={"docs-header-center"}>{children}</div>
);

export const HeaderRight: React.FC<PropsWithChildren> = ({ children }) => (
    <div className={"docs-header-right"}>{children}</div>
);
