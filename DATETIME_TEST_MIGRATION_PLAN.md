# Migrate `packages/datetime` Tests to Vitest/RTL

Migrate all test files from Karma/Mocha/Chai/Enzyme/Sinon to Vitest/RTL/vi.fn, colocating tests next to source files. Reference implementations: `packages/core` and `packages/labs`.

---

## Current State

| Aspect | Current | Target |
|--------|---------|--------|
| Test runner | Karma + Mocha | Vitest |
| Rendering | Enzyme (`mount`, `shallow`) | React Testing Library (`render`, `screen`) |
| User simulation | Enzyme `.simulate()` | `@testing-library/user-event` |
| Assertions | Chai (`assert`, `expect`) | Vitest `expect` + `@testing-library/jest-dom` |
| Mocking | Sinon (`spy`, `stub`) | Vitest `vi` (`vi.fn()`, `vi.spyOn()`) |
| Test location | Separate `test/` directory | Colocated next to source in `src/` |
| File naming | `*Tests.tsx` | `*.test.tsx` |
| Test globals | Imported from `chai`, `sinon`, `vitest` | Imported from `@blueprintjs/test-commons/vitest` |

### Files to Migrate

**Component tests (6 files, ~7,564 lines):**

| File | Lines | Difficulty | Notes |
|------|-------|------------|-------|
| `test/components/timePickerTests.tsx` | 776 | Easy | Already uses RTL; needs Chai/Sinon swap only |
| `test/components/timezoneSelectTests.tsx` | 206 | Medium | Enzyme-heavy, queries `@blueprintjs/select` internals |
| `test/components/datePickerTests.tsx` | 916 | Medium-Hard | Complex harness with `wrap()`, state access |
| `test/components/dateInputTests.tsx` | 978 | Medium-Hard | 63 `mount()` calls, popover interactions |
| `test/components/dateRangePickerTests.tsx` | 1,505 | Hard | Dual-calendar harness, hover state |
| `test/components/dateRangeInputTests.tsx` | 3,183 | Very Hard | 264 `.simulate()`, 20 `.setState()` calls |

**Utility tests (4 files, ~638 lines):**

| File | Lines | Difficulty |
|------|-------|------------|
| `test/common/dateFormatPropsTests.ts` | 61 | Trivial |
| `test/common/timezoneMetadataTests.ts` | 65 | Trivial |
| `test/common/timezoneUtilsTest.ts` | 129 | Easy |
| `test/common/dateUtilsTests.tsx` | 383 | Easy |

**Other (2 files):**

| File | Lines | Difficulty |
|------|-------|------------|
| `test/dateInputMigrationUtilsTests.tsx` | 110 | Easy |
| `test/isotest.mjs` | ~58 | Easy |

**Test utilities (3 files, ~113 lines):**

| File | Notes |
|------|-------|
| `test/common/dateFormat.ts` | Date formatting helpers, uses `require()` |
| `test/common/loadDateFnsLocaleFake.ts` | Locale mock, already clean |
| `test/common/dayPickerTestUtils.ts` | Enzyme-dependent, needs full rewrite |

---

## Phase 0: Infrastructure Setup

