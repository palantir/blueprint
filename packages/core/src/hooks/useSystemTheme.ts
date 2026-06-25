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

import { useEffect, useState } from "react";

/**
 * Returns the current system color scheme preference ("dark" or "light")
 * and automatically updates when the user changes their system preference.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export function useSystemTheme(): "dark" | "light" {
    const [theme, setTheme] = useState<"dark" | "light">(() =>
        window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    );

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    return theme;
}