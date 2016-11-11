<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [![CircleCI](https://circleci.com/gh/palantir/blueprint.svg?style=svg&circle-token=4725ab38f16004566d6430180663d7e7f9f5da9d)](https://circleci.com/gh/palantir/blueprint)

Blueprint is a React UI toolkit for the Web.

This repository does not contain compiled assets so please install relevant packages from NPM.

## Packages

This repository contains multiple projects in the `packages/` directory that are distributed as separate packages on NPM:

[![npm](https://img.shields.io/npm/v/@blueprintjs/core.svg?label=@blueprintjs/core)](https://www.npmjs.com/package/@blueprintjs/core) &ndash; Core styles & components for the UI kit.

[![npm](https://img.shields.io/npm/v/@blueprintjs/datetime.svg?label=@blueprintjs/datetime)](https://www.npmjs.com/package/@blueprintjs/datetime) &ndash; Date & time UI components.

[![npm](https://img.shields.io/npm/v/@blueprintjs/table.svg?label=@blueprintjs/table)](https://www.npmjs.com/package/@blueprintjs/table) &ndash; Scalable interactive table UI component.

The other packages (`docs` and `landing`) are not published to NPM as they are used to build the documentation site.

## Development

We use [Lerna](https://lernajs.io/) to manage inter-package dependencies in this monorepo.
Builds are orchestrated via [Gulp](http://gulpjs.com/) tasks.

__Prerequisite__: Node.js v6 or v7

1. `git clone` this repository (or fork if you lack permissions)
1. `npm install` to install build dependencies
1. `npm run bootstrap` to install and link each package using [lerna](https://lernajs.io/)
1. `npm run gulp` to compile and start the server and watcher
1. Open your browser to [localhost:9000/packages/docs/dist/](http://localhost:9000/packages/docs/dist/)

## Contributing

Read our [development practices](https://github.com/palantir/blueprint/wiki/Development-Practices) for
details about how to contribute to Blueprint.

## License

This project is made available under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
