---
tag: new
---

@# Table2

As of `@blueprintjs/table` v3.9.0, there are two versions of the table component API,
[Table](#table/api.table) and [Table2](#table/table2). All of the documentation examples
on this site demonstrate the newer Table2 API.

@## Migration from Table

The two APIs are functionally identical except for the fact that Table2 uses the new hotkeys API via
[HotkeysTarget2](#core/components/hotkeys-target2). This means that you must configure a
[HotkeysProvider](#core/context/hotkeys-provider) in your application in order to use Table2
(for more information, see the
[hotkeys migration guide on the wiki](https://github.com/palantir/blueprint/wiki/HotkeysTarget-&-useHotkeys-migration)).

```tsx
import { HotkeysProvider } from "@blueprintjs/core";
import { Column, Table2 } from "@blueprintjs/table";
import React from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
    <HotkeysProvider>
        <Table2 numRows={5}>
            <Column />
            <Column />
            <Column />
        </Table2>
    </HotkeysProvider>,
    document.querySelector("#app"),
);
```

@## EditableCell2

If you render [EditableCell](#table/api.editablecell) within your table, you will also need to migrate to its
successor, `EditableCell2`, in order to be compatible with the new hotkeys API, as this component binds some
of its own hotkeys.

@interface EditableCell2Props
