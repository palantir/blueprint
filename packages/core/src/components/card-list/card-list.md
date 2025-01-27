---
tag: new
---

@# Card List

**CardList** is a lightweight wrapper around the [**Card**](#core/components/card) component.
It groups cards visually into a list without adding extra visual weight or spacing between them.
Long lists can be styled with CSS for vertical scrolling.

@## Import

```tsx
import { CardList } from "@blueprintjs/core";
```

@## Usage

Use **CardList** to group multiple cards together in a vertical list.

@reactCodeExample CardListBasicExample

@## Bordered

To remove borders, set `bordered={false}`. This creates a seamless appearance
when nesting **CardList** within other components.

@reactCodeExample CardListBorderedExample

@## Compact

Enable the `compact` prop to reduce the padding inside each card in the list.

@reactCodeExample CardListCompactExample

@## Combining with section

The **CardList** component can be embedded in a [**Section**](#core/components/section)
component to add a title or description above the list.

Set the same value for `<SectionCard padded>` and `<CardList bordered>`
(either `true` or `false` for both) to get two different kinds of appearances.

@reactCodeExample CardListSectionExample

@## Interactive Playground

@reactExample CardListPlaygroundExample

@## Props interface

@interface CardListProps
