<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [![CircleCI](https://circleci.com/gh/palantir/blueprint/tree/develop.svg?style=svg)](https://circleci.com/gh/palantir/workflows/blueprint)

Blueprint is a React-based UI toolkit for the web.

It is optimized for building complex, data-dense web interfaces for _desktop applications_.
If you rely heavily on mobile interactions and are looking for a mobile-first UI toolkit, this may not be for you.

[**View the full documentation ▸**](http://blueprintjs.com/docs)

[**What's new in Blueprint 2.0 ▸**](https://github.com/palantir/blueprint/wiki/What's-new-in-Blueprint-2.0)

[**1.x &rarr; 2.0 migration guide ▸**](https://github.com/palantir/blueprint/wiki/What's-new-in-Blueprint-2.0#migration-path)

[**Read our FAQ on the wiki ▸**](https://github.com/palantir/blueprint/wiki/Frequently-Asked-Questions)

[**Read the introductory blog post ▸**](https://medium.com/@palantir/scaling-product-design-with-blueprint-25492827bb4a)

**Support question**? We use the [**blueprintjs** tag on Stack Overflow **▸**](http://stackoverflow.com/questions/tagged/blueprintjs)

## 🚧 3.0 is in progress! 🚧

Blueprint 3.0 will support multiple major versions of Blueprint on the same page through removing global styles and deconflicting selectors. It also restores support for React 15 in most packages.

To make a contribution that you wish to have released in an earlier major version of any `@blueprintjs` package, please submit a PR to the `release/1.x` or `release/2.x` branch.

## Packages

This repository contains multiple projects in the `packages/` directory that fall into 3 categories:

### Libraries

These are the component libraries we publish to NPM.

- [![npm](https://img.shields.io/npm/v/@blueprintjs/core.svg?label=@blueprintjs/core)](https://www.npmjs.com/package/@blueprintjs/core) &ndash; Core styles & components.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/datetime.svg?label=@blueprintjs/datetime)](https://www.npmjs.com/package/@blueprintjs/datetime) &ndash; Components for interacting with dates and times.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/icons.svg?label=@blueprintjs/icons)](https://www.npmjs.com/package/@blueprintjs/icons) &ndash; Components for generating and displaying icons.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/select.svg?label=@blueprintjs/select)](https://www.npmjs.com/package/@blueprintjs/select) &ndash; Components for selecting items from a list.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/table.svg?label=@blueprintjs/table)](https://www.npmjs.com/package/@blueprintjs/table) &ndash; Scalable interactive table component.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/timezone.svg?label=@blueprintjs/timezone)](https://www.npmjs.com/package/@blueprintjs/timezone) &ndash; Components for picking timezones.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/labs.svg?label=@blueprintjs/labs)](https://www.npmjs.com/package/@blueprintjs/labs) &ndash; Incubator and staging area for new components still under initial development.

### Applications

These are hosted on GitHub Pages as static web applications:

- `docs-app` &ndash; Documentation site at blueprintjs.com/docs
- `landing-app` &ndash; Landing page at blueprintjs.com

These are used as development playground environments:

- `table-dev-app` &ndash; demo page that supports manual testing of all table features

### Build tooling

These packages define development dependencies and contain build configuration. They adhere to the standard NPM package layout, which allows us to keep clear API boundaries for build configuration and isolate groups of `devDependencies`. They are published to NPM in order to allow other Blueprint-related projects to use this infrastructure outside this monorepo.

- [![npm](https://img.shields.io/npm/v/@blueprintjs/docs-theme.svg?label=@blueprintjs/docs-theme)](https://www.npmjs.com/package/@blueprintjs/docs-theme) &ndash; Documentation theme for [Documentalist](https://github.com/palantir/documentalist) data.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/karma-build-scripts.svg?label=@blueprintjs/karma-build-scripts)](https://www.npmjs.com/package/@blueprintjs/karma-build-scripts)
- [![npm](https://img.shields.io/npm/v/@blueprintjs/node-build-scripts.svg?label=@blueprintjs/node-build-scripts)](https://www.npmjs.com/package/@blueprintjs/node-build-scripts)
- [![npm](https://img.shields.io/npm/v/@blueprintjs/test-commons.svg?label=@blueprintjs/test-commons)](https://www.npmjs.com/package/@blueprintjs/test-commons)
- [![npm](https://img.shields.io/npm/v/@blueprintjs/tslint-config.svg?label=@blueprintjs/tslint-config)](https://www.npmjs.com/package/@blueprintjs/tslint-config)
- [![npm](https://img.shields.io/npm/v/@blueprintjs/webpack-build-scripts.svg?label=@blueprintjs/webpack-build-scripts)](https://www.npmjs.com/package/@blueprintjs/webpack-build-scripts)

## Development

[Lerna](https://lernajs.io/) manages inter-package dependencies in this monorepo.
Builds are orchestrated via `lerna run` and NPM scripts.

__Prerequisites__: Node.js v8+, Yarn v1.0+

### One-time setup

After cloning this repo, run:

1. `yarn` to install all dependencies.
1. `yarn verify` to ensure you have all the build tooling working properly.

### Incorporating upstream changes

If you were previously in a working state and have just pulled new code from `develop`:

- If there were package dependency changes, run `yarn` at the root.
  - This command is very quick if there are no new things to install.
- Run `yarn compile` to get the latest built versions of the library packages in this repo.
  - This command is quicker than `yarn verify` since it doesn't build the application packages (`docs-app`, `landing-app`, etc.) or run tests

### Developing libraries

Each library has its own dev script which you can run to watch changes to that package and run the docs application with webpack-dev-server: `yarn dev:core`, `yarn dev:datetime`, etc.

- One exception is `table`&mdash;since it has its own dev application, the `dev:table` script doesn't run the docs site.
  - Run the table dev application using `yarn dev` in the packages/table-dev-app folder.
- You may also choose to watch changes across all packages by running `yarn dev:all` from the root directory.

### Updating dependencies

1. Edit the `package.json` where you wish to change dependencies.
1. Run `yarn` at the root to update lockfiles.
1. Commit the result.

### Updating documentation

Much of Blueprint's documentation lives inside source code as JSDoc comments in `.tsx` files and KSS markup in `.scss` files. This documentation is extracted and converted into static JSON data using [documentalist](https://github.com/palantir/documentalist/).

If you are updating documentation sources (_not_ the docs UI code which lives in `packages/docs-app` or the docs theme in `packages/docs-theme`), you'll need to run `yarn compile` from `packages/docs-data` to see changes reflected in the application. For simplicity, an alias script `yarn docs-data` exists in the root to minimize directory hopping.

### Updating icons

The [One-time setup](#one-time-setup) and [Incorporating upstream changes](#incorporating-upstream-changes) steps should produce the generated
source code in this repo used to build the icons documentation. This is sufficient for most development workflows.

If you are updating icons or adding new ones, you'll need to run `yarn compile` in `packages/icons` to see those changes reflected before
running any of the dev scripts.

## Contributing

Looking for places to contribute to the codebase?
[Check out the "help wanted" label](https://github.com/palantir/blueprint/labels/help%20wanted).

Read about our [contribution guidelines](https://github.com/palantir/blueprint/blob/develop/CONTRIBUTING.md) and
[development practices](https://github.com/palantir/blueprint/wiki/Development-Practices) to give your PR
its best chance at getting merged.

## License

This project is made available under the [Apache-2.0 License](https://github.com/palantir/blueprint/blob/develop/LICENSE).
