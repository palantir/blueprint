import { useCallback, useEffect, useState } from "react";

/**
 * Returns the current system color scheme preference ("dark" or "light")
 * and automatically updates when the user changes their system preference.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export function useSystemTheme(): "dark" | "light" {
    const getTheme = useCallback(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
        [],
    );

    const [theme, setTheme] = useState<"dark" | "light">(getTheme);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "dark" : "light");
        };
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    return theme;
}