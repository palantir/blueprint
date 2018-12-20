<img height="204" src="https://cloud.githubusercontent.com/assets/464822/20228152/d3f36dc2-a804-11e6-80ff-51ada2d13ea7.png">

# [Blueprint](http://blueprintjs.com/) Documentation Theme

Blueprint is a React UI toolkit for the web.

This package provides a React-based documentation theme for
[Documentalist](https://github.com/palantir/documentalist/), a tool for generating documentation
data from markdown files and documented source code.

## Installation

```
npm install --save @blueprintjs/docz-theme
```

## Usage

**`doczrc.js`**
```js
import doczrc from "@blueprintjs/docz-theme/doczrc";

export default {
    ...doczrc,
    // change these to your needs
    title: "Blueprint",
    theme: "@blueprintjs/docz-theme",
    wrapper: "src/wrapper",
};
```

**`src/wrapper.tsx`**

```tsx
// your stylesheet for your styles
import "./index.scss";

import { Wrapper } from "@blueprintjs/docz-theme";
import React from "react";

interface IAppState {
    // add app state fields here
}

// Docz requires that this be a default export.
// tslint:disable-next-line:no-default-export
export default class extends React.Component<{}, IAppState> {
    public render() {
        return (
            <Wrapper
                {...this.props}
                docs={ yourDocumentalistData }
                // lots more options in here...
            />
        );
    }
}

```

### [Full Documentation](http://blueprintjs.com/docs) | [Source Code](https://github.com/palantir/blueprint)
