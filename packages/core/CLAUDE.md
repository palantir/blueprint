## 1. App Setup

Every Blueprint app requires these foundational pieces.

```tsx
// 1. CSS imports — order matters
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
// Add per-package CSS when using that package:
// import "@blueprintjs/select/lib/css/blueprint-select.css";
// import "@blueprintjs/table/lib/css/table.css";
// import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

// 2. Focus management
import { FocusStyleManager } from "@blueprintjs/core";
FocusStyleManager.onlyShowFocusOnTabs();

// 3. BlueprintProvider wraps the entire app
import { BlueprintProvider } from "@blueprintjs/core";
root.render(
  <BlueprintProvider>
    <App />
  </BlueprintProvider>,
);
```

Forgetting `<BlueprintProvider>` silently breaks overlays, toasters, and hotkeys.

---

## 2. Use This, Not That — Component Selection

Blueprint provides purpose-built components for most common UI patterns. **Always prefer the first-class Blueprint component over a raw HTML element or a generic workaround.** This table covers the most frequent mistakes.

| Instead of… | Use… | Why |
|---|---|---|
| `<button>` | `<Button>` from `@blueprintjs/core` | Consistent styling, `intent`, `loading`, `icon` props |
| `<input>` | `<InputGroup>` | Left icon, right element, intent validation styling |
| `<input type="date">` | `<DateInput>` from `@blueprintjs/datetime` | Calendar popover, locale formatting, range constraints |
| `<input type="number">` | `<NumericInput>` | Increment/decrement buttons, min/max/step, intent |
| `<input type="file">` | `<FileInput>` | Styled upload button with customizable text |
| `<select>` / `<HTMLSelect>` | `<Select>` from `@blueprintjs/select` | Typeahead filtering, keyboard nav, custom item rendering |
| Multiple `<select>` | `<MultiSelect>` from `@blueprintjs/select` | Tag-based multi-selection with filtering |
| `<textarea>` | `<TextArea>` | Auto-resize, Blueprint styling |
| `<table>` | `<HTMLTable>` (simple) or `<Table2>` (data-heavy) | Themed rows, striped/compact options; virtual scrolling |
| `<div>` as container | `<Card>` | Elevation, padding, interactive prop |
| Custom empty state | `<NonIdealState>` | Standardized empty/error/no-results pattern |
| Custom alert banner | `<Callout>` with `intent` | Consistent visual language for info/warning/error |
| `<div onClick>` toggle | `<Switch>` or `<Checkbox>` | Accessible, labeled, Blueprint-styled |
| Manual tab switching | `<Tabs>` / `<Tab>` | Keyboard nav, controlled/uncontrolled, panel rendering |
| `window.alert()` / `window.confirm()` | `<Alert>` | Themed modal with configurable intent buttons |
| Custom modal | `<Dialog>` / `<DialogBody>` / `<DialogFooter>` | Focus trap, backdrop, standardized layout |
| Inline loading text | `<Spinner>` | Consistent size and theming |
| Custom section header + collapse | `<Section>` | Built-in title, subtitle, icon, collapse, right element |
| Custom label + value chip | `<CompoundTag>` | Built-in left/right content, intent, minimal variant |

### Key Principle

If you find yourself building something that "looks like" a Blueprint component, stop and use the real one. The Blueprint version handles edge cases (keyboard nav, focus management, dark mode, RTL) that a custom implementation will miss.

---

## 3. Deprecated API — Modern Prop Usage

Blueprint v6 has migrated away from several boolean props. **Always use the modern equivalents.**

### Sizing

```tsx
// ❌ Deprecated
<Button large />
<Button small />
<InputGroup large />

// ✅ Modern
<Button size="large" />
<Button size="small" />
<InputGroup size="large" />
```

The `size` prop accepts `"small" | "medium" | "large"`. This applies to Button, InputGroup, NumericInput, Spinner, Tag, and most interactive components.

### Button Variants

```tsx
// ❌ Deprecated
<Button minimal />
<Button outlined />
<Button minimal={true} />

// ✅ Modern
<Button variant="minimal" />
<Button variant="outlined" />
<Button variant="solid" />   // default, rarely needs to be explicit
```

### Class Constants

```tsx
// ❌ Fragile — prefix changes between major versions
className="bp6-dark"
className="bp6-running-text"

// ✅ Stable
import { Classes } from "@blueprintjs/core";
className={Classes.DARK}
className={Classes.RUNNING_TEXT}
```

