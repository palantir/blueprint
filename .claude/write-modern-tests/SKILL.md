---
name: write-modern-tests
description: Write modern Vitest + React Testing Library tests following Blueprint conventions
disable-model-invocation: true
---

# Writing Modern Tests in Blueprint

This skill defines our modern testing conventions. Use `packages/core` and `packages/labs` as the reference implementations. Other packages (select, table, datetime) have not been migrated yet as of writing this.

## Stack

- **Test runner**: Vitest (not Mocha, not Karma)
- **Rendering**: React Testing Library (`@testing-library/react`)
- **User simulation**: `@testing-library/user-event`
- **Assertions**: Vitest `expect` + `@testing-library/jest-dom` matchers
- **Mocking**: Vitest `vi` (not Sinon)
- **Test commons**: `@blueprintjs/test-commons/vitest` for all Vitest globals

## File structure & naming

Tests are **colocated** with their component source file:

```
packages/core/src/components/alert/
    alert.tsx
    alert.test.tsx       <-- test lives next to the component
```

Naming: `<component>.test.tsx` (lowercase, matching the source file name).

Do NOT put tests in a separate `test/` directory. That is the old pattern used by unmigrated packages.

## Import conventions

Imports follow a strict 3-layer order separated by blank lines:

```tsx
// 1. External libraries
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// 2. Blueprint test-commons (ALWAYS import Vitest globals from here, not from "vitest" directly)
import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest";

// 3. Source code under test (use specific paths, NOT barrel re-exports)
import { Classes } from "../../common";
import { Alert } from "./alert";
```

**Import rules**:

- Always import `describe`, `expect`, `it`, `vi`, `beforeEach`, `afterEach`, etc. from `"@blueprintjs/test-commons/vitest"` -- never from `"vitest"` directly (the only exception is isotest files which import `describe` from `"vitest"`).
- For mock types, import `type MockInstance` from `"@blueprintjs/test-commons/vitest"`.
- Import components and utilities via **specific module paths**, not barrel re-exports. Use `import { Breadcrumb } from "./breadcrumb"` and `import { Classes } from "../../common"`, NOT `import { Breadcrumb, Classes } from "../.."`.
- For test utilities: `import { dispatchMouseEvent } from "@blueprintjs/test-commons/vitest-utils"`.

## Test structure

```tsx
describe("<ComponentName>", () => {
    it("should do something specific", () => {
        // arrange, act, assert
    });

    describe("sub-feature", () => {
        it("should handle sub-feature case", () => {
            // ...
        });
    });
});
```

**Rules**:

- Use `it()`, not `test()`.
- The top-level `describe` uses the component name in angle brackets: `describe("<Alert>", () => { ... })`.
- Test names start with `"should ..."` and describe **observable behavior**, not implementation details.
- Keep each `it()` block focused on one behavior.
- Nest `describe()` blocks for logically grouped sub-features (e.g. `describe("confirm button", () => { ... })`).

### Naming test titles well

Good test names describe **what the component should do** from a user/consumer perspective:

```tsx
// Good -- describes observable behavior
it("should render its contents", () => { ... });
it("should not trigger onClick when disabled and clicked", () => { ... });
it("should render an icon when one is provided", () => { ... });
it("should call onClick when enter key is pressed", () => { ... });
it("should display loading state on buttons", () => { ... });

// Bad -- describes implementation
it("sets state.isOpen to true", () => { ... });
it("calls the internal _handleClick method", () => { ... });
it("has the right className string", () => { ... });
```

## Rendering

Use RTL's `render()` and query the result via `screen`:

```tsx
it("should render its contents", () => {
    render(<Alert isOpen={true} confirmButtonText="Delete" />);
    const alert = screen.getByRole("alertdialog");

    expect(alert).toHaveClass("test-class");
    screen.getByRole("button", { name: "Delete" });
});
```

**Query priority** (prefer semantic queries):

1. `screen.getByRole("button", { name: "Save" })` -- best, tests accessibility
2. `screen.getByText("Hello")` -- good for visible text
3. `screen.getByTestId("my-element")` -- acceptable when no semantic query works
4. `container.querySelector(".bp5-icon")` -- last resort, for class-based queries with no semantic alternative

When using `container`, destructure from `render()`:

```tsx
const { container } = render(<Breadcrumb />);
expect(container.querySelector("a")).not.toBeInTheDocument();
```

For portaled content, use `baseElement`:

```tsx
const { baseElement } = render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} />);
const backdrop = baseElement.querySelector(`.${Classes.OVERLAY_BACKDROP}`);
```

## Assertions

Use `expect()` exclusively. Available matchers:

### jest-dom matchers (preferred for DOM assertions)

