<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) Icon Components and files

Blueprint is a React UI toolkit for the web.

This package contains a collection of React components and other files for displaying icons.

## Installation

```sh copy
npm install --save @blueprintjs/icons
```

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)

## Adding new icons (repo contributors)

1. Add the 16px SVG under `resources/icons/16px` and the 20px SVG under `resources/icons/20px`, same kebab-case basename in each. The basename then becomes the `iconName`.
2. Run `pnpm --filter @blueprintjs/icons icons:add`. It checks the pair, runs SVGO on the SVGs, and appends a row to `packages/icons/icons.json` when the icon isn’t listed yet.
3. Fill in `tags` and `group` for the new row.
4. Run `pnpm --filter @blueprintjs/icons icons:verify` before you ship the change.

To normalize every icon SVG in the repo at once: `pnpm --filter @blueprintjs/icons icons:format`.
