<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) Date & Time Components (V2)

Blueprint is a React UI toolkit for the web.

This package contains a collection of React components for working with dates
and times. These are modern variants of the components available in the
`@blueprintjs/datetime` package; they will become the standard date & time
components in a future major version of Blueprint.

Compared to their "V1" counterparts, these components:
- use Popover2 instead of Popover under the hood
- have better timezone awareness
- utilize lightweight dependencies for manipulating dates and displaying
  the list of available timezones
- no longer use the deprecated moment.js library

At the moment, `@blueprintjs/datetime` is a dependency of this
package, as it delegates to the `<DatePicker>` and `<DateRangePicker>`
implementation exported from there. When these "V2" components graduate
to become the standard API, all Blueprint date/time components will
be collected into a single package, `@blueprintjs/datetime@5.x`.

## Installation

```
npm install --save @blueprintjs/datetime2
```

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
