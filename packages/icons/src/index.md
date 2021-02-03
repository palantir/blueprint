---
reference: icons
---

@# Icons

Blueprint provides over 500 vector UI icons in two sizes (16px and 20px) and two formats (SVG and fonts).
It's easy to change their color or apply effects like text shadows via standard SVG or CSS properties.

Many Blueprint components support an `icon` prop which accepts an icon name (such as `"history"`) or a JSX element to use as the icon.

<div class="@ns-callout @ns-intent-primary @ns-icon-info-sign">

See the [**`Icon` component documentation**](#core/components/icon) for React API details.
</div>

## Loading icons

As of Blueprint v4.0, icons are no longer loaded by default through the main package entry points. This allows you the flexibility
to bundle only the icons you use in your application. There are a few different ways to load icons, and you may mix some of the
approaches.

### Loading icons yourself with static ES imports

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

### Loading icons using Blueprint's dynamic imports

Blueprint's icon props APIs also accept a type-safe icon name string literal. This approach has the benefits that you _do not_
have to explicitly import each icon you use as an ES import and the icon will usually be automatically sized for you depending on
its usage context. It looks like this in your render code path:

```tsx
import { Button } from "@blueprintjs/core";
import ReactDOM from "react-dom";

ReactDOM.render(
    <Button text="Download" icon="download" />,
    document.querySelector(".my-app")
)
```

These usability benefits do come at the cost of some some extra work for Blueprint (and some extra configuration for you, the
Blueprint user) in order for these icons to be available at runtime. Let's take a look at this required configuration.

The following strategies assume you are bundling with Webpack; if you are using a different bundler then you will have to adapt
to its available APIs.

1. Load all icons statically, similar to Blueprint v3.x behavior. This results in the largest bundle size for your main chunk.

  In the entry point for your bundle, use the following deep import:

  ```ts
  import "@blueprintjs/icons/lib/esm/all";
  ```

  In the same module, specify an annotated icon loader function to ensure that webpack will use the statically-imported
  icon modules at runtime ([relevant Webpack docs here](https://webpack.js.org/api/module-methods/#magic-comments)):

  ```ts
  Icons.loadAll({
      // specify a custom loader function optimized for loading all icons statically
      loader: async (name, size) => {
          return (
              await import(
                  /* webpackInclude: /\.js$/ */
                  /* webpackMode: "weak" */
                  `@blueprintjs/icons/lib/esm/generated/${size}px/paths/${name}`
              )
          ).default;
      },
  });
  ```

2. Load some icons up front with network requests, and the rest on-demand.

  ```ts
  Icons.load(["download", "caret-down", "endorsed", "help", "lock"])
  ```

3. Load all icons lazily.

  This is the default behavior, where any usage of `<Icon icon="..." />` will trigger a network request to
  fetch the icon contents chunk.


@reactDocs Icons
