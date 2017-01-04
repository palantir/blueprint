Blueprint is a React UI toolkit for the web.

Development occurs in [palantir/blueprint](https://github.com/palantir/blueprint).
Please file issues on the [GitHub issue tracker](https://github.com/palantir/blueprint/issues).

Releases are tagged and documented [here](https://github.com/palantir/blueprint/releases)
(more info about releases [on the wiki](https://github.com/palantir/blueprint/wiki/Releases-&-Artifacts)).

## Usage

Blueprint is available as a collection of NPM packages under the `@blueprintjs` scope.

You'll need to install React alongside Blueprint. We support `v15.x` (latest) and `v0.14.x`.

```sh
npm install --save @blueprintjs/core react react-dom react-addons-css-transition-group
```

Import components from the `@blueprintjs/core` module into your project.
Don't forget to include the main CSS stylesheet too!

**[See Components Usage for more complete installation instructions.](#components.usage)**

### Beyond core styles

The Blueprint team maintains multiple packages of styles and JavaScript components on NPM (in the scope
`@blueprintjs`). These are listed in the header under _Releases_. They can be installed with
similar commands as above. Once you've included any additional package(s) in your application, explore the
relevant sections in the sidebar for details about the styling & component APIs you have access to.

<div class="pt-callout pt-intent-primary pt-icon-info-sign">
  <h5>Don't forget the extra resources</h5>
  Most packages consist of JS and CSS resources, so please make sure you're including both in your application.
</div>

### Browser support

Blueprint supports Chrome, Firefox, Safari, IE 11, and Microsoft Edge.

You may experience degraded visuals in IE.
IE 10 and below are unsupported due to their lack of support for CSS Flexbox Layout.
These browsers were deprecated by Microsoft (end of support) in [January 2016](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support).

## Development & contributions

Most dev-related information is on [our GitHub wiki](https://github.com/palantir/blueprint/wiki),
including our [coding guidelines](https://github.com/palantir/blueprint/wiki/Coding-guidelines)
and our [development practices](https://github.com/palantir/blueprint/wiki/Development-Practices).
