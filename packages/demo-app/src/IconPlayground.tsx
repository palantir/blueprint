/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { useCallback, useEffect, useState } from "react";

import { Classes, type IconName } from "@blueprintjs/core";
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

export const IconPlayground = () => {
    const [darkTheme, setDarkTheme] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState<IconName>("home");
    const [fontFamily, setFontFamily] = useState<string | undefined>(
        "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, blueprint-icons-16, sans-serif",
    );
    const [fontWeight, setFontWeight] = useState(400);
    const [fontSize, setFontSize] = useState(100);

    const handleToggleDarkTheme = useCallback(() => setDarkTheme(prev => !prev), []);

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
                <IconPreview selectedIcon={selectedIcon} onIconSelect={setSelectedIcon} />
                <ButtonSection selectedIcon={selectedIcon} />
                <CalloutSection selectedIcon={selectedIcon} />
                <MenuSection selectedIcon={selectedIcon} />
                <TabsSection selectedIcon={selectedIcon} />
                <TagSection selectedIcon={selectedIcon} />
                <CompoundTagSection selectedIcon={selectedIcon} />
                <InputGroupSection selectedIcon={selectedIcon} />
            </Flex>
        </div>
    );
};