---

## 4. Taste & Aesthetics — Making It Look Like Blueprint

Correct API usage is necessary but not sufficient. Great Blueprint UIs have a specific visual feel. Follow these guidelines to produce UIs that feel native to the design system.

### 4.1 Section for Structured Content

`<Section>` is one of the most underused components. It provides a titled, optionally collapsible card with a structured header — saving you from building custom heading + divider + collapse logic.

```tsx
import { Section, SectionCard } from "@blueprintjs/core";

<Section
  title="Personal Information"
  subtitle="Required fields for your application"
  icon="person"
  collapsible={true}
>
  <SectionCard>{/* form fields here */}</SectionCard>
</Section>
```

Use `Section` whenever content has a natural grouping with a label — form groups, settings panels, dashboard widgets, detail panes.

### 4.2 CompoundTag for Key-Value Display

`<CompoundTag>` is perfect for displaying labeled metadata, status indicators, or key-value pairs inline.

```tsx
import { CompoundTag } from "@blueprintjs/core";

<CompoundTag leftContent="Status" intent="success" variant="minimal">Healthy</CompoundTag>
<CompoundTag leftContent="Region" variant="minimal">us-east-1</CompoundTag>
<CompoundTag leftContent="Latency" intent="warning" variant="minimal">230ms</CompoundTag>
```

Use `variant="minimal"` on CompoundTag for a lighter, more modern appearance — especially in data-dense UIs where solid tags would create too much visual weight.

### 4.3 Intent — Use It with Purpose

The `intent` prop communicates meaning through color. Use it deliberately:

| Intent | Color | When to use |
|---|---|---|
| `"none"` | Gray | Default / neutral actions |
| `"primary"` | Blue | The single main action on a page or section |
| `"success"` | Green | Positive confirmation, healthy status |
| `"warning"` | Orange | Caution, degraded status, destructive-but-recoverable |
| `"danger"` | Red | Destructive actions, errors, critical status |

**Rules of thumb:**
- There should be at most **one** `intent="primary"` button visible at a time. If everything is primary, nothing is.
- Use `intent` on `<Callout>`, `<Tag>`, `<CompoundTag>`, and `<Button>` — not on decorative elements like icons unless the icon genuinely represents status.
- Don't use `intent="primary"` on an icon just to make it blue. Use `className={Classes.TEXT_MUTED}` or the icon's natural color instead.

### 4.4 Button Hierarchy

In any group of actions, establish a clear visual hierarchy:

```tsx
// Primary action: solid + primary intent
<Button intent="primary" text="Submit Application" />

// Secondary action: outlined, no intent
<Button variant="outlined" text="Save Draft" />

// Tertiary/cancel: minimal, no intent
<Button variant="minimal" text="Cancel" />
```

### 4.5 Loading vs Disabled

These are different states with different meanings. Don't conflate them.

```tsx
// Loading — action is in progress, user should wait
<Button intent="primary" loading={true} text="Submitting…" />

// Disabled — action is not available (e.g., form is incomplete)
<Button intent="primary" disabled={true} text="Submit" />
```

`loading={true}` shows a spinner inside the button and prevents clicks. `disabled={true}` grays out the button. Use `loading` when an async action is in flight; use `disabled` when preconditions aren't met.

`EntityTitle` also supports a `loading` prop for skeleton placeholder states.

### 4.6 Minimal Variants for Data-Dense UIs

When building dashboards, tables, or detail panels with lots of metadata, prefer `variant="minimal"` on Tags, CompoundTags, and Buttons to reduce visual clutter. Reserve solid/outlined variants for primary actions and key status indicators.

### 4.7 Typography

Use Blueprint's heading components rather than custom-styled headings:

```tsx
import { H1, H2, H3, H4, H5, H6 } from "@blueprintjs/core";

// For running prose, wrap in a container with the running-text class
<div className={Classes.RUNNING_TEXT}>
  <p>Long-form text gets better spacing and readability.</p>
</div>
```

Don't apply custom font families or hardcoded font sizes. Blueprint's typography is calibrated for data-dense desktop UIs.

---

## 5. Form Patterns & Validation

### 5.1 FormGroup for Every Field

Wrap every form control in a `<FormGroup>` to get consistent label, helper text, and validation styling:

```tsx
import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";

<FormGroup
  label="Email Address"
  labelFor="email-input"
  labelInfo="(required)"
  helperText={emailError || "We'll use this for your application confirmation."}
  intent={emailError ? Intent.DANGER : Intent.NONE}
>
  <InputGroup
    id="email-input"
    placeholder="you@example.com"
    type="email"
    intent={emailError ? Intent.DANGER : Intent.NONE}
    value={email}
    onChange={handleEmailChange}
  />
</FormGroup>
```

### 5.2 Validation Patterns

Blueprint doesn't include a validation library, but it provides the visual hooks. Pair with your validation logic:

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validateEmail = (value: string): string | undefined => {
  if (!value) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
  return undefined;
};

const validatePhone = (value: string): string | undefined => {
  if (!value) return undefined; // optional field
  if (!/^\+?[\d\s-()]{7,}$/.test(value)) return "Invalid phone number";
  return undefined;
};

// On blur or submit, validate and set intent accordingly
const handleBlur = (field: string, validator: (v: string) => string | undefined) => {
  const error = validator(values[field]);
  setErrors(prev => ({ ...prev, [field]: error }));
};
```

**Key validation rules:**
- Show `intent={Intent.DANGER}` on both `FormGroup` and its child control when validation fails.
- Display error messages via `FormGroup`'s `helperText` prop — not in a separate `<Callout>` or `<div>`.
- Validate on blur for individual fields; validate all on submit.
- Mark required fields with `labelInfo="(required)"` on `FormGroup`.

### 5.3 Submission Flow

```tsx
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);