### 0A. Create `packages/datetime/vitest.config.mts`

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        name: "datetime",
        environment: "jsdom",
        include: ["src/**/*.test.{ts,tsx}"],
        exclude: ["lib/**", "node_modules/**", "src/isotest.test.ts"],
        setupFiles: "@blueprintjs/test-commons/vitest-setup-no-enzyme",
    },
});
```

Use `vitest-setup-no-enzyme` (not `vitest.setup`) since the migrated tests will have zero Enzyme usage.

### 0B. Create `packages/datetime/vitest.config.isotest.mts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "datetime-iso",
        environment: "node",
        include: ["src/isotest.test.ts"],
    },
});
```

### 0C. Create `packages/datetime/src/vitest-env.d.ts`

```ts
/// <reference types="@testing-library/jest-dom/vitest" />
```

This provides TypeScript types for jest-dom matchers like `toBeInTheDocument()`, `toHaveClass()`, etc.

### 0D. Restructure tsconfig files

The existing `src/tsconfig.json` becomes a project reference root. Follow the `packages/core` pattern exactly:

**`src/tsconfig.build.json`** (renamed from current `src/tsconfig.json`):
```json
{
    "extends": "../../../config/tsconfig.web",
    "compilerOptions": {
        "composite": true,
        "outDir": "../lib/esm"
    },
    "exclude": [
        "**/*.test.ts",
        "**/*.test.tsx",
        "vitest-env.d.ts"
    ]
}
```

**`src/tsconfig.test.json`** (new):
```json
{
    "extends": "./tsconfig.build.json",
    "compilerOptions": {
        "composite": true,
        "noEmit": true,
        "skipLibCheck": true
    },
    "include": ["**/*.ts", "**/*.tsx", "**/*.test.ts", "**/*.test.tsx", "vitest-env.d.ts"],
    "exclude": []
}
```

**`src/tsconfig.json`** (new, replaces old):
```json
{
    "files": [],
    "references": [{ "path": "./tsconfig.build.json" }, { "path": "./tsconfig.test.json" }]
}
```

**Impact check**: The `compile:esm` script runs `tsc -p ./src` which currently resolves to `src/tsconfig.json`. After the restructure, `src/tsconfig.json` becomes a project-references file. The compile scripts need updating:
- `"compile:esm": "tsc -p ./src/tsconfig.build.json"`
- `"compile:cjs": "tsc -p ./src/tsconfig.build.json -m commonjs --verbatimModuleSyntax false --outDir lib/cjs"`
- `"compile:esnext": "tsc -p ./src/tsconfig.build.json -t esnext --outDir lib/esnext"`

### 0E. Update `packages/datetime/package.json`

**Scripts** (changes only):
```json
{
    "compile:esm": "tsc -p ./src/tsconfig.build.json",
    "compile:cjs": "tsc -p ./src/tsconfig.build.json -m commonjs --verbatimModuleSyntax false --outDir lib/cjs",
    "compile:esnext": "tsc -p ./src/tsconfig.build.json -t esnext --outDir lib/esnext",
    "test": "run-s test:typeCheck test:iso test:vitest:run",
    "test:typeCheck": "tsc -p ./src/tsconfig.test.json",
    "test:iso": "vitest run --config vitest.config.isotest.mts",
    "test:vitest": "vitest",
    "test:vitest:run": "vitest run"
}
```

Remove: `test:karma`, `test:karma:debug`.

**devDependencies to add** (using `catalog:` where available):
- `@testing-library/jest-dom`
- `@vitejs/plugin-react`
- `jsdom`
- `vitest`

**devDependencies to remove** (after all migration is complete):
- `enzyme`
- `@blueprintjs/karma-build-scripts`
- `karma`
- `mocha`
- `react-test-renderer`
- `webpack-cli`

---

## Phase 1: Migrate Utility Tests (no Enzyme, assertions only)

These are pure function tests with zero DOM rendering. They validate the infrastructure setup with minimal risk.

| Old path | New path |
|----------|----------|
| `test/common/dateFormatPropsTests.ts` | `src/common/dateFormatProps.test.ts` |
| `test/common/timezoneMetadataTests.ts` | `src/common/timezoneMetadata.test.ts` |
| `test/common/timezoneUtilsTest.ts` | `src/common/timezoneUtils.test.ts` |
| `test/common/dateUtilsTests.tsx` | `src/common/dateUtils.test.ts` |

### Assertion conversion cheatsheet

| Chai | Vitest |
|------|--------|
| `import { expect } from "chai"` | `import { describe, expect, it } from "@blueprintjs/test-commons/vitest"` |
| `expect(x).to.equal(y)` | `expect(x).toBe(y)` |
| `expect(x).to.deep.equal(y)` | `expect(x).toEqual(y)` |
| `expect(x).to.be.true` | `expect(x).toBe(true)` |
| `expect(x).to.be.false` | `expect(x).toBe(false)` |
| `expect(x).to.be.null` | `expect(x).toBeNull()` |
| `expect(x).to.not.be.null` | `expect(x).not.toBeNull()` |
| `expect(x).to.be.undefined` | `expect(x).toBeUndefined()` |
| `expect(x).to.exist` | `expect(x).toBeDefined()` (or `.toBeTruthy()`) |
| `expect(x).to.have.length(n)` | `expect(x).toHaveLength(n)` |
| `expect(() => fn()).to.throw()` | `expect(() => fn()).toThrow()` |
| `expect(() => fn()).to.not.throw()` | `expect(() => fn()).not.toThrow()` |
| `assert.isTrue(x)` | `expect(x).toBe(true)` |
| `assert.isFalse(x)` | `expect(x).toBe(false)` |
| `assert.equal(a, b)` | `expect(a).toBe(b)` |
| `assert.strictEqual(a, b)` | `expect(a).toBe(b)` |
| `assert.deepEqual(a, b)` | `expect(a).toEqual(b)` |
| `assert.lengthOf(arr, n)` | `expect(arr).toHaveLength(n)` |
| `assert.doesNotThrow(() => fn())` | `expect(() => fn()).not.toThrow()` |

### Import path conversion

All tests move from `test/` into `src/`, so import paths shrink:
- `../../src/common/dateUtils` becomes `./dateUtils`
- `../../src/common/months` becomes `./months`
- `../../src/components/dateConstants` becomes `../components/dateConstants`
- `../../src` or `../../src/index` becomes specific module paths (never barrel re-exports)

---

## Phase 2: Migrate Test Utilities

Shared helpers used by component tests. Place in `src/common/` following the core pattern (see `packages/core/src/common/test-utils.ts` and `packages/core/src/components/slider/sliderTestUtils.ts`).

| Old path | New path | Changes needed |
|----------|----------|----------------|
| `test/common/dateFormat.ts` | `src/common/dateFormatTestUtils.ts` | Convert `require("date-fns/locale")` to ESM import, fix import paths |
| `test/common/loadDateFnsLocaleFake.ts` | `src/common/loadDateFnsLocaleFake.ts` | Fix import paths only (already clean ESM) |
| `test/common/dayPickerTestUtils.ts` | `src/common/dayPickerTestUtils.ts` | Full rewrite: Enzyme `ReactWrapper` to `HTMLElement`, Chai to vitest |

### dayPickerTestUtils rewrite

```ts
import { expect } from "@blueprintjs/test-commons/vitest";

