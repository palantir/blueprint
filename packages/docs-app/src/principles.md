@# Design Principles

@## Browser support

**Blueprint supports Chrome, Firefox, Safari, IE 11, and Microsoft Edge.**

You may experience degraded visuals in IE.
IE 10 and below are unsupported due to their lack of support for CSS Flexbox Layout.
These browsers were deprecated by Microsoft (end of support) in [January 2016](https://www.microsoft.com/en-us/WindowsForBusiness/End-of-IE-support).

@## API Contract

Blueprint strictly adheres to [semver](https://semver.org/) in its public APIs:

- JS APIs exported from the root/main module of a Blueprint package
- HTML structure of components
- CSS styles for rendered components
