---
name: Blueprint Docs Restructurer
description: Reorganizes existing Blueprint component documentation into a standardized page structure. Use when reformatting a Blueprint docs page.
---

# Blueprint Docs Restructurer

Reorganize an existing Blueprint component documentation page
into a standardized structure. Use the existing lanugage on the page
as a guide for your copy/narrative voice.

Youre additionally tasked with creating new reactCodeExample(s) for
components that are all lacking in depth of examples.
packages/core/src/components/button/buttons.md and
packages/core/src/components/button/button-group.md are both good examples
of example-rich pages of documentation. By contrast,
packages/core/src/components/navbar/navbar.md is severely lacking in examples.

Do not invent modify or create new prop descriptions.

## Target Page Skeleton

Every component page must follow this section order.
Do not deviate. If a section has no existing content to fill it,
omit it — do not create content to fill gaps.

```
@# ComponentName

[one-line description]

[hero example — the existing "basic usage" or first example on the page]

@## Import

@## Usage

[existing basic JSX usage snippet, if present]

@## Examples

@### [Example heading]
@### [Example heading]
...

@## Interactive Playground (if one exists)

@## Props interface
```

## Rules

### 1. One-Line Description

Rewrite the opening description as no more than three sentences.
Describe what the component IS structurally,
not what it does for the user or when to use it.

**Before (Blueprint today):**
> The **ButtonGroup** component arranges related buttons
in a horizontal row or vertical stack, providing alignment
and consistent spacing for a layout of related actions.

**After:**
> A horizontal or vertical layout for grouping related action buttons.

**Before:**
> The **Collapse** component reveals and hides content with
a smooth sliding animation. It is commonly used to create expandable
sections, like settings panels, sub-sections, or FAQs.

**After:**
> An animated container that expands and collapses to reveal or hide content.

Formula: `[Article] [structural noun phrase] that [core behavior].`

Do not include use-case suggestions ("commonly used for..."),
implementation details, or prop behavior in this line. UNLESS it feels that
this is a particularly nuanced component that only fits specific uses.

