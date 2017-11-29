<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [![CircleCI](https://circleci.com/gh/palantir/blueprint.svg?style=svg&circle-token=4725ab38f16004566d6430180663d7e7f9f5da9d)](https://circleci.com/gh/palantir/blueprint)

Blueprint is a React-based UI toolkit for the web.

It is optimized for building complex, data-dense web interfaces for _desktop applications_.
If you rely heavily on mobile interactions and are looking for a mobile-first UI toolkit, this may not be for you.

[**View the full documentation ▸**](http://blueprintjs.com/docs)

[**Read our FAQ on the wiki ▸**](https://github.com/palantir/blueprint/wiki/Frequently-Asked-Questions)

[**Read the introductory blog post ▸**](https://medium.com/@palantir/scaling-product-design-with-blueprint-25492827bb4a)

**Support question**? We use the [blueprintjs tag on Stack Overflow ▸](http://stackoverflow.com/questions/tagged/blueprintjs)

## Packages

This repository contains multiple projects in the `packages/` directory that fall into 3 categories:

### Libraries

These are the component libraries we publish to NPM.

- [![npm](https://img.shields.io/npm/v/@blueprintjs/core.svg?label=@blueprintjs/core)](https://www.npmjs.com/package/@blueprintjs/core) &ndash; Core styles & components.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/datetime.svg?label=@blueprintjs/datetime)](https://www.npmjs.com/package/@blueprintjs/datetime) &ndash; Components for interacting with dates and times.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/docs.svg?label=@blueprintjs/docs)](https://www.npmjs.com/package/@blueprintjs/docs) &ndash; Documentation theme for [Documentalist](https://github.com/palantir/documentalist) data.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/table.svg?label=@blueprintjs/table)](https://www.npmjs.com/package/@blueprintjs/table) &ndash; Scalable interactive table component.
- [![npm](https://img.shields.io/npm/v/@blueprintjs/labs.svg?label=@blueprintjs/labs)](https://www.npmjs.com/package/@blueprintjs/labs) &ndash; Incubator and staging area for new components still under initial development.

### Applications

These are hosted on GitHub Pages as static web applications:

- `docs-app` &ndash; Documentation site at blueprintjs.com/docs
- `landing-app` &ndash; Landnig page at blueprintjs.com

These are used as development playground environments:

- `table-dev-app` &ndash; demo page that supports manual testing of all table features

### Build tooling

These private packages define development dependencies and contain build configuration. They adhere to the standard NPM package layout, which allows us to keep clear API boundaries for build configuration and isolate groups of `devDependencies`. In the future, we might publish these packages to allow other Blueprint projects to use this infrastructure outside this monorepo.

- `karma-build-scripts`
- `node-build-scripts`
- `tslint-config`
- `webpack-build-scripts`

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
- Run `yarn compile-libs` to get the latest built versions of the library packages in this repo.
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

Much of Blueprint's documentation lives inside source code as JSDoc comments in `.tsx?` files and KSS markup in `.scss` files. This documentation is extracted and converted into static JSON data using [documentalist](https://github.com/palantir/documentalist/).

If you are updating documentation sources (_not_ the docs UI code which lives in `packages/docs-app`), you'll need to run `yarn generate-docs-data` from the `docs-app` package to see it reflected in the application. Note that `yarn bundle` in this package also runs this script.

### Updating icons

The [One-time setup](#one-time-setup) and [Incorporating upstream changes](#incorporating-upstream-changes) steps should produce the generated
source code in this repo used to build the icons documentation. This is sufficient for most development workflows.

If you are updating icons or adding new ones, you'll need to run `yarn compile` in `packages/core` to see those changes reflected before
running any of the dev scripts.

## Contributing

Looking for places to contribute to the codebase? Check out the
[Status: accepting PRs](https://github.com/palantir/blueprint/labels/Status%3A%20accepting%20PRs) label.

Read about our [contribution guidelines](https://github.com/palantir/blueprint/blob/master/CONTRIBUTING.md) and
[development practices](https://github.com/palantir/blueprint/wiki/Development-Practices) to give your PR
its best chance at getting merged.

## License

This project is made available under the [Apache-2.0 License](https://github.com/palantir/blueprint/blob/master/LICENSE).
