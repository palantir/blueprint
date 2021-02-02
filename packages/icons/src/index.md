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

### Loading icons

As of Blueprint v4.0, icons are no longer loaded by default through the main package entry points. This allows you the flexibility
to bundle only the icons you use in your application. There are a few ways to specify and load icons. The following strategies
assume you are bundling with Webpack; if you are using a different bundler then you will have to adapt to its available APIs.

1. Load all icons statically, similar to Blueprint v3.x. This results in the largest bundle size for your main chunk.

  In the entry point for your bundle, use the deep import:

  ```ts
  import "@blueprintjs/icons/lib/esm/all";
  ```

  If you are using webpack, specify an annotated icon loader function to ensure that webpack will use the statically-imported
  icon modules at runtime:

  ```ts
  Icons.loadAll({
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

2. Load _some_ icons statically, others on-demand as lazy-loaded chunks.

@reactDocs Icons