const handleSubmit = async () => {
  // 1. Validate all fields
  const allErrors = validateAll(values);
  if (Object.keys(allErrors).length > 0) {
    setErrors(allErrors);
    return;
  }

  // 2. Show loading state
  setIsSubmitting(true);

  try {
    await submitForm(values);
    // 3. Show success
    setSubmitSuccess(true);
  } catch (err) {
    // 4. Show error callout
    setSubmitError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

// In JSX:
{submitSuccess && (
  <Callout intent={Intent.SUCCESS} icon="tick-circle" title="Application submitted">
    We'll be in touch within 3 business days.
  </Callout>
)}
{submitError && (
  <Callout intent={Intent.DANGER} icon="error" title="Submission failed">
    {submitError}
  </Callout>
)}
<Button
  intent={Intent.PRIMARY}
  text={isSubmitting ? "Submitting…" : "Submit Application"}
  loading={isSubmitting}
  disabled={submitSuccess}
  onClick={handleSubmit}
/>
```

### 5.4 Use First-Class Form Components

This bears repeating with concrete examples:

```tsx
// ❌ Wrong — using InputGroup as a date picker
<InputGroup type="date" />

// ✅ Right — using the actual DateInput component
import { DateInput } from "@blueprintjs/datetime";
<DateInput
  formatDate={date => date.toLocaleDateString()}
  parseDate={str => new Date(str)}
  placeholder="MM/DD/YYYY"
/>

// ❌ Wrong — using InputGroup for phone numbers with no validation
<InputGroup type="tel" />

// ✅ Right — InputGroup is fine here, but add validation
<FormGroup
  label="Phone Number"
  intent={phoneError ? Intent.DANGER : Intent.NONE}
  helperText={phoneError}
>
  <InputGroup
    type="tel"
    placeholder="+1 (555) 123-4567"
    intent={phoneError ? Intent.DANGER : Intent.NONE}
    onBlur={() => handleBlur("phone", validatePhone)}
  />
</FormGroup>

// ❌ Wrong — using HTMLSelect
<HTMLSelect options={["Engineering", "Design", "Sales"]} />

// ✅ Right — using Select for typeahead and custom rendering
import { Select } from "@blueprintjs/select";
<Select<string>
  items={departments}
  itemRenderer={renderDepartment}
  itemPredicate={filterDepartment}
  onItemSelect={setSelectedDepartment}
>
  <Button text={selectedDepartment ?? "Choose department…"} rightIcon="caret-down" />
</Select>
```

---

## 6. Overlays — Choosing the Right One

Blueprint provides several overlay components, each designed for a specific interaction pattern. Choosing the wrong one creates awkward UX. Use this guide to pick correctly.

### 6.1 Overlay Decision Guide

| Need | Component | Key Traits |
|---|---|---|
| Force user to acknowledge something before continuing | `<Alert>` | Modal, blocking. Has confirm + optional cancel buttons with `intent`. User **must** interact to dismiss. |
| Present structured content or a form over the UI | `<Dialog>` | Modal with header/body/footer sections. Use `<DialogBody>` and `<DialogFooter>` for layout. Built on `Overlay2`. |
| Show a panel anchored to a screen edge | `<Drawer>` | Slides in from top/bottom/left/right. Good for detail panes, settings, or secondary workflows. Built on `Overlay2`. |
| Show actions on right-click | `<ContextMenu>` | Generates an opinionated `Popover` instance with the right interaction handlers. Renders a `<Menu>` on right-click. |
| Show a floating UI element anchored to a target | `<PopoverNext>` | Built on Floating UI for modern positioning. Use for menus, forms, pickers, or any content anchored to a trigger element. **Prefer this over the deprecated `<Popover>`.** |
| Show a brief hint on hover/focus | `<Tooltip>` | Lightweight popover for contextual help. Appears on hover/focus, disappears on leave/blur. Don't overload with complex content — use `PopoverNext` if you need interactivity. |
| Show an ephemeral notification in response to an action | `<Toast>` via `OverlayToaster` | Lightweight, auto-dismissing notice. Can appear at top or bottom. Multiple toasts can stack on screen simultaneously. |

### 6.2 Alert vs Dialog

This could be a source of confusion:

- **Alert** = simple acknowledgment or yes/no confirmation. "Are you sure you want to delete this?" Use the `intent` prop on the confirm button to signal severity.
- **Dialog** = structured content with a body and potentially multiple form fields, tabs, or complex layout. "Edit your profile settings."

If your overlay has more than a message and one or two buttons, it's a Dialog, not an Alert.

### 6.3 PopoverNext vs Tooltip

- **Tooltip** = non-interactive, text-only hints. Appears on hover, gone on leave. No buttons, no links, no forms inside.
- **PopoverNext** = interactive content anchored to a trigger. Menus, date pickers, forms, anything the user clicks into.

If the user needs to interact with the overlay content, use `PopoverNext`. If they just need to read a hint, use `Tooltip`.

### 6.4 Toast Usage

Toasts are created via `OverlayToaster`, not by rendering a `<Toast>` component directly:

```tsx
import { OverlayToaster, Intent } from "@blueprintjs/core";

const toaster = OverlayToaster.create();

// Show a toast
toaster.show({
  message: "File saved successfully.",
  intent: Intent.SUCCESS,
  icon: "tick",
});
```

Use toasts for ephemeral feedback — "saved," "copied," "sent." Don't use them for errors that require user action (use `Callout` or `Alert` instead).

### 6.5 Deprecated Overlay Components

- **`Popover`** — deprecated in favor of `PopoverNext` (built on Floating UI). Always use `PopoverNext`.
- **`Overlay`** — deprecated in favor of `Overlay2`. If building custom overlay behavior, use `Overlay2`.

---

## 7. Lesser-Known Components Worth Knowing

Several Blueprint components are underused because developers don't know they exist. Reach for these before building custom solutions.

### 7.1 PanelStack — Drill-Down Navigation

`<PanelStack>` manages a stack of panels, displaying only the topmost one. Each panel gets a header with a "back" button to return to the previous panel. The bottom-most panel cannot be closed.

```tsx
import { PanelStack2 } from "@blueprintjs/core";

const initialPanel = {
  renderPanel: MainListPanel,
  title: "Items",
};

<PanelStack2
  initialPanel={initialPanel}
  onOpen={handlePanelOpen}
  renderActivePanelOnly={false}  // keep all panels mounted to preserve state
/>
```

Use `PanelStack` for master-detail patterns, settings with sub-pages, or any drill-down navigation within a bounded container. By default only the active panel is rendered, so component state resets when navigating back — set `renderActivePanelOnly={false}` if you need to preserve state across panels.

### 7.2 Skeleton — CSS-Based Loading State

`Skeleton` is not a component — it's a CSS class (`Classes.SKELETON`) that you apply to any element to cover its content with a loading animation. The skeleton inherits the element's dimensions, so provide realistic placeholder content.

```tsx
import { Classes } from "@blueprintjs/core";

// Loading state — skeleton covers the text
<div className={isLoading ? Classes.SKELETON : undefined}>
  John Doe — Software Engineer
</div>

// Placeholder content gives the skeleton its shape
<H3 className={Classes.SKELETON}>Placeholder Title</H3>
<p className={Classes.SKELETON}>
  This text won't be visible but defines the skeleton's size.
</p>
```

**Important:** When applying `Classes.SKELETON` to focusable elements (inputs, buttons), you **must** also disable them with `disabled` or `tabIndex={-1}`. Otherwise users can focus and interact with invisible skeleton elements.

Use `Skeleton` for inline loading states where you want to hint at the shape of upcoming content. Use `<Spinner>` for general "something is loading" indicators. Use `<NonIdealState>` for full-section loading placeholders.

### 7.3 ProgressBar — Determinate & Indeterminate Progress

```tsx
import { ProgressBar, Intent } from "@blueprintjs/core";

// Determinate — shows specific progress
<ProgressBar value={0.65} intent={Intent.PRIMARY} />

// Indeterminate — shows that work is happening
<ProgressBar intent={Intent.PRIMARY} />
```

Use `ProgressBar` for file uploads, multi-step processes, or any operation where you can (or can't) report progress. Supports `intent` for semantic coloring and `stripes` / `animate` props.

### 7.4 Tree — Hierarchical Data Display

`<Tree>` renders hierarchical data with expandable/collapsible nodes, icons, and selection.

```tsx
import { Tree, type TreeNodeInfo } from "@blueprintjs/core";

const nodes: TreeNodeInfo[] = [
  {
    id: 0, label: "src", icon: "folder-close", isExpanded: true,
    childNodes: [
      { id: 1, label: "index.tsx", icon: "document" },
      { id: 2, label: "App.tsx", icon: "document" },
    ],
  },
];

<Tree
  contents={nodes}
  onNodeClick={handleNodeClick}
  onNodeExpand={handleNodeExpand}
  onNodeCollapse={handleNodeCollapse}
/>
```

Use `Tree` for file explorers, org charts, nested categories, or any hierarchical data. Each node supports `icon`, `secondaryLabel` (right-aligned content), `isSelected`, and `isExpanded`.

---

### 8 className, not wrapper divs

Pass `className` directly to Blueprint components rather than wrapping them:

```tsx
// ❌ Wrapper div for spacing
<div style={{ marginBottom: 16 }}>
  <Card>…</Card>
</div>

// ✅ Direct className
<Card className="my-card">{/* content */}</Card>
```

---

## 9. Styling with SCSS Variables

Always use Blueprint SCSS variables instead of hardcoded values.

```scss
@use "@blueprintjs/core/lib/scss/variables.scss" as bp;
```

| Category | Variable | Value |
|---|---|---|
| Text | `bp.$pt-text-color` | Default text |
| Muted text | `bp.$pt-text-color-muted` | Secondary text |
| Disabled text | `bp.$pt-text-color-disabled` | Disabled state |
| Semantic blue | `bp.$blue3` | Primary accent |
| Semantic red | `bp.$red3` | Danger accent |
| Semantic green | `bp.$green3` | Success accent |
| Semantic orange | `bp.$orange3` | Warning accent |
| Background | `bp.$white`, `bp.$light-gray5` | Light surfaces |
| Font size | `bp.$pt-font-size` | 14px (standard) |
| Font small | `bp.$pt-font-size-small` | 12px |
| Font large | `bp.$pt-font-size-large` | 16px |
| Spacing unit | `bp.$pt-spacing` | 4px base unit |
| Common gaps | `bp.$pt-spacing * 2` through `* 5` | 8px, 12px, 16px, 20px |

**Dont hardcode:**
- Hex colors like `#111418` or `gray`
- Pixel font sizes like `font-size: 14px`
- Pixel spacing like `gap: 8px` or `margin: 10px`

Using variables ensures automatic dark mode compatibility. Blueprint components respond to the `.bp6-dark` class on any ancestor element — hardcoded colors break this.

---

## 10. Loading, Error, and Empty States

Use standardized patterns — don't build custom versions.

```tsx
// Loading
<Spinner />                          // full-size
<Spinner size={SpinnerSize.SMALL} /> // inline

// Error
<NonIdealState
  icon="error"
  title="Something went wrong"
  description={errorMessage}
  action={<Button text="Retry" onClick={handleRetry} />}
/>

// Empty / no results
<NonIdealState
  icon="search"
  title="No results found"
  description="Try adjusting your search or filters."
/>
```

For skeleton loading of specific elements, see §7.2 (Skeleton). For skeleton loading in data tables, use `loadingOptions` on `<Table2>`, `<Column>`, or `<Cell>`.

---

## 11. Accessibility

- Always provide `aria-label` on icon-only Buttons: `<Button icon="trash" aria-label="Delete item" />`
- Maintain heading hierarchy — use `<H1>` through `<H6>` in order.
- Avoid use `<div onClick>` without also adding `onKeyDown`, `role="button"`, and `tabIndex={0}`.
- Use `tabIndex={0}` or `tabIndex={-1}` — never positive values.
- Use Blueprint's `<Switch>` or `<Checkbox>` instead of custom toggle divs.

---

## 12. Component Code Quality

- **Function components only** — no class components.
- **Named exports only** — no default exports.
- **TypeScript interfaces** for all component props.
- Use `React.memo` for expensive renders with stable props.
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders, especially in list item renderers and callbacks passed to Blueprint's `Select`, `MultiSelect`, and `Table2`.
- Extract helper components and utilities to keep components focused.

---

## 13. Common Anti-Patterns — Quick Reference

| Anti-Pattern | Fix |
|---|---|
| Hardcoded `px` values for spacing | Use `bp.$pt-spacing` multiples |
| Inline hex colors | Use Blueprint color variables or `intent` |
| Raw `<table>` | Use `<HTMLTable>` or `<Table2>` |
| Wrapping Blueprint components in styled divs | Pass `className` directly |
| `<div onClick>` without keyboard support | Add `onKeyDown`, `role`, `tabIndex` |
| Default exports | Named exports only |
| Class components | Function components with hooks |
| `<input type="date">` | `<DateInput>` from `@blueprintjs/datetime` |
| `<HTMLSelect>` for complex selection | `<Select>` from `@blueprintjs/select` |
| `disabled` when async is in progress | `loading={true}` on Button |
| `intent="primary"` on everything | One primary per visible action group |
| Boolean `large` / `minimal` props | `size="large"`, `variant="minimal"` |
| Raw `"bp6-dark"` strings | `Classes.DARK` constant |
| Custom section header + collapse logic | `<Section>` component |
| Custom key-value badges | `<CompoundTag>` with `leftContent` |
| Custom empty/error states | `<NonIdealState>` |
| Custom font sizes / font families | Blueprint typography (`H1`–`H6`, SCSS vars) |
| `<Popover>` | `<PopoverNext>` (built on Floating UI) |
| `<Overlay>` | `<Overlay2>` |
| `window.confirm()` for destructive actions | `<Alert>` with `intent="danger"` |
| Custom drill-down / back-button navigation | `<PanelStack2>` |
| Custom loading shimmer / placeholder | `Classes.SKELETON` on sized elements |
| Custom progress bar | `<ProgressBar>` with `intent` and optional `value` |
| Custom tree / nested list | `<Tree>` with `TreeNodeInfo` nodes |
| Using `<Dialog>` for simple confirmations | `<Alert>` — simpler, purpose-built |
| Rendering `<Toast>` directly | `OverlayToaster.create()` + `toaster.show()` |

## Blueprint Packages

| Package                 | Install                             | NPM                                                              | Description                                                                |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `@blueprintjs/core`     | `npm install @blueprintjs/core`     | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/core)     | Buttons, dialogs, menus, toasts, overlays, and all foundational components |
| `@blueprintjs/icons`    | `npm install @blueprintjs/icons`    | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/icons)    | 500+ SVG icons and the `IconNames` constants                               |
| `@blueprintjs/select`   | `npm install @blueprintjs/select`   | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/select)   | Typeahead select, multi-select, suggest, and omnibar components            |
| `@blueprintjs/table`    | `npm install @blueprintjs/table`    | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/table)    | Spreadsheet-like table with sortable, editable, resizable columns          |
| `@blueprintjs/datetime` | `npm install @blueprintjs/datetime` | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/datetime) | Date pickers, date range pickers, and time pickers                         |
| `@blueprintjs/labs`     | `npm install @blueprintjs/labs`     | [npmjs.com](https://www.npmjs.com/package/@blueprintjs/labs)     | Experimental components (Box, Flex); API may change without notice         |