If the existing page has important behavioral context in
its opening paragraphs (like ButtonGroup's note about prop cascading),
move that content into the relevant example description
or into a note below the description — do not discard it.

### 2. Hero Example

Take the first or most basic existing example on the page
and promote it to appear immediately after the one-line description,
before any other sections.
This is the "default, out-of-the-box" look of the component.
If one doesn't exist, you should create a new example for this purpose.

If the page has a suitable `@reactCodeExample` for basic usage, use that.
Never use the larger `@reactExample` playground.

The Hero example shouldnt be repeated. Meaning that if we create or use a basic example
we don't want to use it again later in the docs. This is an additive note.
Its better to opt for an additional example, than it is to reuse one.
If the user were to read through the docs and find an example identical to the
initial HERO example, it would likely feel quite redundant to them.

### 3. Import Section

Keep the import section.
It should contain only the import code block — no prose.
If the existing page has explanatory text around the import, remove it.

### 4. Usage Section

If the existing page has a basic JSX snippet showing minimal
usage (distinct from the import), place it here.
If the page does not have one, you may create a usage snippet.

### 5. Examples Section

Flatten all existing mid-page sections
(e.g., "Intent", "Variant", "Size", "Flex layout",
"Vertical layout", "Usage with popovers", "Keeping children mounted",
"Overflow", "Customizing breadcrumbs") under a single
`@## Examples` heading as `@###` sub-sections.

Ideally we have a simple example available per "prop" that exists
for the component. 

#### Example Heading Convention

Rename headings using these rules, in priority order:

1. **Single prop:** Use the prop name. "Intent", "Size", "Variant", "Disabled"
2. **Composition with another component:** Use "With [Component]". "With Popover", "With Card", "With OverflowList"
3. **Behavioral pattern:** Use a short noun phrase (no gerunds). "Flex layout", "Vertical layout", "Custom rendering", "Controlled state"

Avoid phrases like "Keeping children mounted" or
"Customizing breadcrumbs".
Rewrite as "Keep mounted" or "Custom renderer".

#### Example Description Convention

Rewrite each example's description using this formula:

**Primary (for prop-driven examples):**
> Use the `[prop]` prop to [effect].

**With default-then-override context (when the existing text explains default behavior):**
> By default, [ComponentName] [default behavior].
Use the `[prop]` prop to [override].

**For compositions:**
> Wrap [ComponentName] with [OtherComponent] to [effect].

Keep descriptions to one or two sentences. No more than three, where necessary.
If the existing page has multi-sentence or bulleted explanations,
condense to the formulaic sentence above.
If important detail would be lost, add at most one additional sentence.

Do not add rationale ("This is useful when...")
unless the existing text contains it AND it is essential to
understanding the prop. When in doubt, cut it.

#### Deprecation Notices

If the existing page has deprecation callouts,
keep them but move them inline with the relevant example,
not as standalone sections.

If the whole component is deprecated, like Overlay, keep the
callout at the start of the page.

### 6. Interactive Playground

If the page has an existing `@reactExample ...PlaygroundExample`,
keep it in its own section AFTER Examples. Do not rename or restructure it.

### 7. Props Interface

Keep `@interface` tags as-is at the bottom of the page.
Do not restructure prop documentation.

### 8. Sub-Component Documentation

If the page documents sub-components (like Breadcrumb within Breadcrumbs), keep them after the main Props interface. Each sub-component should have a one-sentence description followed by its `@interface` tag.

Rewrite sub-component descriptions to follow the formula:
> [What it represents or does in the component tree].

**Before:**
> The **Breadcrumb** component renders an `a.@ns-breadcrumb`
if an `href` or `onClick` is provided; otherwise, it renders
a `span.@ns-breadcrumb`. Typically, breadcrumbs are supplied as an array
of `BreadcrumbProps` to the `items` prop of **Breadcrumbs**,
but the component can also be used directly when implementing a
custom `breadcrumbRenderer`.

**After:**
> An individual breadcrumb item. Renders as an anchor if `href` or
`onClick` is provided, otherwise as a span.

Move the additional context ("Typically, breadcrumbs are supplied as an array...")
into the relevant example description if it isn't already covered there.

### 9. "Best practices"

The last part of the docs will always be the props table. Just before the props table
I want you to add a section called "Best practices" that advises the user on
DOs and DONTs for the component. For example we might indicate to a reader that the DANGER intent
shouldnt be used just because the user wants a red color. Instead it would be used
to denote something like a permanent action (deletion) or an error. Similarly,
we might advise a user that tooltips should be used sparingly and arent necessary
for buttons that already use text to describe the action that the button executes. 

## What NOT To Do

- Do not remove existing code examples. Every example on the current page should appear in the output.
- Do not invent prop descriptions, usage guidance, or behavioral notes not present in the original.
- Do not change Documentalist syntax (`@#`, `@##`, `@interface`, `@reactCodeExample`, `@reactExample`, `@ns-*` class references). Preserve these as-is.
- Do not remove cross-references or links to other Blueprint components.
- Do not restructure the Props interface tables or `@interface` declarations.
- Do not remove the Interactive Playground if one exists.

## Example Transformation

### Input (abbreviated)

```md
@# Collapse

The **Collapse** component reveals and hides content with a smooth sliding animation.
It is commonly used to create expandable sections, like settings panels, sub-sections, or FAQs.

@## Import

...

@## Usage

The **Collapse** component wraps its children and toggles their visibility...

@reactCodeExample CollapseBasicExample

@## Keeping children mounted

By default, **Collapse** removes its children from the DOM when the collapse is closed.
This improves performance... To keep the content mounted, use the `keepChildrenMounted` prop.

@reactCodeExample CollapseMountedExample

@## Interactive Playground

@reactExample CollapsePlaygroundExample

@## Props interface

@interface CollapseProps
```

### Output (abbreviated)

```md
@# Collapse

An animated container that expands and collapses to reveal or hide content.

@reactCodeExample CollapseBasicExample

@## Import

...

@## Examples

@### Basic

Use the `isOpen` prop to control whether content is visible. Content must be in the normal
document flow, as Collapse calculates height to animate the transition.

@reactCodeExample CollapseBasicExample

@### Keep mounted

By default, Collapse removes children from the DOM when closed. Use the `keepChildrenMounted`
prop to keep content mounted while hidden.

@reactCodeExample CollapseMountedExample

@## Interactive Playground

@reactExample CollapsePlaygroundExample

@### Best practices

@## Props interface

@interface CollapseProps
```

# Adding `@reactCodeExample` to a Component's Documentation

Below describes how to add live, interactive React code examples to any component's documentation page. The system has four layers, each in a different package, that must all be wired together.

## Overview

When a component's `.md` file contains `@reactCodeExample ExampleName`, the docs pipeline:

1. **Build time** — Documentalist parses the markdown tag into structured JSON in `docs.json`
2. **Runtime** — `ReactCodeExampleTagRenderer` looks up `ExampleName` in a registry and renders the matching component, along with its source code and a preview snippet

The registry is assembled automatically from barrel exports. You just need to follow the file conventions below.

---

## Layer 1 — Example component files

**Where:** `packages/docs-app/src/examples/<package>-examples/<component>/`

For each example, create two files:

### `<ExampleName>.tsx`

A standalone React component that default-exports the rendered example. It should be self-contained — import everything it needs from `@blueprintjs/*`.

```tsx
import { SomeComponent } from "@blueprintjs/core";

export default function ExampleName() {
  return <SomeComponent prop="value">Content</SomeComponent>;
}
```

### `<ExampleName>.tsx.preview`

A plain-text file containing just the JSX snippet displayed as "preview code" in the docs UI. This is typically the core JSX from the component above, without imports or function wrapping.

```tsx
<SomeComponent prop="value">Content</SomeComponent>
```

### Naming conventions

- PascalCase, prefixed with the component name: `ButtonBasic`, `CardIntent`, `DialogSize`
- The prefix groups examples together and avoids collisions across components

---

## Layer 2 — Examples barrel file

**Where:** `packages/docs-app/src/examples/<package>-examples/<component>Examples.tsx`

This file is the glue. For each example it:

- Imports the default component from Layer 1
- Imports the `.tsx` source as raw text (via `?raw` Vite suffix)
- Imports the `.tsx.preview` source as raw text (via `?raw` Vite suffix)
- Exports a named `<ExampleName>Example` component wrapping everything in `<CodeExample>`

```tsx
import { CodeExample, type ExampleProps } from "@blueprintjs/docs-theme";

import ExampleName from "./<component>/ExampleName";
import exampleNamePreview from "./<component>/ExampleName.tsx.preview?raw";
import exampleNameCode from "./<component>/ExampleName.tsx?raw";

export const ExampleNameExample: React.FC<ExampleProps> = (props) => {
  return (
    <CodeExample
      previewCode={exampleNamePreview}
      sourceCode={exampleNameCode}
      {...props}
    >
      <ExampleName />
    </CodeExample>
  );
};
```

The **exported name** (e.g. `ExampleNameExample`) is the exact string referenced in the markdown. See `buttonExamples.tsx` for a full real-world example.

---

## Layer 3 — Register in the barrel index

**Where:** `packages/docs-app/src/examples/<package>-examples/index.ts`

Add an export so the example registry picks it up:

```ts
export * from "./<component>Examples";
```

This feeds into `packages/docs-app/src/tags/reactExamples.ts`, which aggregates all package example exports into the runtime registry via wildcard imports. **No changes are needed in `reactExamples.ts`** — the wildcard handles it.

---

## Layer 4 — Reference in the component's `.md`

**Where:** `packages/<package>/src/components/<component>/<component>.md`

Place the tag wherever you want the live example to appear:

```md
@reactCodeExample ExampleNameExample
```

Multiple examples can appear in the same `.md` file. Place them inline with the surrounding documentation:

```md
@## Basic usage

@reactCodeExample ButtonBasicExample

@## Intents

@reactCodeExample ButtonIntentExample
```

---

## Deciding what examples to create

- **Components with many props:** one example per notable prop or prop combination
- **Components with a small API surface:** a few examples showing the component used in combination with other components

---

## Checklist

For a component called `Widget` in the `core` package:

- [ ] Create `packages/docs-app/src/examples/core-examples/widget/` directory
- [ ] For each example, create `WidgetXxx.tsx` and `WidgetXxx.tsx.preview` in that directory
- [ ] Create `packages/docs-app/src/examples/core-examples/widgetExamples.tsx` barrel file
- [ ] Add `export * from "./widgetExamples";` to `packages/docs-app/src/examples/core-examples/index.ts`
- [ ] Add `@reactCodeExample WidgetXxxExample` tags to `packages/core/src/components/widget/widget.md`
- [ ] Verify docs build compiles

