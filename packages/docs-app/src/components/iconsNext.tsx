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

import { memo, useCallback, useMemo, useState } from "react";

import { Classes, Code, Dialog, DialogBody, H5, InputGroup, NonIdealState, Radio, RadioGroup } from "@blueprintjs/core";
import { CopyToClipboardButton, smartSearch, useTheme } from "@blueprintjs/docs-theme";
import { type SVGIconProps } from "@blueprintjs/icons";
import * as NextIcons from "@blueprintjs/icons/next";
import { nextIconManifest, type NextIconManifestEntry } from "@blueprintjs/icons/next";

type IconVariant = "outlined" | "filled";

const icons: readonly NextIconManifestEntry[] = nextIconManifest;

const HERO_SIZE = 64;
const SAMPLE_SIZES = [16, 24, 32, 48, 64];
const HERO_BACKGROUNDS = ["default", "primary", "dark"] as const;

export function IconsNext() {
    const [filter, setFilter] = useState("");
    const [variant, setVariant] = useState<IconVariant>("outlined");
    const [selectedIcon, setSelectedIcon] = useState<NextIconManifestEntry | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filteredIcons = useMemo(
        () => icons.filter(icon => matchesVariant(variant, icon) && matchesFilter(filter, icon)),
        [filter, variant],
    );

    const handleCardClick = useCallback((icon: NextIconManifestEntry) => {
        setSelectedIcon(icon);
        setIsDialogOpen(true);
    }, []);

    const iconCards = useMemo(
        () =>
            filteredIcons.map(icon => (
                <IconCard icon={icon} key={icon.name} onClick={handleCardClick} variant={variant} />
            )),
        [filteredIcons, handleCardClick, variant],
    );

    const handleVariantChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setVariant(event.currentTarget.value as IconVariant);
    }, []);

    const handleDialogClose = useCallback(() => setIsDialogOpen(false), []);

    return (
        <div className="docs-icons-next">
            <InputGroup
                autoFocus={true}
                className="docs-icons-next-search"
                fill={true}
                leftIcon="search"
                onValueChange={setFilter}
                placeholder="Search icons..."
                size="large"
                type="search"
                value={filter}
            />
            <div className="docs-icons-next-body">
                <div className="docs-icons-next-filter">
                    <H5>Filter by style</H5>
                    <RadioGroup onChange={handleVariantChange} selectedValue={variant}>
                        <Radio label="Outlined" value="outlined" />
                        <Radio label="Filled" value="filled" />
                    </RadioGroup>
                </div>
                <div className="docs-icons-next-results">
                    <div className={`docs-icons-next-count ${Classes.TEXT_MUTED}`}>
                        {filteredIcons.length} matching results
                    </div>
                    {filteredIcons.length === 0 ? (
                        <NonIdealState className={Classes.TEXT_MUTED} icon="zoom-out" description="No icons found" />
                    ) : (
                        <div className="docs-icon-next-grid">{iconCards}</div>
                    )}
                </div>
            </div>
            <IconDialog icon={selectedIcon} isOpen={isDialogOpen} onClose={handleDialogClose} variant={variant} />
        </div>
    );
}

interface IconCardProps {
    icon: NextIconManifestEntry;
    variant: IconVariant;
    onClick: (icon: NextIconManifestEntry) => void;
}

const IconCard = memo(function IconCard({ icon, onClick, variant }: IconCardProps) {
    const { name } = icon;
    const displayName = kebabToPascal(name);
    const IconComponent = getIconComponent(name, variant);
    const handleClick = useCallback(() => onClick(icon), [icon, onClick]);

    return (
        <button className="docs-icon-next-card" onClick={handleClick} type="button">
            <span className="docs-icon-next-glyph">
                {IconComponent != null ? <IconComponent size={24} /> : <span className={Classes.TEXT_MUTED}>N/A</span>}
            </span>
            <span className="docs-icon-next-name" title={displayName}>
                {displayName}
            </span>
        </button>
    );
});

interface IconDialogProps {
    icon: NextIconManifestEntry | undefined;
    isOpen: boolean;
    variant: IconVariant;
    onClose: () => void;
}

function IconDialog({ icon, isOpen, onClose, variant }: IconDialogProps) {
    const { isDarkTheme } = useTheme();

    if (icon == null) {
        return null;
    }

    const { name } = icon;
    const displayName = kebabToPascal(name);
    const exportName = getExportName(name, variant);
    const importStatement = `import { ${exportName} } from "@blueprintjs/icons/next";`;
    const usage = `<${exportName} />`;
    const IconComponent = getIconComponent(name, variant);

    return (
        <Dialog
            className="docs-icons-next-dialog"
            isOpen={isOpen}
            onClose={onClose}
            portalClassName={isDarkTheme ? Classes.DARK : undefined}
            title={displayName}
        >
            <DialogBody>
                <div className="docs-icons-next-dialog-heroes">
                    {HERO_BACKGROUNDS.map(background => (
                        <div
                            className={`docs-icons-next-dialog-hero docs-icons-next-dialog-hero-${background}`}
                            key={background}
                        >
                            {IconComponent != null ? <IconComponent size={HERO_SIZE} /> : null}
                        </div>
                    ))}
                </div>
                <div className="docs-icons-next-dialog-section-label">Sizes</div>
                <div className="docs-icons-next-dialog-sizes">
                    {SAMPLE_SIZES.map(size => (
                        <div className="docs-icons-next-dialog-size" key={size}>
                            {IconComponent != null ? <IconComponent size={size} /> : null}
                            <span className={`docs-icons-next-dialog-size-label ${Classes.TEXT_MUTED}`}>{size}</span>
                        </div>
                    ))}
                </div>
                <CopyableCode label="Import" value={importStatement} />
                <CopyableCode label="Usage" value={usage} />
            </DialogBody>
        </Dialog>
    );
}

const CopyableCode = memo(function CopyableCode({ label, value }: { label: string; value: string }) {
    return (
        <div className="docs-icons-next-code">
            <div className="docs-icons-next-code-header">
                <div className={`docs-icons-next-code-label ${Classes.TEXT_MUTED}`}>{label}</div>
                <CopyToClipboardButton text={value} variant="minimal" />
            </div>
            <Code className="docs-icons-next-code-block">{value}</Code>
        </div>
    );
});

function getIconComponent(name: string, variant: IconVariant) {
    const exportName = getExportName(name, variant);
    return NextIcons[exportName as keyof typeof NextIcons] as React.FC<SVGIconProps> | undefined;
}

function getExportName(name: string, variant: IconVariant) {
    return `${kebabToPascal(name)}${variant === "filled" ? "FilledIcon" : "Icon"}`;
}

function matchesVariant(variant: IconVariant, icon: NextIconManifestEntry) {
    return variant === "outlined" || icon.hasFilled;
}

function matchesFilter(filter: string, icon: NextIconManifestEntry) {
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