```tsx
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
expect(element).toHaveClass("foo", "bar");
expect(element).not.toHaveClass(Classes.INTENT_PRIMARY);
expect(element).toHaveAttribute("data-foo", "bar");
expect(element).toHaveStyle({ fontWeight: 700 });
expect(element).toBeInstanceOf(HTMLButtonElement);
```

### Existence checks

```tsx
// For elements that should exist (queried via container/baseElement)
expect(container.querySelector(`.${Classes.ICON}`)).to.exist;

// For elements that should not exist
expect(container.querySelector(`.${Classes.ICON}`)).not.toBeInTheDocument();

// For screen queries, getBy* throws if not found (no assertion needed to verify existence)
screen.getByRole("button", { name: "Save" }); // throws if missing
```

### Mock/spy assertions

```tsx
expect(onClick).toHaveBeenCalled();
expect(onClick).toHaveBeenCalledOnce();
expect(onClick).toHaveBeenCalledTimes(3);
expect(onClick).toHaveBeenCalledWith("arg1", "arg2");
expect(onClick).toHaveBeenCalledExactlyOnceWith(expectedArg);
expect(onClick).not.toHaveBeenCalled();

// Accessing call args directly
expect(onClose.mock.calls[0][0]).toBe(true);
```

### Length assertions

```tsx
expect(screen.getAllByRole("listitem")).to.have.length(3);
```

## User interactions

Use `userEvent` for realistic user interaction simulation. Always call `userEvent.setup()` at the top of the test:

```tsx
it("should trigger onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick} />);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
});
```

Use `fireEvent` only for events that `userEvent` doesn't support (like `keyDown` on non-interactive elements):

```tsx
it("should be escape key cancelable", () => {
    render(<Alert isOpen={true} cancelButtonText="Cancel" onCancel={onCancel} canEscapeKeyCancel={true} />);
    const dialog = screen.getByRole("alertdialog");

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(onCancel).toHaveBeenCalledOnce();
});
```

### Keyboard input

```tsx
await user.type(button, "{enter}");
await user.type(button, "{space}");
```

## Mocking

### Callbacks

```tsx
const onClick = vi.fn();
render(<Button onClick={onClick} />);
// ... interact ...
expect(onClick).toHaveBeenCalledOnce();
```

### Spying on console/existing methods

```tsx
const warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
afterEach(() => warnSpy.mockClear());
afterAll(() => warnSpy.mockRestore());
```

### MockInstance type

```tsx
import { type MockInstance, vi } from "@blueprintjs/test-commons/vitest";

let warnSpy: MockInstance;
beforeAll(() => (warnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn())));
```

## Async patterns

### waitFor

Use `waitFor` when testing async state updates or transitions:

```tsx
it("should support overlay lifecycle props", async () => {
    const onOpening = vi.fn();
    render(<Alert isOpen={true} onOpening={onOpening} />);

    await waitFor(() => expect(onOpening).toHaveBeenCalledOnce());
});
```

### Tests with userEvent are always async

```tsx
it("should trigger onClick when clicked", async () => {
    const user = userEvent.setup();
    // ...
    await user.click(button);
    // ...
});
```

## Setup and cleanup

The setup file at `@blueprintjs/test-commons/vitest.setup` handles:
- Importing `@testing-library/jest-dom/vitest` (provides DOM matchers)
- Configuring Enzyme adapter (for packages still mid-migration)
- Calling `cleanup()` after each test

For manual DOM cleanup (when tests create DOM elements outside React):

```tsx
let containerElement: HTMLElement;

beforeEach(() => {
    containerElement = document.createElement("div");
    document.body.appendChild(containerElement);
});

afterEach(() => {
    containerElement.remove();
});
```

## Shared test logic

For components that share behavior (e.g. `Button` and `AnchorButton`), extract a shared test function:

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
    it("should render its contents", () => {
        render(<Component className="foo" text="test" />);
        // ...
    });
}
```

## Vitest config

Each package has a `vitest.config.mts` at its root:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "core",
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**", "src/isotest.test.ts"],
        setupFiles: "@blueprintjs/test-commons/vitest.setup",
    },
});
```

For packages **without** Enzyme dependencies, use `@blueprintjs/test-commons/vitest-setup-no-enzyme` as the setup file instead.

Isomorphic tests use a separate config with `environment: "node"` (`vitest.config.isotest.mts`).

## Dos and Don'ts

### Do

- Colocate test files next to their component source
- Import Vitest globals from `@blueprintjs/test-commons/vitest`
- Import source via specific module paths (`./alert`, `../../common`)
- Use `it()` with `"should ..."` descriptions
- Use `screen.getByRole()` and other semantic queries
- Use `userEvent.setup()` for click, type, keyboard interactions
- Use `vi.fn()` for mock callbacks
- Use `expect()` with jest-dom matchers
- Use `waitFor()` for async assertions
- Test **observable behavior** (what the user sees/does)

