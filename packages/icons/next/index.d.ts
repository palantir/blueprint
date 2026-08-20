/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

// Type barrel for the `@blueprintjs/icons/next` subpath. It lives physically inside `next/` (rather
// than only redirecting to `../lib/...` via package.json) so that TypeScript's auto-import generates
// the canonical `@blueprintjs/icons/next` specifier instead of the deep `lib/esm/next/generated` path.
export * from "../lib/esm/next/generated";
