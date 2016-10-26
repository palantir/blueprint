# Blueprint [![CircleCI](https://circleci.com/gh/palantir/blueprint.svg?style=svg&circle-token=4725ab38f16004566d6430180663d7e7f9f5da9d)](https://circleci.com/gh/palantir/blueprint)
This is the __omnibus development repo__ for __Blueprint__, Palantir's UI library for web applications.

This repository does not contain compiled assets so please install relevant packages from NPM.

__Documentation is available on [GitHub Pages](https://palantir.github.io/blueprint).__ Check out our [wiki space on Github](https://github.com/palantir/blueprint/wiki) as well.

### Packages

This repository contains multiple projects in the `packages/` directory that are ultimately distributed as separate packages on NPM:

[![npm](https://img.shields.io/npm/v/@blueprint/core.svg?label=@blueprint/core)](https://www.npmjs.com/package/@blueprint/core) &ndash; Core styles & components for the UI kit.

[![npm](https://img.shields.io/npm/v/@blueprint/datetime.svg?label=@blueprint/datetime)](https://www.npmjs.com/package/@blueprint/datetime) &ndash; UI components related to date & time input.

[![npm](https://img.shields.io/npm/v/@blueprint/table.svg?label=@blueprint/table)](https://www.npmjs.com/package/@blueprint/table) &ndash; Scalable interactive Table components

`documentation` &ndash; Blueprint's documentation site (not published to any package registry).

Inter-project dependencies are symlinked via `node_modules`. Builds are orchestrated via Gulp tasks.

### Development

__Prerequisite__: Node.js v5.x

1. `git clone` this repository (or fork if you lack permissions)
1. `npm install` in the project root
1. `gulp`
1. Visit [localhost:9000/packages/docs/dist/](http://localhost:9000/packages/docs/dist/)

### Contribution

See our [Development Practices wiki page](https://github.com/palantir/blueprint/wiki/Development-Practices) for
details about how to contribute to Blueprint.
Also see [Blueprint Ecosystem](https://github.com/palantir/blueprint/wiki/Blueprint-Ecosystem) for guidelines on
contributing components in the broader ecosystem.

### License
This project is made available under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
