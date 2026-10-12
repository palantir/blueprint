/* !
 * (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.
 */

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { stripDocumentalistTags } from "./markdownExport.mts";

describe("stripDocumentalistTags", () => {
    it("replaces top-level @reactDocs / @reactExample / @interface / @css with placeholder comments", () => {
        const input = [
            "# Title",
            "",
            "@reactDocs Welcome",
            "@reactExample ButtonExample",
            "@interface ButtonProps",
            "@css .bp6-button",
        ].join("\n");
        expect(stripDocumentalistTags(input)).toBe(
            [
                "# Title",
                "",
                "<!-- Interactive widget: Welcome (see online docs) -->",
                "<!-- Interactive example: ButtonExample (see online docs) -->",
                "<!-- TypeScript interface: ButtonProps (see online docs) -->",
                "<!-- CSS reference: .bp6-button (see online docs) -->",
            ].join("\n"),
        );
    });

    it("does not touch lines inside fenced code blocks", () => {
        const input = ["```scss", '@use "@blueprintjs/core/lib/scss/variables";', "@import 'foo';", "```"].join("\n");
        expect(stripDocumentalistTags(input)).toBe(input);
    });

    it("leaves unknown @-prefixed lines alone", () => {
        const input = "@unknownTag value";
        expect(stripDocumentalistTags(input)).toBe(input);
    });
});
