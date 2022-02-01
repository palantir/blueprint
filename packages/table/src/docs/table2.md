---
tag: new
---

@# Table2

As of `@blueprintjs/table` v3.9.0, there are two versions of the table component API, exported as `Table` and `Table2`.
All the documentation examples here use the newer Table2 API.

These two are functionally the same except for the fact that Table2 uses the new hotkeys API via
[HotkeysTarget2](#core/components/hotkeys-target2). This means that you must configure a
[HotkeysProvider](#core/context/hotkeys-provider) in your application in order to use Table2.

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

`EditableCell` also binds its own hotkeys, so we have provided a new component `EditableCell2` which uses the new
hotkeys API.
