<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) Date & Time Components (V2)

Blueprint is a React UI toolkit for the web.

This package contains next-generation components for interacting with dates & times.

Compared to the "V1" components in @blueprintjs/datetime, the "V3" components in this package:

-   use [react-day-picker](https://react-day-picker.js.org/) v8 instead of v7 (this unblocks React 18 compatibility)
-   are easier to internationalize & localize since date-fns is now a dependency (instead of `localeUtils`, you can specify a locale code and we'll automatically load the date-fns locale object)

This package also contains legacy APIs which are re-exported aliases for components from @blueprintjs/datetime v5.x.
These "V2" names are backwards-compatible with @blueprintjs/datetime2 v0.x.

To migrate to the latest "V3" components, follow the [react-day-picker v8 migration guide](https://github.com/palantir/blueprint/wiki/react-day-picker-8-migration).

Note that @blueprintjs/datetime2 will transitively install multiple versions of react-day-picker.
These two copies of react-day-picker can happily exist together in a single JS bundle, and with the help of tree-shaking,
you can avoid bundling both if you _only_ use the deprecated "V1" / "V2" datetime components or _only_ use the new
"V3" APIs.

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
