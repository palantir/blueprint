<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) [![CircleCI](https://circleci.com/gh/palantir/blueprint/tree/develop.svg?style=svg)](https://circleci.com/gh/palantir/workflows/blueprint)

Blueprint is a React-based UI toolkit for the web.

It is optimized for building complex, data-dense web interfaces for _desktop applications_.
If you rely heavily on mobile interactions and are looking for a mobile-first UI toolkit, this may not be for you.


[**Read the introductory blog post ▸**](https://medium.com/@palantir/scaling-product-design-with-blueprint-25492827bb4a)

[**View the full documentation ▸**](http://blueprintjs.com/docs)

[**Try it out on CodeSandbox ▸**](https://codesandbox.io/s/rypm429574)

[**Read our FAQ on the wiki ▸**](https://github.com/palantir/blueprint/wiki/Frequently-Asked-Questions)

## :tada: 3.0 is here! :tada:

[**3.0 Changelog and migration guide ▸**](https://github.com/palantir/blueprint/wiki/3.0-Changelog)

Blueprint 3.0 supports multiple major versions of Blueprint on the same page through removing global styles and deconflicting selectors by changing the namespace. It also restores support for React 15 in most packages.

### Upgrading from 1.x

Check out the [**2.0 changelog**](https://github.com/palantir/blueprint/wiki/What's-new-in-Blueprint-2.0) on the wiki, and make sure to review the [**2.0 migration guide**](https://github.com/palantir/blueprint/wiki/What's-new-in-Blueprint-2.0#migration-path), in addition to the 3.0 content above.

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

## Contributing

Looking for places to contribute to the codebase?
First read the [contribution guidelines](https://github.com/palantir/blueprint/blob/develop/CONTRIBUTING.md),
then [check out the "help wanted" label](https://github.com/palantir/blueprint/labels/help%20wanted).

## Development

[Lerna](https://lernajs.io/) manages inter-package dependencies in this monorepo.
Builds are orchestrated via `lerna run` and NPM scripts.

__Prerequisites__: Node.js v8+, Yarn v1.10+

### One-time setup

After cloning this repo, run:

1. `yarn` to install all dependencies.
1. `yarn verify` to ensure you have all the build tooling working properly.




### Incorporando cambios en sentido ascendente

Si anteriormente estaba en un estado de trabajo y acaba de extraer un nuevo código de `develop`:

- Si hubo cambios en la dependencia del paquete, ejecute `yarn` en la raíz.
  - Este comando es muy rápido si no hay cosas nuevas para instalar.
- Ejecute `yarn compile` para obtener las últimas versiones construidas de los paquetes de la biblioteca en este repositorio.
  - Este comando es más rápido que `yarn Verify` ya que no compila los paquetes de la aplicación (` docs-app`, `landing-app`, etc.) ni ejecuta pruebas

### Desarrollando bibliotecas

Ejecute `yarn dev` desde el directorio raíz para ver los cambios en todos los paquetes y ejecute la aplicación docs con webpack-dev-server.

Alternativamente, cada biblioteca tiene su propio script dev para ejecutar la aplicación docs y ver los cambios en ese paquete (y sus dependencias): `yarn dev: core`,` yarn dev: datetime`, etc.
Una excepción es `table`: ya que tiene su propia aplicación dev, el script` dev: table` ejecuta `table-dev-app` en lugar de los documentos.

### Actualización de la documentación

Gran parte de la documentación de Blueprint se encuentra dentro del código fuente, como lo comenta JSDoc en los archivos `.tsx` y el marcado KSS en los archivos` .scss`. Esta documentación se extrae y se convierte en datos JSON estáticos utilizando [documentalista] (https://github.com/palantir/documentalist/).

Si está actualizando las fuentes de documentación (_no_ el código de la interfaz de usuario de los documentos que se encuentra en `packages / docs-app` o el tema de documentos en` packages / docs-theme`), deberá ejecutar `yarn compile` desde` packages / docs-data` para ver los cambios reflejados en la aplicación. Para simplificar, existe un script de alias `yarn docs-data` en la raíz para minimizar el salto de directorio.

### Actualizando iconos

Los pasos [Configuración única] (# # configuración única) y [Incorporación de cambios en sentido ascendente] (# incorporando cambios en sentido ascendente) deben generar los pasos generados.
Código fuente en este repositorio utilizado para construir la documentación de los iconos. Esto es suficiente para la mayoría de los flujos de trabajo de desarrollo.

Si está actualizando íconos o agregando nuevos, deberá ejecutar `yarn compile` en` packages / icons` para ver los cambios reflejados antes
ejecutando cualquiera de los scripts de desarrollo.

## licencia

Este proyecto está disponible bajo su propia ** Blueprint License **, basada en la licencia Apache 2.0.

La única modificación es una sección adicional (párrafo 10) en la que pedimos
que no pasa ningún producto derivado como los productos de Palantir, dado que
que Blueprint es un conjunto de herramientas de diseño.