### Don't

- Put test files in a separate `test/` directory
- Import from `"vitest"` directly (use `@blueprintjs/test-commons/vitest`)
- Import from barrel re-exports like `"../.."` or `"../../.."`
- Use `test()` instead of `it()`
- Use `assert.*` (Chai-style assertions)
- Use `sinon.spy()` / `sinon.stub()` (use `vi.fn()` / `vi.spyOn()`)
- Use Enzyme's `mount()`, `shallow()`, `wrapper.find(Component)`, `wrapper.simulate()`, `wrapper.prop()`, `wrapper.state()`
- Test implementation details (internal state, private methods)
- Use `container.querySelector` when a semantic `screen` query would work

---

## Migration reference: Enzyme/Mocha/Sinon to Vitest/RTL

When migrating a test file from the old stack to the modern stack:

### Rendering

| Old (Enzyme) | New (RTL) |
|---|---|
| `const wrapper = mount(<Comp />)` | `render(<Comp />)` or `const { container } = render(<Comp />)` |
| `const wrapper = shallow(<Comp />)` | `render(<Comp />)` (RTL always does a full render) |
| `wrapper.find(ChildComponent)` | `screen.getByRole(...)` / `screen.getByText(...)` |
| `wrapper.find(".my-class")` | `container.querySelector(".my-class")` |
| `wrapper.find(".my-class").exists()` | `container.querySelector(".my-class")` (check for null) |
| `wrapper.find(".my-class").text()` | `screen.getByText(...)` or `.textContent` |
| `wrapper.prop("foo")` | Test the DOM effect of the prop instead |
| `wrapper.state("isOpen")` | Test observable behavior instead (is the popup visible?) |
| `wrapper.setProps({ foo: "bar" })` | Re-render: `rerender(<Comp foo="bar" />)` |
| `wrapper.simulate("click")` | `await user.click(element)` |
| `wrapper.simulate("keydown", { key: "Escape" })` | `fireEvent.keyDown(element, { key: "Escape" })` |
| `wrapper.unmount()` | RTL cleanup is automatic via the setup file |

### Assertions

| Old | New |
|---|---|
| `assert.isTrue(x)` | `expect(x).toBe(true)` |
| `assert.isFalse(x)` | `expect(x).toBe(false)` |
| `assert.equal(a, b)` | `expect(a).toBe(b)` or `expect(a).toEqual(b)` |
| `assert.lengthOf(arr, n)` | `expect(arr).toHaveLength(n)` |
| `assert.strictEqual(a, b)` | `expect(a).toBe(b)` |
| `expect(x).to.be.true` | `expect(x).toBe(true)` |
| `expect(x).to.equal(y)` | `expect(x).toBe(y)` |
| `wrapper.find(X).exists()` assertion | `expect(screen.queryByRole(...)).toBeInTheDocument()` |

### Mocking

| Old (Sinon) | New (Vitest) |
|---|---|
| `sinon.spy()` / `spy()` | `vi.fn()` |
| `sinon.stub(obj, "method")` | `vi.spyOn(obj, "method").mockImplementation(...)` |
| `spy.calledOnce` | `expect(spy).toHaveBeenCalledOnce()` |
| `spy.calledWith(a, b)` | `expect(spy).toHaveBeenCalledWith(a, b)` |
| `spy.callCount` | `expect(spy).toHaveBeenCalledTimes(n)` |
| `spy.args[n]` / `spy.getCall(n).args` | `spy.mock.calls[n]` |
| `spy.resetHistory()` | `spy.mockClear()` |
| `spy.restore()` | `spy.mockRestore()` |
| `SinonSpy` / `SinonStub` types | `MockInstance` type |

### Gotcha: Sinon's `calledWith` vs Vitest's `toHaveBeenCalledWith`

Sinon's `calledWith` does **partial** argument matching. Vitest's `toHaveBeenCalledWith` requires an **exact** match on all arguments. For callbacks that receive a React SyntheticEvent, a failed assertion causes Vitest to try serializing the event (which has circular refs), potentially OOM-ing. Fix by using `expect.anything()` for event arguments you don't care about:

```tsx
expect(onClick).toHaveBeenCalledWith(expect.anything()); // for the event arg
```

### File moves

When migrating a package, move the test file from `packages/<pkg>/test/fooTests.tsx` to `packages/<pkg>/src/components/foo/foo.test.tsx`. Update imports accordingly (from `"../src"` to `"./foo"` and specific module paths).
