<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) Date & Time Components (V2)

Blueprint is a React UI toolkit for the web.

This package contains re-exports of some components from @blueprintjs/datetime v5.x. These "V2" APIs are backwards-compatible with @blueprintjs/datetime2 v0.x. Once you upgrade to Blueprint v5.0, you should migrate your
imports to reference @blueprintjs/datetime instead:

```diff
- import { DateInput2 } from "@blueprintjs/datetime2";
+ import { DateInput } from "@blueprintjs/datetime";
```

This package also contains next-generation "V3" components which support react-day-picker v8. This means that
installing @blueprintjs/datetime2 will install multiple versions of react-day-picker (v7.x via @blueprintjs/datetime
and v8.x as a direct dependency). Note that these two copies of react-day-picker can happily exist together in a JS
bundle, and with the help of tree-shaking, you can avoid bundling both if you _only_ use the deprecated "V2" APIs
or _only_ use the new "V3" APIs.

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