import { Classes } from "./classes";

export function assertDayDisabled(day: HTMLElement, expectDisabled = true) {
    if (expectDisabled) {
        expect(day).toHaveClass(Classes.DATEPICKER3_DAY_DISABLED);
    } else {
        expect(day).not.toHaveClass(Classes.DATEPICKER3_DAY_DISABLED);
    }
}

export function assertDayHidden(day: HTMLElement, expectHidden = true) {
    const inner = day.querySelector(`.${Classes.DATEPICKER3_DAY}`);
    if (expectHidden) {
        expect(inner).toBeNull();
    } else {
        expect(inner).not.toBeNull();
    }
}
```

### dateFormat.ts conversion

The current file uses CommonJS `require()`:
```ts
const locales: { [localeCode: string]: Locale } = require("date-fns/locale");
```

Convert to ESM:
```ts
import * as Locales from "date-fns/locale";
```

---

## Phase 3: Migrate Component Tests (easiest to hardest)

### 3A. `timePicker` (776 lines) -- Easy

**Old:** `test/components/timePickerTests.tsx`
**New:** `src/components/time-picker/timePicker.test.tsx`

Already uses RTL (`render`, `screen`, `userEvent`, `fireEvent`). Only needs framework swap:

| Old | New |
|-----|-----|
| `import { assert, expect } from "chai"` | `import { describe, expect, it, vi } from "@blueprintjs/test-commons/vitest"` |
| `import { spy } from "sinon"` | use `vi.fn()` |
| `const onChange = spy()` | `const onChange = vi.fn()` |
| `onChange.calledOnce` | `expect(onChange).toHaveBeenCalledOnce()` |
| `onChange.notCalled` | `expect(onChange).not.toHaveBeenCalled()` |
| `onChange.firstCall.args[0]` | `onChange.mock.calls[0][0]` |
| `onChange.resetHistory()` | `onChange.mockClear()` |
| `assert.strictEqual(a, b)` | `expect(a).toBe(b)` |
| `expect(x).to.exist` | `expect(x).toBeInTheDocument()` or `expect(x).toBeTruthy()` |
| `expect(x?.classList.contains("foo")).to.be.true` | `expect(x).toHaveClass("foo")` |
| `import { Classes, TimePicker, ... } from "../../src"` | Import from specific modules: `import { TimePicker } from "./timePicker"`, `import { Classes } from "../../common"` |

### 3B. `dateInputMigrationUtils` (110 lines) -- Easy

**Old:** `test/dateInputMigrationUtilsTests.tsx`
**New:** `src/dateInputMigrationUtils.test.tsx`

- `mount(...)` becomes `render(...)` (just verifying no errors)
- Chai assertions become vitest assertions
- Fix import paths

### 3C. `timezoneSelect` (206 lines) -- Medium

**Old:** `test/components/timezoneSelectTests.tsx`
**New:** `src/components/timezone-select/timezoneSelect.test.tsx`

Key Enzyme patterns to replace:

| Old (Enzyme) | New (RTL) |
|--------------|-----------|
| `mount(<TimezoneSelect {...props} />)` | `render(<TimezoneSelect {...props} />)` |
| `wrapper.find(Select)` | N/A -- query rendered DOM instead |
| `wrapper.find(Button).simulate("click")` | `await userEvent.click(screen.getByRole("button"))` |
| `wrapper.find(MenuItem)` (count items) | `screen.getAllByRole("menuitem")` |
| `wrapper.find(InputGroup).prop("value")` | `screen.getByRole("textbox").value` or `expect(input).toHaveValue(...)` |
| `wrapper.setState({ query: "..." })` | `await userEvent.type(screen.getByRole("textbox"), "...")` |
| `sinon.spy()` for `onChange` | `vi.fn()` |

Prop-checking (`findSelect(wrapper).prop("items").length`) must become behavior-checking (count rendered menu items when popover is open). Use `popoverProps: { isOpen: true, usePortal: false }` to keep content in the DOM.

### 3D. `datePicker` (916 lines) -- Medium-Hard

**Old:** `test/components/datePickerTests.tsx`
**New:** `src/components/date-picker/datePicker.test.tsx`

The existing tests use a `wrap()` harness that returns helper methods. Rewrite as an RTL harness:

```ts
function renderDatePicker(props: Partial<DatePickerProps> = {}) {
    const result = render(
        <DatePicker dateFnsLocaleLoader={loadDateFnsLocaleFake} {...props} />
    );
    return {
        ...result,
        assertSelectedDays: (...days: number[]) => {
            const selected = result.container.querySelectorAll(
                `.${Classes.DATEPICKER3_DAY_SELECTED}`
            );
            expect(Array.from(selected).map(d => Number(d.textContent))).toEqual(
                expect.arrayContaining(days)
            );
        },
        clickNextMonth: () => {
            fireEvent.click(
                result.container.querySelector(`.${Classes.DATEPICKER3_NAV_BUTTON_NEXT}`)!
            );
        },
        getDay: (dayNumber: number) => {
            const days = result.container.querySelectorAll(`.${Classes.DATEPICKER3_DAY}`);
            return Array.from(days).find(
                d => d.textContent === `${dayNumber}` &&
                     !d.classList.contains(Classes.DATEPICKER3_DAY_OUTSIDE)
            );
        },
    };
}
```

Key replacements:
- `root.state("selectedDay")` -- check DOM for `.DATEPICKER3_DAY_SELECTED` class
- `root.state("value")` -- check what `onChange` callback received
- `root.find(Day)` -- `container.querySelectorAll(`.${Classes.DATEPICKER3_DAY}`)`
- Month/year selects -- `container.querySelector(`.${Classes.DATEPICKER_MONTH_SELECT} select`)`
- Uses migrated `assertDayDisabled`, `assertDayHidden`, `loadDateFnsLocaleFake` from Phase 2

### 3E. `dateInput` (978 lines) -- Medium-Hard

**Old:** `test/components/dateInputTests.tsx`
**New:** `src/components/date-input/dateInput.test.tsx`

Key patterns:

| Old | New |
|-----|-----|
| `mount(<DateInput {...props} />)` | `render(<DateInput {...props} />)` |
| `focusInput(wrapper)` | `await userEvent.click(screen.getByRole("textbox"))` or `fireEvent.focus(...)` |
| `assertPopoverIsOpen(wrapper)` | `expect(container.querySelector(\`.${CoreClasses.POPOVER_OPEN}\`)).toBeInTheDocument()` |
| `wrapper.find(TimezoneSelect).exists()` | Check for timezone DOM elements |
| `wrapper.find(Popover)` | Check for popover content presence in DOM |
| `wrapper.find(InputGroup).find("input")` | `screen.getByRole("textbox")` |
| `clickCalendarDay(wrapper, 15)` | Find day element by text+class, `fireEvent.click(...)` |
| `setTimeUnit(wrapper, unit, val)` | Find time input by class, `fireEvent.change(...)` |

All test renders should pass `popoverProps: { usePortal: false }` and `dateFnsLocaleLoader: loadDateFnsLocaleFake` explicitly.

### 3F. `dateRangePicker` (1,505 lines) -- Hard

**Old:** `test/components/dateRangePickerTests.tsx`
**New:** `src/components/date-range-picker/dateRangePicker.test.tsx`

Requires rewriting the dual-calendar harness:

```ts
function getDayPickerHarness(container: HTMLElement, side: "left" | "right") {
    const months = container.querySelectorAll(".rdp-month");
    const monthEl = months[side === "left" ? 0 : 1];
    return {
        clickDay: (dayNumber: number) => {
            const day = findDayInMonth(monthEl, dayNumber);
            fireEvent.click(day!);
        },
        findDay: (dayNumber: number) => findDayInMonth(monthEl, dayNumber),
        mouseEnterDay: (dayNumber: number) => {
            fireEvent.mouseEnter(findDayInMonth(monthEl, dayNumber)!);
        },
        assertDisplayMonth: (expectedMonth: number) => {
            // Parse caption label text
        },
    };
}
```

Key replacements:
- `wrapper.state("value")` -- check `onChange` spy args instead
- `wrapper.state("hoverValue")` -- check hover-related CSS classes in DOM
- `(DateRangePicker.defaultProps as ...).dateFnsLocaleLoader = loadDateFnsLocaleFake` -- pass explicitly in render helper
- `mouseEnterDay()` -- `fireEvent.mouseEnter(dayElement)`

### 3G. `dateRangeInput` (3,183 lines) -- Very Hard

**Old:** `test/components/dateRangeInputTests.tsx`
**New:** `src/components/date-range-input/dateRangeInput.test.tsx`

This is the largest and most complex file. Key challenges and solutions:

| Challenge | Solution |
|-----------|----------|
| `root.setState({ isOpen: true })` (opens popover) | `await userEvent.click(startInput)` (click input to open) |
| `root.state("isStartInputFocused")` | `document.activeElement === startInputElement` |
| `root.state("isEndInputFocused")` | `document.activeElement === endInputElement` |
| `root.state("startInputString")` | Read from `startInput.value` |
| `(DateRangeInput.defaultProps as ...).popoverProps = { usePortal: false }` | Pass explicitly in render helper |
| `(DateRangeInput.defaultProps as ...).dateFnsLocaleLoader = loadDateFnsLocaleFake` | Pass explicitly in render helper |
| `getStartInput(root).simulate("change", { target: { value } })` | `fireEvent.change(startInput, { target: { value } })` |
| `getStartInput(root).simulate("focus")` | `fireEvent.focus(startInput)` |
| `getStartInput(root).simulate("blur")` | `fireEvent.blur(startInput)` |
| `getDayElement(root, 15)` | `container.querySelectorAll` by class, filter by text |

Render helper pattern:
```ts
function renderDateRangeInput(props: Partial<DateRangeInputProps> = {}) {
    const result = render(
        <DateRangeInput
            {...DATE_FORMAT}
            dateFnsLocaleLoader={loadDateFnsLocaleFake}
            popoverProps={{ usePortal: false }}
            {...props}
        />
    );
    const inputs = result.container.querySelectorAll("input");
    return {
        ...result,
        startInput: inputs[0] as HTMLInputElement,
        endInput: inputs[1] as HTMLInputElement,
        getDayElement: (dayNumber: number) => { /* ... */ },
        assertInputValuesEqual: (startValue: string, endValue: string) => {
            expect(inputs[0]).toHaveValue(startValue);
            expect(inputs[1]).toHaveValue(endValue);
        },
    };
}
```

The parameterized test functions (`OutOfRangeTestFunction`, `InvalidDateTestFunction`) can remain parameterized -- just update their internals.

---

## Phase 4: Migrate Isotest

**Old:** `test/isotest.mjs`
**New:** `src/isotest.test.ts`

Model on `packages/core/src/isotest.test.ts`:
- `import { describe } from "vitest"` (isotest is the one exception that imports from vitest directly)
- `generateIsomorphicTestsVitest` from `@blueprintjs/test-commons`
- `import * as DateTime from "./index"` (import from source, not built output)

---

## Phase 5: Cleanup

1. Delete `packages/datetime/test/` directory entirely
2. Delete `packages/datetime/karma.conf.js`
3. Remove old devDependencies from `package.json`: `enzyme`, `@blueprintjs/karma-build-scripts`, `karma`, `mocha`, `react-test-renderer`, `webpack-cli`
4. Run `pnpm test` in datetime package to verify all tests pass
5. Run monorepo build/test to verify no cross-package breakage

---

## Sinon to Vitest Mocking Cheatsheet

| Sinon | Vitest |
|-------|--------|
| `sinon.spy()` / `spy()` | `vi.fn()` |
| `sinon.stub(obj, "method")` | `vi.spyOn(obj, "method").mockImplementation(...)` |
| `spy.calledOnce` | `expect(spy).toHaveBeenCalledOnce()` |
| `spy.calledWith(a, b)` | `expect(spy).toHaveBeenCalledWith(a, b)` |
| `spy.callCount` | `expect(spy).toHaveBeenCalledTimes(n)` |
| `spy.notCalled` | `expect(spy).not.toHaveBeenCalled()` |
| `spy.args[n]` / `spy.getCall(n).args` | `spy.mock.calls[n]` |
| `spy.firstCall.args[0]` | `spy.mock.calls[0][0]` |
| `spy.resetHistory()` | `spy.mockClear()` |
| `spy.restore()` | `spy.mockRestore()` |
| `stub.callsFake(fn)` | `spy.mockImplementation(fn)` |
| `stub.returns(val)` | `spy.mockReturnValue(val)` |
| `SinonSpy` / `SinonStub` types | `MockInstance` type (from `@blueprintjs/test-commons/vitest`) |

## Enzyme to RTL Rendering Cheatsheet

| Enzyme | RTL |
|--------|-----|
| `const wrapper = mount(<Comp />)` | `render(<Comp />)` or `const { container } = render(...)` |
| `wrapper.find(".my-class")` | `container.querySelector(".my-class")` |
| `wrapper.find(".my-class").exists()` | `container.querySelector(".my-class") !== null` |
| `wrapper.find(".my-class").text()` | `element.textContent` or `screen.getByText(...)` |
| `wrapper.find(ChildComponent)` | `screen.getByRole(...)` / `screen.getByText(...)` / querySelector by class |
| `wrapper.find(ChildComponent).prop("foo")` | Test the DOM effect of the prop instead |
| `wrapper.state("isOpen")` | Test observable behavior (is content visible?) |
| `wrapper.setState({ foo: "bar" })` | Drive state via user interaction |
| `wrapper.setProps({ foo: "bar" })` | `rerender(<Comp foo="bar" />)` |
| `wrapper.simulate("click")` | `await userEvent.click(element)` |
| `wrapper.simulate("change", { target: { value } })` | `fireEvent.change(element, { target: { value } })` |
| `wrapper.simulate("focus")` | `fireEvent.focus(element)` |
| `wrapper.simulate("blur")` | `fireEvent.blur(element)` |
| `wrapper.simulate("keydown", { key: "Escape" })` | `fireEvent.keyDown(element, { key: "Escape" })` |
| `wrapper.simulate("mouseenter")` | `fireEvent.mouseEnter(element)` |
| `wrapper.unmount()` | Automatic via setup file cleanup |
| `wrapper.hostNodes()` | Not needed (RTL queries return DOM nodes) |

---

## Key Technical Gotchas

### 1. TZ=UTC Environment Variable
The old `karma.conf.js` sets `process.env.TZ = "Etc/UTC"`. Many datetime tests depend on UTC. Vitest doesn't have a built-in `env` config for this. Options:
- Set `TZ=Etc/UTC` in the test script: `"test:vitest:run": "TZ=Etc/UTC vitest run"`
- Or set it in a custom setup file

### 2. Sinon partial matching vs Vitest exact matching
Sinon's `calledWith(a, b)` does **partial** argument matching. Vitest's `toHaveBeenCalledWith(a, b)` requires an **exact** match on all arguments. When callbacks receive a React SyntheticEvent that the test doesn't care about, use `expect.anything()`:
```ts
// Old: onChange.calledWith(newDate)  -- ignores extra event arg
// New: expect(onChange).toHaveBeenCalledWith(newDate, expect.anything())
```
If Vitest tries to serialize a SyntheticEvent for a failed assertion, it may OOM due to circular refs. Using `expect.anything()` prevents this.

### 3. No `wrapper.setState()` in RTL
RTL has no equivalent of `wrapper.setState()`. Every internal state change must be driven through user interactions:
- Opening popover: click the input
- Focusing an input: `fireEvent.focus(input)` or `await userEvent.click(input)`
- Setting a value: `fireEvent.change(input, { target: { value: "..." } })`

### 4. `defaultProps` mutation is an anti-pattern
Several tests mutate component `defaultProps` to inject test dependencies:
```ts
(DateRangeInput.defaultProps as DateRangeInputProps).dateFnsLocaleLoader = loadDateFnsLocaleFake;
```
Replace with explicit prop passing in a render helper function.

### 5. `wrapper.find(ComponentType)` has no RTL equivalent
Enzyme can find React component instances by type. RTL queries the DOM:
- `wrapper.find(Button)` -- `screen.getByRole("button")` or `container.querySelector(`.${CoreClasses.BUTTON}`)`
- `wrapper.find(Popover)` -- check for `.POPOVER_OPEN` class or popover content
- `wrapper.find(InputGroup)` -- `screen.getByRole("textbox")`
- `wrapper.find(Select)` / `wrapper.find(QueryList)` -- test rendered behavior instead

### 6. `dateFormat.ts` uses CommonJS `require()`
Convert `const locales = require("date-fns/locale")` to `import * as Locales from "date-fns/locale"`.

### 7. Portaled content
For components using Portals (Popover, Overlay), use `baseElement` instead of `container`:
```ts
const { baseElement } = render(<DateInput {...props} />);
const popoverContent = baseElement.querySelector(`.${Classes.POPOVER}`);
```
Alternatively, set `popoverProps: { usePortal: false }` in tests to keep content in the container.

### 8. `userEvent` vs `fireEvent`
- Use `userEvent` for realistic user interactions (click, type, keyboard) -- these are **async**
- Use `fireEvent` for low-level events that `userEvent` doesn't support well (mouseEnter, mouseLeave, specific keyDown on non-interactive elements) -- these are **sync**
- Every test using `userEvent` must be `async` and call `userEvent.setup()` first

---

## Execution Order

| Step | What | Verify with |
|------|------|-------------|
| 1 | Phase 0: Infrastructure (configs, tsconfig, package.json) | `pnpm compile:esm` passes |
| 2 | Phase 1A: `dateFormatProps.test.ts` | `pnpm test:vitest:run` |
| 3 | Phase 1B: `timezoneMetadata.test.ts` | `pnpm test:vitest:run` |
| 4 | Phase 1C: `timezoneUtils.test.ts` | `pnpm test:vitest:run` |
| 5 | Phase 1D: `dateUtils.test.ts` | `pnpm test:vitest:run` |
| 6 | Phase 2: Test utilities (dateFormatTestUtils, loadDateFnsLocaleFake, dayPickerTestUtils) | Compilation only |
| 7 | Phase 3A: `timePicker.test.tsx` | `pnpm test:vitest:run` |
| 8 | Phase 3B: `dateInputMigrationUtils.test.tsx` | `pnpm test:vitest:run` |
| 9 | Phase 3C: `timezoneSelect.test.tsx` | `pnpm test:vitest:run` |
| 10 | Phase 3D: `datePicker.test.tsx` | `pnpm test:vitest:run` |
| 11 | Phase 3E: `dateInput.test.tsx` | `pnpm test:vitest:run` |
| 12 | Phase 3F: `dateRangePicker.test.tsx` | `pnpm test:vitest:run` |
| 13 | Phase 3G: `dateRangeInput.test.tsx` | `pnpm test:vitest:run` |
| 14 | Phase 4: `isotest.test.ts` | `pnpm test:iso` |
| 15 | Phase 5: Cleanup (delete test/, karma.conf.js, old deps) | `pnpm test` (full suite) |

---

## Reference Files

- `packages/core/vitest.config.mts` -- vitest config reference
- `packages/core/vitest.config.isotest.mts` -- isotest config reference
- `packages/core/src/vitest-env.d.ts` -- vitest env types reference
- `packages/core/src/tsconfig.json` -- project references root
- `packages/core/src/tsconfig.build.json` -- build config (excludes tests)
- `packages/core/src/tsconfig.test.json` -- test config (includes everything)
- `packages/core/src/components/tooltip/tooltip.test.tsx` -- RTL test reference (modern pattern)
- `packages/core/src/components/alert/alert.test.tsx` -- RTL test reference with portals
- `packages/core/src/isotest.test.ts` -- isotest reference
- `packages/labs/vitest.config.mts` -- no-enzyme vitest config reference
- `packages/test-commons/src/vitest.ts` -- re-exported vitest globals
- `packages/test-commons/vitest-setup-no-enzyme.mts` -- setup file reference
