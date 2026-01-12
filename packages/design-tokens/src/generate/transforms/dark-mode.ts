/**
 * @license Copyright 2025 Palantir Technologies, Inc. All rights reserved.
 */

import type { TransformedToken } from 'style-dictionary/types';

/**
 * Transform to mark tokens as dark mode variants.
 * This adds a `dark` attribute to tokens that should only appear in dark theme.
 */
export function transformDarkMode(token: TransformedToken): Record<string, any> {
    return {
        ...token.attributes,
        isDarkMode: (token as any).dark === true,
    };
}
