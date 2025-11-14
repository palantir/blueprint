/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import kebabCase from "lodash/kebabCase";
import { useCallback, useEffect, useState } from "react";

import { Classes, type IconName } from "@blueprintjs/core";
import { SVGIconContainer } from "@blueprintjs/icons";
import { Flex } from "@blueprintjs/labs";

import { ButtonSection } from "./components/ButtonSection";
import { CalloutSection } from "./components/CalloutSection";
import { CompoundTagSection } from "./components/CompoundTagSection";
import { FontSection } from "./components/FontSection";
import { IconPreview } from "./components/IconPreview";
import { InputGroupSection } from "./components/InputGroupSection";
import { MenuSection } from "./components/MenuSection";
import { Navigation } from "./components/Navigation";
import { TabsSection } from "./components/TabsSection";
import { TagSection } from "./components/TagSection";

interface CustomIconData {
    isActive: boolean;
    name: string;
    originalViewBox: string;
    paths: string[];
}

/**
 * Parse an SVG file and extract path data for rendering as a Blueprint icon
 */
const parseSVGFile = (file: File): Promise<CustomIconData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            const svgText = e.target?.result as string;
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

            // Check for parse errors
            const parserError = svgDoc.querySelector("parsererror");
            if (parserError) {
                reject(new Error("Invalid SVG file"));
                return;
            }

            const svgElement = svgDoc.querySelector("svg");
            if (!svgElement) {
                reject(new Error("No SVG element found"));
                return;
            }

            // Extract viewBox
            const viewBox = svgElement.getAttribute("viewBox") || "0 0 16 16";

            // Extract all path elements
            const pathElements = svgDoc.querySelectorAll("path");
            const paths = Array.from(pathElements)
                .map(path => path.getAttribute("d") || "")
                .filter(d => d.length > 0);

            if (paths.length === 0) {
                reject(new Error("No paths found in SVG"));
                return;
            }

            resolve({
                isActive: true,
                name: kebabCase(file.name.replace(/\.svg$/i, "")),
                originalViewBox: viewBox,
                paths,
            });
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
};

export const IconPlayground = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<IconName>("home");
    const [fontFamily, setFontFamily] = useState<string | undefined>(
        "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, blueprint-icons-16, sans-serif",
    );
    const [fontWeight, setFontWeight] = useState(400);
    const [fontSize, setFontSize] = useState(100);
    const [customIconData, setCustomIconData] = useState<CustomIconData | null>(null);

    const handleToggleDarkTheme = useCallback(() => setDarkTheme(prev => !prev), []);

    const handleCustomIconUpload = useCallback((data: CustomIconData) => {
        setCustomIconData(data);
    }, []);

    const handleCustomIconClear = useCallback(() => {
        setCustomIconData(null);
    }, []);

    // Update CSS variables on document root
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--icon-font-family",
            fontFamily ??
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, blueprint-icons-16, sans-serif",
        );
        document.documentElement.style.setProperty("--icon-font-weight", String(fontWeight));
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [fontFamily, fontWeight, fontSize]);

    // Compute the effective icon to use (custom or selected)
    const effectiveIcon: IconName | React.JSX.Element =
        customIconData?.isActive === true ? (
            <SVGIconContainer
                iconName={customIconData.name as IconName}
                svgProps={{ viewBox: customIconData.originalViewBox } as React.SVGAttributes<SVGElement>}
            >
                {customIconData.paths.map((d, i) => (
                    <path d={d} fillRule="evenodd" key={i} />
                ))}
            </SVGIconContainer>
        ) : (
            selectedIcon
        );

    return (
        <div className={darkTheme ? Classes.DARK : ""}>
            <Navigation darkTheme={darkTheme} onToggleDarkTheme={handleToggleDarkTheme} />
            <Flex flexDirection="column" gap={2} padding={5}>
                <FontSection
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    fontSize={fontSize}
                    onFontFamilyChange={setFontFamily}
                    onFontWeightChange={setFontWeight}
                    onFontSizeChange={setFontSize}
                />
                <IconPreview
                    customIconData={customIconData}
                    onCustomIconClear={handleCustomIconClear}
                    onCustomIconUpload={handleCustomIconUpload}
                    onIconSelect={setSelectedIcon}
                    parseSVGFile={parseSVGFile}
                    selectedIcon={selectedIcon}
                />
                <ButtonSection selectedIcon={effectiveIcon} />
                <CalloutSection selectedIcon={effectiveIcon} />
                <MenuSection selectedIcon={effectiveIcon} />
                <TabsSection selectedIcon={effectiveIcon} />
                <TagSection selectedIcon={effectiveIcon} />
                <CompoundTagSection selectedIcon={effectiveIcon} />
                <InputGroupSection selectedIcon={effectiveIcon} />
            </Flex>
        </div>
    );
};
