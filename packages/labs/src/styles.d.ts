/* !
 * (c) Copyright 2025 Palantir Technologies Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/**
 * Ambient type declaration for CSS Modules SCSS imports.
 *
 * Blueprint's own build (`sass-compile`) emits a global stylesheet and does not hash class
 * names, but consuming applications may process `*.module.scss` files through a CSS Modules
 * aware bundler. This declaration lets `import styles from "./foo.module.scss"` typecheck in
 * both environments; named values exported via Sass `:export` (e.g. `namespace`) are available
 * as string members of the default export.
 */
declare module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    // CSS Modules expose their locals (and Sass `:export` values) as a default export.
    // eslint-disable-next-line import/no-default-export
    export default classes;
}
