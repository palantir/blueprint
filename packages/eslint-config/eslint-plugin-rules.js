/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 */

module.exports = {
    // TODO: Change jsx-a11y rules from "warn" to "error" once existing accessibility issues are resolved
    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-has-content": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/aria-activedescendant-has-tabindex": "warn",
    "jsx-a11y/aria-props": "warn",
    "jsx-a11y/aria-proptypes": "warn",
    "jsx-a11y/aria-role": "warn",
    "jsx-a11y/aria-unsupported-elements": "warn",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/heading-has-content": "warn",
    "jsx-a11y/html-has-lang": "warn",
    "jsx-a11y/iframe-has-title": "warn",
    "jsx-a11y/img-redundant-alt": "warn",
    "jsx-a11y/interactive-supports-focus": "warn",
    "jsx-a11y/label-has-associated-control": "warn",
    "jsx-a11y/media-has-caption": "warn",
    "jsx-a11y/mouse-events-have-key-events": "warn",
    "jsx-a11y/no-access-key": "warn",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "warn",
    "jsx-a11y/no-interactive-element-to-noninteractive-role": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/no-noninteractive-element-to-interactive-role": "warn",
    "jsx-a11y/no-noninteractive-tabindex": "warn",
    "jsx-a11y/no-redundant-roles": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",
    "jsx-a11y/role-has-required-aria-props": "warn",
    "jsx-a11y/role-supports-aria-props": "warn",
    "jsx-a11y/scope": "warn",
    "jsx-a11y/tabindex-no-positive": "warn",

    "header/header": [
        "error",
        "block",
        {
            pattern:
                "(!\n)?((@license)|(\\(c\\) ))?Copyright \\d{4} Palantir Technologies,? Inc\\. All rights reserved\\.",
            template: "!\n* (c) Copyright 2026 Palantir Technologies Inc. All rights reserved.\n",
        },
        2,
    ],
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
        "error",
        {
            devDependencies: ["**/test/**/*.{ts,tsx}", "**/*.test.{ts,tsx}", "webpack.config.js", "karma.conf.js"],
        },
    ],
    "import/order": [
        "error",
        {
            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
            groups: [["builtin", "external"], "internal", "parent", "sibling", "index", ["unknown", "object"]],
            "newlines-between": "always",
        },
    ],
    "jsdoc/check-alignment": "error",
    "jsdoc/check-indentation": "off",
    "jsdoc/tag-lines": [
        "error",
        "always",
        {
            applyToEndTag: false,
            count: 0,
            startLines: 1,
            endLines: 0,
        },
    ],
    "react/display-name": "error",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-key": [
        "error",
        {
            checkFragmentShorthand: true,
        },
    ],
    "react/jsx-no-bind": [
        "error",
        {
            ignoreDOMComponents: true,
            ignoreRefs: true,
        },
    ],
    "react/no-did-mount-set-state": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-string-refs": "error",
    "react/self-closing-comp": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
};
