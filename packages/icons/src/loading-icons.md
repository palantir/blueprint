@# Loading icons

As of Blueprint v4.0, icons are no longer loaded by default through the main package entry points. This allows you the flexibility
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
import ReactDOM from "react-dom";

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
import ReactDOM from "react-dom";

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

1. Load all icons statically, similar to Blueprint v3.x behavior. This results in the largest bundle size for your main chunk.

  In the entry point for your bundle, specify an annotated icon loader function to ensure that webpack will bundle all the
  icon modules in your main chunk ([relevant Webpack docs here](https://webpack.js.org/api/module-methods/#magic-comments)):

  ```ts
  Icons.loadAll({
      // specify a custom loader function optimized for loading all icons statically
      loader: async name => {
          return (
              await import(
                  /* webpackInclude: /\.js$/ */
                  /* webpackMode: "eager" */
                  `@blueprintjs/icons/lib/esm/generated/components/${name}`
              )
          ).default;
      },
  });
  ```

2. Load some icons up front (but still dynamically) with network requests, and the rest lazily/on-demand.

  In the entry point for your bundle:

  ```ts
  Icons.load(["download", "caret-down", "endorsed", "help", "lock"]);
  ```

3. Load all icons lazily.

  This is the default behavior, where any usage of `<Icon icon="..." />` will trigger a network request to
  fetch the icon contents chunk.
