"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Classes } from "./blueprint-client";

interface ThemeContextValue {
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    isDark: true,
    toggleTheme: () => {},
});

const STORAGE_KEY = "bp-docs-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
            setIsDark(stored === "dark");
        } else {
            // Default to system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(prefersDark);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const body = document.body;

        if (isDark) {
            root.classList.add(Classes.DARK);
            body.classList.add(Classes.DARK);
        } else {
            root.classList.remove(Classes.DARK);
            body.classList.remove(Classes.DARK);
        }

        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    }, [isDark, mounted]);

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []);

    // Prevent flash of wrong theme
    if (!mounted) {
        return (
            <div className={Classes.DARK}>
                {children}
            </div>
        );
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <div className={isDark ? Classes.DARK : ""}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
