---
tag: new
---

@# Loading icons

As of Blueprint v5.0, icons are no longer loaded by default through the main package entry points. This allows you the flexibility
to bundle only the icons you use in your application. There are a few different ways to load icons, and you may mix some of the
approaches.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [**`Icon` component documentation**](#core/components/icon) (in the `@blueprintjs/core` package) for React API details.
</div>

@## Using static imports

Blueprint's icon prop APIs accept a JSX element. When you use this type, you are expected to supply an SVG React element imported
from the icons package.

```tsx
import { Button } from "@blueprintjs/core";
import { Download } from "@blueprintjs/icons";
import * as ReactDOM from "react-dom";

ReactDOM.render(
    <Button text="Download" icon={<Download size={16} />} />,
    document.querySelector(".my-app")
)
```

This approach has benefits and tradeoffs:

- Bundling only the icons you need is trivial with a properly-configured bundler which supports tree-shaking.
- You do have to explicitly import each icon you use as an ES import.
- You do have to take care to specify the correct icon size (if it is not the default 16px size) depending on the usage context.

@## Using dynamic imports

Blueprint's icon props APIs _also_ accept a type-safe icon name string literal. This approach has some benefits:

- You _do not_ have to explicitly import each icon you use as an ES import
- The icon will usually be automatically sized for you depending on its usage context

It looks like this in your render code path:

```tsx
import { Button } from "@blueprintjs/core";
import * as ReactDOM from "react-dom";

ReactDOM.render(
    <Button text="Download" icon="download" />,
    document.querySelector(".my-app")
)
```

These usability benefits do come at the cost of some some extra work for Blueprint (and some extra configuration for you, the
Blueprint user) in order for these icons to be available at runtime. With the string literal API, **Blueprint code is
importing icon modules for you**.  Let's take a look at this required configuration.

<div class="@ns-callout @ns-intent-warning @ns-icon-warning-sign">

The following strategies assume you are bundling with Webpack; if you are using a different bundler then you will have to adapt
to its available APIs.
</div>

1. Use built-in dynamic import APIa to load all icon paths statically, similar to behavior in Blueprint versions prior to v5.x.

    This results in the largest bundle size for your main chunk.

    In the entry point for your bundle, use `Icons.loadAll()` with one of the built-in webpack-annotated loader functions.
    This will to ensure that webpack will bundle all the icon modules in your main chunk
    (see [relevant Webpack docs here](https://webpack.js.org/api/module-methods/#magic-comments)):

    ```ts
    import { Icons } from "@blueprintjs/icons";

    // using the default annotated Webpack loader, which uses the "lazy-once" mode
    await Icons.loadAll();

    // using an "eager" Webpack loader, which bundles icon modules in a way that mimics Blueprint v4.x behavior
    await Icons.loadAll({ loader: "webpack-eager" });
    ```

2. Use static imports to load all icon paths statically (simpler, does not require knowledge of bundler specifics).

    ```ts
    import { Icons, getIconPaths } from "@blueprintjs/icons";

    await Icons.loadAll({
        loader: async (name, size) => getIconPaths(name, size),
    });
    ```

3. Load all icons lazily, on-demand.

    Any usage of `<Icon icon="..." />` will trigger a network request to fetch the individual icon contents chunk.

    ```ts
    import { Icons } from "@blueprintjs/icons";

    Icons.setOptions({ loader: "webpack-lazy" });
    ```

4. Load some icon paths up front (dynamically) with network requests, and the rest lazily/on-demand.

    ```ts
    import { Icons } from "@blueprintjs/icons";

    Icons.setOptions({ loader: "webpack-lazy" });
    await Icons.load(["download", "caret-down", "endorsed", "help", "lock"]);
    ```

5. Use a custom loader for more control.

    ```ts
    // specify a custom loader function for an alternative bundler, for example Vite
    // see https://vitejs.dev/guide/features.html#glob-import
    import { Icons, IconPaths } from "@blueprintjs/icons";

    const iconModules: Record<string, { default: IconPaths[] }> =
        import.meta.glob([
            "../node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/*.js",
            "../node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/*.js",
        ]);

    await Icons.loadAll({
        loader: async (name, size) => (
            iconModules[
                `../node_modules/@blueprintjs/icons/lib/esm/generated/${size}px/paths/${name}.js`
            ].default,
        ),
    });
    ```

@interface IconLoaderOptions
