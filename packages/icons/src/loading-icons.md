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

1. Use the default dynamic import API to bundle icon paths into two chunks (standard & large sizes) separate from your
    entry point. This requires a bundler or module loader which can handle `await import()` statements. These statements
    are annotated with [Webpack magic comments](https://webpack.js.org/api/module-methods/#magic-comments), but they do
    not explicitly require Webpack to function.

    With this API, the first usage of any icon in a given size (standard or large) will trigger a request to fetch a
    bundle containing all the icon paths of that size. This behavior is enabled by default since the standard icon size
    is used more frequently in Blueprint than the large size, and thus we can get a small performance enhancement by
    deferring the loading of large icons.

2. Load all icons into a single chunk (do not split by size)

    ```ts
    import { Icons } from "@blueprintjs/icons";

    Icons.setLoaderOptions({ loader: "all" });

    // optionally, load the icons up-front so that future usage does not trigger a network request
    await Icons.loadAll();
    ```

3. Use a custom Webpack loader with "eager" mode to pull icon definitions into the main chunk.

    This results in the largest bundle size for your main chunk.

    ```ts
    import { Icons, IconSize, IconPathsLoader } from "@blueprintjs/icons";

    const eagerLoader: IconPathsLoader = async (name, size) => {
        return (
            size === IconSize.STANDARD
                ? await import(
                    /* webpackChunkName: "blueprint-icons" */
                    /* webpackInclude: /\.js$/ */
                    /* webpackMode: "eager" */
                    `@blueprintjs/icons/lib/esm/generated/16px/paths/${name}`
                )
                : await import(
                    /* webpackChunkName: "blueprint-icons" */
                    /* webpackInclude: /\.js$/ */
                    /* webpackMode: "eager" */
                    `@blueprintjs/icons/lib/esm/generated/20px/paths/${name}`
                )
        ).default;
    };

    Icons.setLoaderOptions({ loader: eagerLoader });
    ```

4. Use a custom Webpack loader with "lazy" mode to load all icons lazily, on-demand.

    Any usage of `<Icon icon="..." />` will trigger a network request to fetch the individual icon contents chunk.

    ```ts
    import { Icons, IconSize, IconPathsLoader } from "@blueprintjs/icons";

    const lazyLoader: IconPathsLoader = async (name, size) => {
        return (
            size === IconSize.STANDARD
                ? await import(
                    /* webpackChunkName: "blueprint-icons-16px" */
                    /* webpackInclude: /\.js$/ */
                    /* webpackMode: "lazy" */
                    `@blueprintjs/icons/lib/esm/generated/16px/paths/${name}`
                )
                : await import(
                    /* webpackChunkName: "blueprint-icons-20px" */
                    /* webpackInclude: /\.js$/ */
                    /* webpackMode: "lazy" */
                    `@blueprintjs/icons/lib/esm/generated/20px/paths/${name}`
                )
        ).default;
    };

    Icons.setLoaderOptions({ loader: lazyLoader });
    ```

4. Load some icon paths up front (dynamically) with network requests, and the rest lazily/on-demand.

    ```ts
    import { Icons } from "@blueprintjs/icons";

    Icons.setLoaderOptions({ loader: lazyLoader });
    await Icons.load(["download", "caret-down", "endorsed", "help", "lock"]);
    ```

5. Use a custom loaders with other bundlers, for example Vite ([see demo Code Sandbox here](https://codesandbox.io/p/sandbox/blueprint-v5-x-sandbox-react-16-wy0ojy)).

    ```ts
    import { Icons, IconPaths } from "@blueprintjs/icons";

    // see https://vitejs.dev/guide/features.html#glob-import
    const iconModules: Record<string, { default: IconPaths }> = import.meta.glob(
        [
            "../node_modules/@blueprintjs/icons/lib/esm/generated/16px/paths/*.js",
            "../node_modules/@blueprintjs/icons/lib/esm/generated/20px/paths/*.js",
        ],
        { eager: true },
    );

    Icons.setLoaderOptions({
        loader: async (name, size) => (
            iconModules[
                `../node_modules/@blueprintjs/icons/lib/esm/generated/${size}px/paths/${name}.js`
            ].default,
        ),
    });
    ```

@interface IconLoaderOptions
