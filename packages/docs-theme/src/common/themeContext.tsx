/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

import { createContext, useContext } from "react";

export interface ThemeContextValue {
    isDarkTheme: boolean;
    toggleTheme?: (useDark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
    isDarkTheme: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ThemeContext.Provider;
