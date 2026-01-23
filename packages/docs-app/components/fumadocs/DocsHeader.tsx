"use client";

import { Button } from "./blueprint-client";
import { useTheme } from "./ThemeProvider";

export function DocsHeader() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div className="docs-header">
            <Button
                icon={isDark ? "flash" : "moon"}
                minimal
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            />
        </div>
    );
}
