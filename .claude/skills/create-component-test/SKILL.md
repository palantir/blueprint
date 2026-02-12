---
name: creating-component-tests
description: Creates Vitest + React Testing Library component tests for Blueprint UI components. Use when writing, creating, or adding a new component test file, or migrating an existing Karma/Enzyme test to the modern pattern.
---

# Creating Component Tests

## File basics

- **Naming**: `<component-name>.test.tsx`
- **Location**: Colocated next to the component source (e.g. `src/components/button/button.test.tsx`)

### Copyright header

Every test file starts with this header:

```tsx
/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```

### Import order

Imports follow this grouping (separated by blank lines between groups):

```tsx
// 1. @testing-library
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 2. React utilities
import { createRef } from "react";

// 3. sinon for spies
import { spy } from "sinon";

// 4. Blueprint packages
import { IconNames } from "@blueprintjs/icons";

// 5. Test runners ALWAYS import from @blueprintjs/test-commons/vitest, NEVER from "vitest" or "chai" directly
import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

// 6. Relative internal imports
import { Classes } from "../../common";
import { Icon } from "../icon/icon";

// 7. Component under test (last)
import { AnchorButton, Button } from "./buttons";
```

## Test structure

- Wrap tests in `describe("<ComponentName>", () => { ... })` include angle brackets around the component name.
- Start every `it()` description with "should": `it("should render its contents", () => { ... })`.
- When testing multiple variants of a component (e.g. `Button` and `AnchorButton`), extract shared tests into a `commonTests(Component)` function and call it from each `describe` block.

```tsx
describe("<Button>", () => {
    commonTests(Button);

    it("should attach ref", () => { ... });
});

describe("<AnchorButton>", () => {
    commonTests(AnchorButton);

    it("should attach ref", () => { ... });
});

function commonTests(Component: typeof Button | typeof AnchorButton) {
    it("should render its contents", () => { ... });
}
```

## Rendering and querying

Use `render()` from React Testing Library. No manual DOM container management needed.

```tsx
render(<Button className="foo" text="test" />);
```

Query elements via `screen`:
- **Prefer `screen.getByRole()`** (accessibility-first): `screen.getByRole("button", { name: "test" })`
- Use `screen.getByText()` or `screen.getByTestId()` as alternatives
- Use `screen.queryBy*` (not `getBy*`) when asserting an element does **not** exist:
  ```tsx
  expect(screen.queryByTestId("rightIcon")).not.toBeInTheDocument();
  ```

## User interactions

Create a user instance at the top of each test that needs interaction. These tests must be `async`.

```tsx
it("should trigger onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = spy();
    render(<Button onClick={onClick} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(onClick.called).to.be.true;
});
```

Available interactions:
- `await user.click(element)`
- `await user.type(element, "{enter}")`
- `await user.type(element, "{space}")`

Do NOT use `fireEvent`. Always use `userEvent`.

## Assertions

Use Chai-style assertions via the re-exported `expect`:

| Pattern | Example |
|---------|---------|
| Existence | `expect(element).to.exist` |
| Absence (DOM) | `expect(element).not.toBeInTheDocument()` |
| Boolean | `expect(value).to.be.true` / `.to.be.false` |
| Equality | `expect(value).to.equal("bar")` |
| Instance type | `expect(ref.current).to.be.instanceOf(HTMLButtonElement)` |
| CSS class | `expect(el.classList.contains(Classes.BUTTON)).to.be.true` |
| Attribute | `expect(el.getAttribute("data-foo")).to.equal("bar")` |

For DOM absence, use `.not.toBeInTheDocument()` (jest-dom matcher), NOT `.not.to.exist`.

### Spies

Use `sinon.spy()` for tracking callbacks:

```tsx
import { spy } from "sinon";

const onClick = spy();
render(<Button onClick={onClick} />);
// ... interact ...
expect(onClick.called).to.be.true;
expect(onClick.calledOnce).to.be.true;
```

## Complete example

```tsx
/*
 * Copyright 2026 Palantir Technologies, Inc. All rights reserved.
 * [full Apache 2.0 header]
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { spy } from "sinon";

import { describe, expect, it } from "@blueprintjs/test-commons/vitest";

import { Classes } from "../../common";

import { MyComponent } from "./myComponent";

describe("<MyComponent>", () => {
    it("should render with default props", () => {
        render(<MyComponent />);
        const element = screen.getByRole("button");

        expect(element).to.exist;
        expect(element.classList.contains(Classes.MY_COMPONENT)).to.be.true;
    });

    it("should not render optional child when prop is omitted", () => {
        render(<MyComponent />);

        expect(screen.queryByTestId("optional-child")).not.toBeInTheDocument();
    });

    it("should call onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = spy();
        render(<MyComponent onClick={onClick} />);
        const element = screen.getByRole("button");

        await user.click(element);

        expect(onClick.called).to.be.true;
    });

    it("should respond to keyboard input", async () => {
        const user = userEvent.setup();
        const onClick = spy();
        render(<MyComponent onClick={onClick} />);
        const element = screen.getByRole("button");

        await user.type(element, "{enter}");

        expect(onClick.called).to.be.true;
    });
});
```

## Old patterns (do not use)

The codebase was migrated from Karma + Enzyme to Vitest + React Testing Library. Do not use the old patterns.

| Aspect | Old (Karma/Enzyme) | New (Vitest/RTL) |
|--------|---------------------|-------------------|
| Test runner | Karma + Mocha | Vitest |
| File naming | `*Tests.tsx` | `*.test.tsx` |
| File location | Separate `test/` directory | Colocated with source |
| Rendering | `mount(<Component />)` from enzyme | `render(<Component />)` from @testing-library/react |
| Querying | `wrapper.find(".class")` | `screen.getByRole()` |
| Assertions import | `import { expect } from "chai"` | `import { expect } from "@blueprintjs/test-commons/vitest"` |
| DOM absence | `expect(...).not.to.exist` | `expect(...).not.toBeInTheDocument()` |
| DOM environment | Real browser via Karma | jsdom |

Example of what NOT to write:

```tsx
// DO NOT USE old Enzyme pattern
import { mount } from "enzyme";
import { expect } from "chai";

describe("<MyComponent>", () => {
    let containerElement: HTMLElement;

    beforeEach(() => {
        containerElement = document.createElement("div");
        document.body.appendChild(containerElement);
    });

    afterEach(() => {
        containerElement.remove();
    });

    it("renders", () => {
        const wrapper = mount(<MyComponent />, { attachTo: containerElement });
        expect(wrapper.find(`.${Classes.MY_COMPONENT}`).exists()).to.be.true;
    });
});
```
