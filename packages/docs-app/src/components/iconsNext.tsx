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

import { useMemo, useState } from "react";

import { Classes, H3, InputGroup, NonIdealState } from "@blueprintjs/core";
import { smartSearch } from "@blueprintjs/docs-theme";
import type { SVGIconProps } from "@blueprintjs/icons";
import * as NextIcons from "@blueprintjs/icons/next";
import { nextIconManifest, type NextIconManifestEntry } from "@blueprintjs/icons/next";

const icons: readonly NextIconManifestEntry[] = nextIconManifest;

export function IconsNext() {
    const [filter, setFilter] = useState("");

    const filteredIcons = useMemo(() => icons.filter(icon => filterIcon(filter, icon)), [filter]);
    const iconCards = filteredIcons.map(icon => <IconCard icon={icon} key={icon.name} />);

    return (
        <div className="docs-icons">
            <InputGroup
                autoFocus={true}
                fill={true}
                leftIcon="search"
                onValueChange={setFilter}
                placeholder="Search icons..."
                size="large"
                type="search"
                value={filter}
            />
            {filteredIcons.length === 0 ? (
                <NonIdealState className={Classes.TEXT_MUTED} icon="zoom-out" description="No next icons found" />
            ) : (
                <IconGrid iconCards={iconCards} />
            )}
        </div>
    );
}

function IconGrid({ iconCards }: { iconCards: React.ReactNode[] }) {
    return (
        <div className="docs-icon-group">
            <H3>Next icons</H3>
            {iconCards}
        </div>
    );
}

function IconCard({ icon }: { icon: NextIconManifestEntry }) {
    const { name, hasFilled } = icon;
    const outlinedExportName = `${kebabToPascal(name)}Icon`;
    const filledExportName = `${kebabToPascal(name)}FilledIcon`;
    const OutlinedIcon = NextIcons[outlinedExportName as keyof typeof NextIcons] as React.FC<SVGIconProps> | undefined;
    const FilledIcon = NextIcons[filledExportName as keyof typeof NextIcons] as React.FC<SVGIconProps> | undefined;

    return (
        <div className="docs-icon-container">
            <div className="docs-icon">
                {OutlinedIcon != null ? <OutlinedIcon size={20} /> : <span className={Classes.TEXT_MUTED}>N/A</span>}
                <div className="docs-icon-name">{name}</div>
                <div className="docs-icon-detail">
                    <p className="docs-code">{`<${outlinedExportName} size={16} />`}</p>
                    <div className={Classes.TEXT_MUTED}>
                        {hasFilled && FilledIcon != null ? `<${filledExportName} /> available` : "no filled variant"}
                    </div>
                </div>
            </div>
        </div>
    );
}

function filterIcon(filter: string, icon: NextIconManifestEntry) {
    if (filter === "") {
        return true;
    }
    return smartSearch(filter, icon.name, ...icon.tags);
}

function kebabToPascal(value: string) {
    return value
        .split("-")
        .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join("");
}
