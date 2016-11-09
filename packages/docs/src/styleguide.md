Blueprint is Palantir's CSS framework & UI library for web applications.

Development occurs in [palantir/blueprint](https://github.com/palantir/blueprint).
Please file issues on the [GitHub issue tracker](https://github.com/palantir/blueprint/issues).

Releases are tagged and documented [here](https://github.com/palantir/blueprint/releases)
(more info about releases [on the wiki](https://github.com/palantir/blueprint/wiki/Releases-&-Artifacts)).

## Usage

Blueprint is available as a collection of NPM packages under the `@blueprint` scope.

```sh
npm install --save @blueprintjs/core
```

Import the `@blueprintjs/core` module into your project.

You can then include these styles (`blueprint.css` along with its associated resources in the `resources` directory)
in your application as you wish. For example:

```html
<!DOCTYPE HTML>
<html>
  <head>
    ...
    <link href="path/to/node_modules/@blueprintjs/core/blueprint.css" rel="stylesheet" />
    ...
  </head>
  ...
</html>
```

### Beyond core styles

The Blueprint team maintains multiple packages of styles and JS components on NPM (in the scope
`@blueprint`). These are listed in the header under _Releases_. They can be installed with
similar commands as above. Once you've included any additional package(s) in your application, explore the
relevant sections in the sidebar for details about the styling & component APIs you have access to.

<div class="pt-callout pt-intent-warning pt-icon-warning-sign">
  <h5>Don't forget the extra resources</h5>
  Most packages consist of JS and CSS resources, so please make sure you're including both in your application.
</div>

### Browser Support

Blueprint supports Chrome, Firefox, Safari, IE 11, and Microsoft Edge.

You may experience degraded visuals in IE.
IE 10 and below are unsupported due to their lack of support for CSS Flexbox Layout.
These browsers were deprecated by Microsoft (end of support) in [January 2016](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support).

## Development & Contributions

Most dev-related information is on [our Github wiki](https://github.com/palantir/blueprint/wiki),
including our [API Design Principles](https://github.com/palantir/blueprint/wiki/API-Design-Principles)
and our [Development Practices](https://github.com/palantir/blueprint/wiki/Development-Practices).

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  <h5>Blueprint is an ecosystem</h5>
  If you have a component or some styles that you wish to contribute to the Blueprint ecosystem
  outside of the [core source repo](https://github.com/palantir/blueprint), check out the
  [wiki page on ecosystem contribution](https://github.com/palantir/blueprint/wiki/Blueprint-Ecosystem).
</div>
