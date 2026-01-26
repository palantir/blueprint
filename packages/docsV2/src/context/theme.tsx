'use client';

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

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { Classes } from "@blueprintjs/core";

const THEME_LOCAL_STORAGE_KEY = "blueprint-docs-theme";
const DARK_THEME = Classes.DARK;
const LIGHT_THEME = "";

interface ThemeContextValue {
    isDarkTheme: boolean;
    toggleTheme: (useDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    isDarkTheme: true,
    toggleTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
        // Default to dark theme if not set
        setIsDarkTheme(stored !== LIGHT_THEME);
    }, []);

    const toggleTheme = useCallback((useDark: boolean) => {
        setIsDarkTheme(useDark);
        localStorage.setItem(THEME_LOCAL_STORAGE_KEY, useDark ? DARK_THEME : LIGHT_THEME);
    }, []);

    // Apply theme class to html and body elements
    useEffect(() => {
        if (!mounted) return;

        const themeClass = isDarkTheme ? DARK_THEME : "";
        document.documentElement.className = themeClass;
        document.body.className = themeClass;
    }, [isDarkTheme, mounted]);

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
