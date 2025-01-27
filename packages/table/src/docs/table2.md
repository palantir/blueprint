@# Table2

As of `@blueprintjs/table` v3.9.0, there are two versions of the table component API,
[Table](#table/api.table) and [Table2](#table/table2). All of the documentation examples
on this site demonstrate the newer Table2 API. You are encouraged to migrate to Table2
for forwards-compatibility with future major versions of Blueprint.

@## Migration from Table

The two APIs are functionally identical except for the fact that Table2 uses the new hotkeys API (via
[HotkeysTarget2](#core/components/hotkeys-target2)). This means that in order to use Table2, you must
configure a [HotkeysProvider](#core/context/hotkeys-provider) in your application.

```tsx
import { HotkeysProvider } from "@blueprintjs/core";
import { Column, Table2 } from "@blueprintjs/table";
import * as React from "react";
import * as ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <HotkeysProvider>
        <Table2 numRows={5}>
            <Column />
            <Column />
            <Column />
        </Table2>
    </HotkeysProvider>,
);
```

For more information, see the [hotkeys migration guide](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration).

@## EditableCell2

If you render EditableCell within your table, you will need to migrate to its successor,
[EditableCell2](#table/api.editablecell2), in order to be compatible with the new hotkeys API, as this
component binds some of its own hotkeys. There are no component API changes.
